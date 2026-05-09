import networkx as nx


def get_frontier_nodes(g: nx.DiGraph, limit: int = 5) -> list[dict]:
    """Find unknown nodes whose prerequisites are all known."""
    frontier = []
    for node_id, data in g.nodes(data=True):
        if data["status"] != "unknown":
            continue
        predecessors = list(g.predecessors(node_id))
        prereq_edges = [
            (u, node_id)
            for u in predecessors
            if g.edges[u, node_id]["relationship"] == "prerequisite"
        ]
        if all(g.nodes[u]["status"] == "known" for u, _ in prereq_edges):
            frontier.append(data)

    frontier.sort(key=lambda n: (n["difficulty"], n["id"]))
    return frontier[:limit]
