# Backend

## Setup

```bash
cd triolingo
python -m venv venv
.\venv\Scripts\activate      # Windows
source venv/bin/activate     # Mac/Linux
pip install -r requirements.txt
```

Set your API key:
```bash
set GEMINI_API_KEY=your-key   # Windows
export GEMINI_API_KEY=your-key # Mac/Linux
```

Run the server:
```bash
uvicorn backend.app.main:app --reload --port 8000
```

## Structure

```
backend/
├── app/
│   ├── main.py          # FastAPI app, CORS, mounts all routers
│   ├── models.py        # Pydantic schemas (UserProfile, GraphNode, GraphEdge, etc.)
│   ├── graph_store.py   # In-memory graph storage (NetworkX), load/save/update
│   ├── path_engine.py   # Finds frontier nodes (no LLM, pure graph traversal)
│   ├── llm.py           # Gemini 2.0 Flash wrapper — all LLM calls go through call_llm()
│   └── routers/
│       ├── graph.py         # GET /graph, GET /graph/{user_id}
│       ├── personalize.py   # POST /personalize
│       ├── assess.py        # POST /assess, POST /assess/grade
│       ├── session.py       # GET /next-session/{user_id}
│       └── exercise.py      # POST /exercise, POST /exercise/grade
└── data/
    └── base_graph.json  # Base knowledge graph — needs to be populated
```

## API Endpoints

| Endpoint | Method | What it does |
|---|---|---|
| `/health` | GET | Health check |
| `/graph` | GET | Returns base graph |
| `/graph/{user_id}` | GET | Returns a user's personalized graph |
| `/personalize` | POST | Takes a UserProfile, returns personalized graph |
| `/assess` | POST | Generates assessment questions for unknown nodes |
| `/assess/grade` | POST | Grades an assessment answer |
| `/next-session/{user_id}` | GET | Returns frontier nodes as a session plan |
| `/exercise` | POST | Generates a practice exercise for a node |
| `/exercise/grade` | POST | Grades an exercise answer, updates node state |

## Key Notes

- **No database** — everything is in-memory dicts. Server restart = state reset.
- **base_graph.json** must be populated before `/graph` or `/personalize` will return useful data. Schema is `{"nodes": [...], "edges": [...]}` — see `models.py` for node/edge shapes.
- **CORS is open** (`*`) so the frontend can hit the API from any origin.
- **LLM is swappable** — all calls go through `call_llm(system, prompt)` in `llm.py`. Currently using Gemini 2.0 Flash.
