import os, json
from django.conf import settings

class GPT4ALLProvider:
    def __init__(self):
        from openai import OpenAI
        self.client = OpenAI(base_url="http://localhost:4891/v1", api_key="not-needed")
        self.model = os.getenv("GPT4ALL_MODEL", "DeepSeek-R1-Distill-Llama_8B")

    def stream(self, messages, system=None):
        msgs = ([{"role": "system", "content": system}] if system else []) + messages
        resp = self.client.chat.completions.create(
            model=self.model,
            messages=msgs,
            max_tokens=512,
        )
        print("\n[DEBUG]", resp)
        yield resp.choices[0].message.content or ""

class BedrockProvider:
    def __init__(self):
        import boto3
        self.client = boto3.client("bedrock-runtime", region_name=os.environ("AWS_REGION", "us-east-1")) # might change
        self.model_id = os.environ["BEDROCK_MODEL_ID"]

        def stream(self, messages, system=None):
            kwargs = {
                "modelId": self.model_id,
                "messages": [{"role": m["role"], "content": [{"text": m["content"]}]} for m in messages],
                "inferenceConfig": {"maxTokens": 512},
            }
            if system:
                kwargs["system"] = [{"text": system}]
            resp = self.client.converse_stream(**kwargs)
            for event in resp["stream"]:
                if "contentBlockDelta" in event:
                    yield event["contentBlockDelta"]["delta"].get("text", "")


def get_provider():
    return BedrockProvider() if os.getenv("LLM_PROVIDER") == "bedrock" else GPT4ALLProvider()