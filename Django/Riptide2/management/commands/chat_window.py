from django.core.management.base import BaseCommand
from Riptide2.providers import get_provider
from Riptide2.system import SYSTEM_PROMPT


class Command(BaseCommand):
    help = "Chat with the configured LLM provider in the terminal"

    def handle(self, *args, **options):
        provider = get_provider()
        history = []
        print(f"Provider: {type(provider).__name__}")
        print("Commands: /reset clears history, /quit exits\n")

        while True:
            try:
                user = input("you> ").strip()
            except (EOFError, KeyboardInterrupt):
                print()
                break

            if not user:
                continue
            if user in ("/quit", "/exit"):
                break
            if user == "/reset":
                history.clear()
                if hasattr(provider, "reset"):
                    provider.reset()
                print("[history cleared]")
                continue

            history.append({"role": "user", "content": user})
            print("ai>  ", end="", flush=True)
            reply = ""
            try:
                for token in provider.stream(history, system=SYSTEM_PROMPT):
                    print(token, end="", flush=True)
                    reply += token
            except Exception as e:
                print(f"\n[error: {e}]")
                history.pop()  # keep user/assistant turns alternating
                continue

            print("\n")
            history.append({"role": "assistant", "content": reply})