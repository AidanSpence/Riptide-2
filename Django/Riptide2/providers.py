import os, json
from django.conf import settings


class OllamaProvider:
    URL = "http://localhost:11434/api/chat"
    MODEL = "llama3.1:8b"

    def stream(self, messages, system=None):
        import json, requests
        msgs = ([{"role": "system", "content": system}] if system else []) + messages
        with requests.post(
            self.URL,
            json={
                "model": self.MODEL,
                "messages": msgs,
                "stream": True,
                "options": {"num_ctx": 8192, "num_predict": 512},
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
        self.client = boto3.client("bedrock-runtime", region_name=os.environ("AWS_REGION", "us-east-1")) # might change
        self.model_id = os.environ["BEDROCK_MODEL_ID"]

        def stream(self, messages, system=None):
            kwargs = {
                "modelId": self.model_id,
                "messages": [{"role": m["role"], "content": [{"text": m["content"]}]} for m in messages],
                "inferenceConfig": {"maxTokens": 1500}, # max_tokens
            }
            if system:
                kwargs["system"] = [{"text": system}]
            resp = self.client.converse_stream(**kwargs)
            for event in resp["stream"]:
                if "contentBlockDelta" in event:
                    yield event["contentBlockDelta"]["delta"].get("text", "")


def get_provider():
    return OllamaProvider()