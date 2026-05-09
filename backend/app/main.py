from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routers import graph, personalize, assess, session, exercise, chat

app = FastAPI(title="Triolingo API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(graph.router)
app.include_router(personalize.router)
app.include_router(assess.router)
app.include_router(session.router)
app.include_router(exercise.router)
app.include_router(chat.router)


@app.get("/health")
def health():
    return {"status": "ok"}
