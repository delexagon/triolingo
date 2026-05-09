import json
import logging

import networkx as nx
from fastapi import APIRouter, HTTPException

from ..graph_store import get_base_graph, set_user_graph, set_user_profile
from ..llm import call_llm
from ..models import (
    GraphEdge,
    GraphNode,
    KnowledgeGraph,
    PersonalizeResponse,
    UserProfile,
)

router = APIRouter()
logger = logging.getLogger(__name__)


def build_personalize_prompt(profile: UserProfile, base: KnowledgeGraph) -> tuple[str, str]:
    system = (
        "You are a language learning curriculum designer. "
        "Given a learner profile and a base knowledge graph, decide which nodes belong in "
        "the learner's personalized subgraph and which the learner likely already knows.\n\n"
        "Return ONLY valid JSON in this exact shape, no prose, no code fences:\n"
        '{ "keep": ["node_id", ...], "known": ["node_id", ...] }\n\n'
        "Rules:\n"
        "- Only use node IDs that appear in the base graph.\n"
        '- "known" must be a subset of "keep".\n'
        "- Pick nodes relevant to the learner's goal and timeline; drop irrelevant ones.\n"
        '- Mark as "known" the nodes a learner at the given experience level has already mastered.'
    )

    prompt = (
        f"Learner profile:\n"
        f"- Language: {profile.language}\n"
        f"- Goal: {profile.goal}\n"
        f"- Timeline: {profile.timeline}\n"
        f"- Experience: {profile.experience_level}\n\n"
        f"Base knowledge graph:\n{base.model_dump_json(indent=2)}"
    )

    return system, prompt


def parse_llm_selection(raw: str) -> tuple[list[str], list[str]]:
    cleaned = raw.strip()
    if cleaned.startswith("```"):
        cleaned = cleaned.split("\n", 1)[1].rsplit("```", 1)[0]
    elif cleaned.startswith("```json"):
        cleaned = cleaned.split("\n", 1)[1].rsplit("```", 1)[0]

    data = json.loads(cleaned)
    keep = list(data.get("keep", []))
    known = list(data.get("known", []))
    return keep, known


def extract_subgraph(
    base: KnowledgeGraph, keep_ids: list[str], known_ids: list[str]
) -> KnowledgeGraph:
    base_node_ids = {n.id for n in base.nodes}
    keep_set = {nid for nid in keep_ids if nid in base_node_ids}
    known_set = {nid for nid in known_ids if nid in keep_set}

    g = nx.DiGraph()
    for node in base.nodes:
        g.add_node(node.id, **node.model_dump())
    for edge in base.edges:
        g.add_edge(edge.source, edge.target, relationship=edge.relationship)

    sub = g.subgraph(keep_set).copy()

    nodes = []
    for nid in sub.nodes:
        attrs = dict(sub.nodes[nid])
        attrs["status"] = "known" if nid in known_set else "unknown"
        nodes.append(GraphNode(**attrs))
    edges = [
        GraphEdge(source=u, target=v, relationship=d["relationship"])
        for u, v, d in sub.edges(data=True)
    ]
    return KnowledgeGraph(nodes=nodes, edges=edges)


@router.post("/personalize", response_model=PersonalizeResponse)
def personalize(profile: UserProfile):
    base = get_base_graph()
    system, prompt = build_personalize_prompt(profile, base)

    logger.info("=== /personalize LLM request ===\nSYSTEM:\n%s\n\nPROMPT:\n%s\n=== end ===", system, prompt)

    raw = call_llm(system, prompt)
    logger.info("=== /personalize LLM response ===\n%s\n=== end ===", raw)

    try:
        keep_ids, known_ids = parse_llm_selection(raw)
    except (json.JSONDecodeError, ValueError) as e:
        raise HTTPException(status_code=502, detail=f"LLM returned malformed JSON: {e}") from e

    personalized = extract_subgraph(base, keep_ids, known_ids)
    logger.info(
        "Subgraph built: %d/%d nodes kept, %d marked known, %d edges",
        len(personalized.nodes), len(base.nodes), sum(1 for n in personalized.nodes if n.status == "known"), len(personalized.edges),
    )

    # Use a simpler user_id for easier testing if needed, or keep the hash
    user_id = f"{profile.language}_{profile.goal}_{hash(profile.model_dump_json()) % 10000}"
    user_id = user_id.replace(" ", "_").lower()
    
    set_user_graph(user_id, personalized)
    set_user_profile(user_id, profile)

    return PersonalizeResponse(graph=personalized, llm_system=system, llm_prompt=prompt, llm_response=raw)
