from fastapi import APIRouter, HTTPException

from ..graph_store import get_user_graph
from ..path_engine import get_frontier_nodes

router = APIRouter()


@router.get("/next-session/{user_id}")
def next_session(user_id: str):
    try:
        g = get_user_graph(user_id)
    except KeyError:
        raise HTTPException(status_code=404, detail="User graph not found")

    frontier = get_frontier_nodes(g)
    return {"user_id": user_id, "recommended_nodes": frontier}