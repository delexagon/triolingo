import json

from fastapi import APIRouter, HTTPException

from ..graph_store import get_user_graph, update_node_status, get_user_kg
from ..llm import call_llm
from ..models import AssessmentRequest, AssessmentAnswer

router = APIRouter()


@router.post("/assess")
def assess(req: AssessmentRequest):
    """Generate assessment questions for unknown nodes in a graph region."""
    graph = req.graph
    unknown_nodes = [n for n in graph.nodes if n.status == "unknown"]
    if req.region:
        unknown_nodes = [n for n in unknown_nodes if req.region in n.tags]

    if not unknown_nodes:
        return {"questions": [], "message": "No unknown nodes to assess"}

    target_nodes = unknown_nodes[:5]

    system = (
        "You are a language assessment expert. Generate diagnostic questions to test "
        "whether a learner knows specific language concepts. Return JSON: "
        '{"questions": [{"id": "q1", "node_id": "<node_id>", "question": "<text>", "expected_answer": "<text>"}]}'
    )

    prompt = (
        f"Generate one question per concept to assess these nodes:\n"
        + "\n".join(f"- {n.id}: {n.label} ({n.type})" for n in target_nodes)
    )

    result = call_llm(system, prompt)
    cleaned = result.strip()
    if cleaned.startswith("```"):
        cleaned = cleaned.split("\n", 1)[1].rsplit("```", 1)[0]

    return json.loads(cleaned)


@router.post("/assess/grade")
def grade_assessment(answer: AssessmentAnswer):
    """Grade an assessment answer and update the node state."""
    try:
        g = get_user_graph(answer.user_id)
    except KeyError:
        raise HTTPException(status_code=404, detail="User graph not found")

    node_data = g.nodes[answer.question_id.split("_")[0]] if "_" in answer.question_id else {}

    system = (
        "You are a language assessment grader. Given a question context and student answer, "
        'respond with JSON: {"status": "known" | "weak" | "unknown", "feedback": "<brief feedback>"}'
    )

    prompt = f"Question ID: {answer.question_id}\nStudent answer: {answer.answer}"

    result = call_llm(system, prompt)
    cleaned = result.strip()
    if cleaned.startswith("```"):
        cleaned = cleaned.split("\n", 1)[1].rsplit("```", 1)[0]

    graded = json.loads(cleaned)
    return graded
