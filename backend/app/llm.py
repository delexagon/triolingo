import os

from google import genai

MODEL = "gemini-2.0-flash"

_client = None


def _get_client() -> genai.Client:
    global _client
    if _client is None:
        _client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])
    return _client


def call_llm(system: str, prompt: str) -> str:
    response = _get_client().models.generate_content(
        model=MODEL,
        contents=f"{system}\n\n{prompt}",
        config={"max_output_tokens": 1024},
    )
    return response.text
