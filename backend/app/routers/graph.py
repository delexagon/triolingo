from fastapi import APIRouter, HTTPException

from ..graph_store import get_base_graph, get_user_kg
from ..models import KnowledgeGraph

router = APIRouter()


@router.get("/graph", response_model=KnowledgeGraph)
def graph():
    return get_base_graph()


@router.get("/graph/{user_id}", response_model=KnowledgeGraph)
def user_graph(user_id: str):
    try:
        return get_user_kg(user_id)
    except KeyError:
        raise HTTPException(status_code=404, detail="User graph not found")
