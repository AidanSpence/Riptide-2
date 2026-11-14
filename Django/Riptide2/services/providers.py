import os, json
from django.conf import settings


class OllamaProvider:
    URL = os.environ.get("OLLAMA_URL", "http://localhost:11434/api/chat")
    MODEL = os.getenv("OLLAMA_MODEL", "llama3.1:8b")

    def stream(self, messages, system=None):
        import json, requests
        msgs = ([{"role": "system", "content": system}] if system else []) + messages
        with requests.post(
            self.URL,
            json={
                "model": self.MODEL,
                "messages": msgs,
                "stream": True,
                "format": "json",
                "options": {"num_ctx": 8192, "num_predict": 2048},
            },
            stream=True,
            timeout=300,
        ) as r:
            r.raise_for_status()
            for line in r.iter_lines():
                if not line:
                    continue
                data = json.loads(line)
                if "message" in data:
                    yield data["message"].get("content", "")
                if data.get("done"):
                    break

class BedrockProvider:
    def __init__(self):
        import boto3
        from botocore.config import Config
        self.client = boto3.client(
            "bedrock-runtime",
            region_name=os.environ.get("AWS_REGION", "us-east-1"),
            config=Config(connect_timeout=5, read_timeout=60, retries={"total_max_attempts": 1}),
        )
        self.model_id = os.environ["BEDROCK_MODEL_ID"]

    def stream(self, messages, system=None):
        kwargs = {
            "modelId": self.model_id,
            "messages": [
                {"role": m["role"], "content": [{"text": m["content"]}]}
                for m in messages
            ],
            "inferenceConfig": {"maxTokens": int(os.getenv("BEDROCK_MAX_TOKENS", "4096"))},
        }
        if system:
            kwargs["system"] = [{"text": system}]

        resp = self.client.converse_stream(**kwargs)
        import time
        started = time.monotonic()
        try:
            for event in resp["stream"]:
                if time.monotonic() - started > 80:
                    raise TimeoutError("model response exceeded the time limit")
                if "contentBlockDelta" in event:
                    # reasoning blocks are not playlist JSON
                    yield event["contentBlockDelta"]["delta"].get("text", "")
                if "messageStop" in event and event["messageStop"].get("stopReason") == "max_tokens":
                    raise ValueError("model output was truncated")
                if any(key.endswith("Exception") for key in event):
                    raise RuntimeError("model streaming failed")
        finally:
            resp["stream"].close()


def get_provider():
    provider_name = os.getenv("LLM_PROVIDER", "ollama").lower()

    if provider_name == "ollama":
        return OllamaProvider()

    if provider_name == "bedrock":
        return BedrockProvider()

    raise ValueError(
        f"Unsupported LLM provider: {provider_name}"
    )