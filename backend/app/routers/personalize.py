import json

from fastapi import APIRouter

from ..graph_store import get_base_graph, set_user_graph, set_user_profile
from ..llm import call_llm
from ..models import UserProfile, KnowledgeGraph

router = APIRouter()


@router.post("/personalize")
def personalize(profile: UserProfile):
    base = get_base_graph()

    system = (
        "You are a language learning curriculum designer. "
        "Given a learner profile and a base knowledge graph, personalize the graph: "
        "1) Remove nodes irrelevant to the learner's goal. "
        "2) Mark nodes the learner likely already knows as 'known' based on their experience level. "
        "3) Keep all remaining nodes as 'unknown'. "
        "Return ONLY valid JSON matching the original graph schema with 'nodes' and 'edges' arrays. "
        "Do not include edges that reference removed nodes."
    )

    prompt = (
        f"Learner profile:\n"
        f"- Language: {profile.language}\n"
        f"- Goal: {profile.goal}\n"
        f"- Timeline: {profile.timeline}\n"
        f"- Experience: {profile.experience_level}\n\n"
        f"Base graph:\n{base.model_dump_json()}"
    )

    result = call_llm(system, prompt)

    cleaned = result.strip()
    if cleaned.startswith("```"):
        cleaned = cleaned.split("\n", 1)[1].rsplit("```", 1)[0]
    elif cleaned.startswith("```json"):
        cleaned = cleaned.split("\n", 1)[1].rsplit("```", 1)[0]

    data = json.loads(cleaned)
    personalized = KnowledgeGraph(**data)

    # Use a simpler user_id for easier testing if needed, or keep the hash
    user_id = f"{profile.language}_{profile.goal}_{hash(profile.model_dump_json()) % 10000}"
    user_id = user_id.replace(" ", "_").lower()
    
    set_user_graph(user_id, personalized)
    set_user_profile(user_id, profile)

    return {"user_id": user_id, "graph": personalized.model_dump()}
