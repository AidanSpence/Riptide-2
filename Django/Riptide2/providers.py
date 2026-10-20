import os, json
from django.conf import settings

class GPT4AllLocalProvider:
    def __init__(self):
        from gpt4all import GPT4All
        self.model = GPT4All(
        os.getenv("GPT4ALL_MODEL_FILE", "Meta-Llama-3-8B-Instruct.Q4_0.gguf"),
        n_ctx=8192, # max_tokens
        device="gpu",
        )
        self.system = None
        self._ctx = None

    def _start(self, system):
        self.reset()
        self.system = system
        self._ctx = self.model.chat_session(system_prompt=system)
        self._ctx.__enter__()
        print("n_ctx:", self.model.model.n_ctx if hasattr(self.model.model, "n_ctx") else "unknown")
        print("system in session:", len(self.model.current_chat_session[0]["content"]), "chars")

    def reset(self):
        if self._ctx:
            self._ctx.__exit__(None, None, None)
            self._ctx = None

    def stream(self, messages, system=None):
        if self._ctx is None or len(messages) == 1:
            self._start(system)
        for token in self.model.generate(messages[-1]["content"], max_tokens=1500, streaming=True):
            yield token

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
    p = os.getenv("LLM_PROVIDER", "gpt4all_local")
    if p == "bedrock":
        return BedrockProvider()
    return GPT4AllLocalProvider()