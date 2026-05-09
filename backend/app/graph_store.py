import json
from pathlib import Path

import networkx as nx

from .models import KnowledgeGraph, GraphNode, GraphEdge, UserProfile, Message

BASE_GRAPH_PATH = Path(__file__).parent.parent / "data" / "base_graph.json"

_user_graphs: dict[str, nx.DiGraph] = {}
_user_profiles: dict[str, UserProfile] = {}
_chat_histories: dict[str, list[Message]] = {}


def _load_base_graph() -> KnowledgeGraph:
    with open(BASE_GRAPH_PATH) as f:
        data = json.load(f)
    return KnowledgeGraph(
        nodes=[GraphNode(**n) for n in data["nodes"]],
        edges=[GraphEdge(**e) for e in data["edges"]],
    )


def _kg_to_nx(kg: KnowledgeGraph) -> nx.DiGraph:
    g = nx.DiGraph()
    for node in kg.nodes:
        g.add_node(node.id, **node.model_dump())
    for edge in kg.edges:
        g.add_edge(edge.source, edge.target, relationship=edge.relationship)
    return g


def _nx_to_kg(g: nx.DiGraph) -> KnowledgeGraph:
    nodes = [GraphNode(**g.nodes[n]) for n in g.nodes]
    edges = [
        GraphEdge(source=u, target=v, relationship=d["relationship"])
        for u, v, d in g.edges(data=True)
    ]
    return KnowledgeGraph(nodes=nodes, edges=edges)


def get_base_graph() -> KnowledgeGraph:
    return _load_base_graph()


def get_user_graph(user_id: str) -> nx.DiGraph:
    return _user_graphs[user_id]


def set_user_graph(user_id: str, kg: KnowledgeGraph) -> None:
    _user_graphs[user_id] = _kg_to_nx(kg)


def update_node_status(user_id: str, node_id: str, status: str) -> None:
    g = _user_graphs[user_id]
    g.nodes[node_id]["status"] = status


def get_user_kg(user_id: str) -> KnowledgeGraph:
    return _nx_to_kg(_user_graphs[user_id])


def set_user_profile(user_id: str, profile: UserProfile) -> None:
    _user_profiles[user_id] = profile


def get_user_profile(user_id: str) -> UserProfile:
    return _user_profiles[user_id]


def get_chat_history(user_id: str) -> list[Message]:
    if user_id not in _chat_histories:
        _chat_histories[user_id] = []
    return _chat_histories[user_id]


def add_chat_message(user_id: str, message: Message) -> None:
    if user_id not in _chat_histories:
        _chat_histories[user_id] = []
    _chat_histories[user_id].append(message)
