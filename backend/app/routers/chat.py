import json
from fastapi import APIRouter, HTTPException

from ..models import ChatRequest, ChatResponse, Message
from ..graph_store import get_user_profile, get_chat_history, add_chat_message, get_user_graph
from ..path_engine import get_frontier_nodes
from ..llm import chat_llm

router = APIRouter()

@router.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest):
    try:
        profile = get_user_profile(req.user_id)
        g = get_user_graph(req.user_id)
    except KeyError:
        raise HTTPException(status_code=404, detail="User not found or not personalized yet")

    # Get recommended nodes to focus the conversation
    frontier = get_frontier_nodes(g)
    frontier_concepts = ", ".join(f"{n['label']} ({n['type']})" for n in frontier)

    # Build the dynamic system prompt
    system_prompt = (
        f"You are LinguaAI, an interactive, highly adaptive conversational language tutor for {profile.language}. "
        f"Unlike traditional apps that just drill sentences, your job is to have a real conversation with the user, "
        f"answer their questions, explain idioms, vocabulary, and grammar in context. "
        f"Adapt your language, tone, and complexity to the user's experience level: {profile.experience_level}. "
        f"Their primary goal is: {profile.goal}. Their timeline is: {profile.timeline}. "
    )
    
    if frontier_concepts:
        system_prompt += (
            f"\n\nRight now, the optimal concepts for them to learn next are: {frontier_concepts}. "
            f"Try to gently steer the conversation to practice these concepts or incorporate them into your responses "
            f"when natural. Do not be overly robotic; remain friendly and conversational."
        )

    # Prepare message history for the LLM
    llm_messages = [{"role": "system", "content": system_prompt}]
    
    # Load previous conversation history
    history = get_chat_history(req.user_id)
    for msg in history:
        llm_messages.append({"role": msg.role, "content": msg.content})
        
    # Append the new user message
    user_msg = Message(role="user", content=req.message)
    add_chat_message(req.user_id, user_msg)
    llm_messages.append({"role": "user", "content": req.message})
    
    # Call the LLM
    response_text = chat_llm(llm_messages)
    
    # Save the assistant's response
    assistant_msg = Message(role="assistant", content=response_text)
    add_chat_message(req.user_id, assistant_msg)
    
    return ChatResponse(
        message=response_text,
        recommended_nodes=frontier
    )
