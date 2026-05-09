# Adaptive Language Learning Graph

## What It Is

An AI-powered language learning tool that builds a personalized knowledge graph for each learner. Instead of a flat lesson list, learners see a visual map of concepts — vocabulary, grammar, conversational patterns — connected by prerequisites. The system assesses what they already know, lights up the graph accordingly, and recommends what to learn next based on their goals, timeline, and skill gaps.

## How It Works

1. User provides their language, goal, timeline, and experience level
2. A base knowledge graph (60–80 nodes) gets personalized — irrelevant nodes pruned, known nodes pre-marked, remaining nodes weighted by relevance
3. A short LLM-driven assessment validates what the user actually knows, updating node states on the graph
4. A path engine detects frontier nodes (unknown nodes whose prerequisites are met) and recommends what to learn next
5. LLM generates practice exercises for recommended nodes
6. User completes exercises, graph updates, new recommendations appear — loop continues

## Data Flow

```
User Profile → Personalize Base Graph → Assessment → Update Node States → Path Engine → Exercises → Loop
```

## Components

- **Base Graph** — pre-generated JSON, 60–80 nodes with prerequisite/related edges, difficulty tiers, topic tags
- **Personalization Engine** — LLM prunes, marks, and reweights the base graph from user profile
- **Assessment** — LLM generates diagnostic questions mapped to graph regions, grades answers, updates node states (known/weak/unknown)
- **Path Engine** — graph traversal logic, no LLM, finds frontier nodes ranked by relevance and difficulty
- **Exercise Generator** — LLM produces practice items per node, grades responses, updates graph
- **API Layer** — FastAPI, connects all components
- **Frontend** — React, onboarding form, force-directed graph visualization, assessment chat, exercise UI

## Tech Stack

- **Backend:** Python, FastAPI
- **Graph:** NetworkX (in-memory)
- **LLM:** Claude Sonnet (claude-sonnet-4-20250514) via Anthropic API for all runtime calls
- **Frontend:** React, react-force-graph-2d
- **Storage:** In-memory dicts, no database

## API Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/graph` | GET | Returns base graph |
| `/personalize` | POST | Takes user profile, returns personalized graph |
| `/assess` | POST | Generates assessment questions or grades answers |
| `/next-session` | GET | Returns frontier nodes as session plan |
| `/exercise` | POST | Generates exercises for a node |
| `/exercise/grade` | POST | Grades an answer, updates node state |

## Graph Node Schema

```json
{
  "id": "present_tense_regular",
  "label": "Present Tense (Regular Verbs)",
  "type": "grammar",
  "difficulty": 2,
  "tags": ["verb", "conjugation", "foundational"],
  "status": "unknown"
}
```

## Graph Edge Schema

```json
{
  "source": "basic_pronouns",
  "target": "present_tense_regular",
  "relationship": "prerequisite"
}
```

## Node States

- **known** — learner demonstrated mastery
- **weak** — partial understanding, needs reinforcement
- **unknown** — not yet assessed or failed assessment

## Build Phases

### Phase 1: Foundation (Hour 0–1)
Base graph generated and loaded. API stubbed with dummy data. Frontend rendering dummy graph. LLM prompts tested in isolation.

### Phase 2: Core Loop (Hour 1–3)
Personalization working. Assessment running and updating graph. Path engine computing recommendations. Frontend wired to real endpoints. End-to-end flow: onboarding → personalized graph → assessment → path recommendation.

### Phase 3: Close the Loop (Hour 3–5)
Exercise generation and grading. Graph updates after practice. Frontend polish — transitions, progress bar, session plan sidebar.

### Phase 4: Demo (Hour 5–6)
Feature freeze. Bug fixes only. Practice demo twice.

## Demo Flow

1. Meet the learner — "high school Spanish, traveling to Mexico in 3 weeks"
2. Onboarding form → personalized graph appears (pruned for travel, pre-marked known nodes)
3. Assessment chat → graph lights up as nodes flip green/yellow
4. Path recommendation → "here's what to learn next" highlighted on graph
5. One exercise → answer → node flips green → graph updates
6. "And that's the loop"

## Cut Line

If behind at hour 3, drop exercises. Demo the core loop: onboarding → personalized graph → assessment → path recommendation. That's still a complete story.