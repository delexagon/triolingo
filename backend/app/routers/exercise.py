import json

from fastapi import APIRouter, HTTPException

from ..graph_store import get_user_graph, update_node_status, get_user_kg
from ..llm import call_llm
from ..models import ExerciseRequest, GradeRequest

router = APIRouter()


@router.post("/exercise")
def generate_exercise(req: ExerciseRequest):
    try:
        g = get_user_graph(req.user_id)
    except KeyError:
        raise HTTPException(status_code=404, detail="User graph not found")

    node = g.nodes[req.node_id]

    system = (
        "You are a language exercise generator. Create a practice exercise for the given concept. "
        "Return JSON: "
        '{"exercise_id": "<id>", "type": "fill_blank" | "translate" | "multiple_choice", '
        '"prompt": "<text>", "options": ["<if multiple choice>"], "correct_answer": "<text>"}'
    )

    prompt = f"Create an exercise for: {node['label']} ({node['type']}, difficulty {node['difficulty']})"

    result = call_llm(system, prompt)
    cleaned = result.strip()
    if cleaned.startswith("```"):
        cleaned = cleaned.split("\n", 1)[1].rsplit("```", 1)[0]

    return json.loads(cleaned)


@router.post("/exercise/grade")
def grade_exercise(req: GradeRequest):
    try:
        g = get_user_graph(req.user_id)
    except KeyError:
        raise HTTPException(status_code=404, detail="User graph not found")

    system = (
        "You are a language exercise grader. Grade the student's answer. "
        'Return JSON: {"correct": true/false, "status": "known" | "weak" | "unknown", '
        '"feedback": "<brief feedback>"}'
    )

    node = g.nodes[req.node_id]
    prompt = (
        f"Concept: {node['label']}\n"
        f"Exercise ID: {req.exercise_id}\n"
        f"Student answer: {req.answer}"
    )

    result = call_llm(system, prompt)
    cleaned = result.strip()
    if cleaned.startswith("```"):
        cleaned = cleaned.split("\n", 1)[1].rsplit("```", 1)[0]

    graded = json.loads(cleaned)

    update_node_status(req.user_id, req.node_id, graded["status"])

    return {**graded, "updated_graph": get_user_kg(req.user_id).model_dump()}
