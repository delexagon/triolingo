import os
from openai import OpenAI

MODEL = "meta-llama/Llama-3.1-8B-Instruct"

_client = None


def _get_client() -> OpenAI:
    global _client
    if _client is None:
        api_key = os.environ.get("HF_TOKEN") or os.environ.get("LLM_API_KEY", "dummy-key")
        base_url = os.environ.get("LLM_BASE_URL", "https://api-inference.huggingface.co/models/meta-llama/Llama-3.1-8B-Instruct/v1/")
        if base_url.endswith("/v1"):
            base_url += "/"
            
        _client = OpenAI(
            api_key=api_key,
            base_url=base_url
        )
    return _client


def call_llm(system: str, prompt: str) -> str:
    response = _get_client().chat.completions.create(
        model=MODEL,
        messages=[
            {"role": "system", "content": system},
            {"role": "user", "content": prompt}
        ],
        max_tokens=1024,
    )
    return response.choices[0].message.content


def chat_llm(messages: list[dict]) -> str:
    response = _get_client().chat.completions.create(
        model=MODEL,
        messages=messages,
        max_tokens=1024,
    )
    return response.choices[0].message.content
