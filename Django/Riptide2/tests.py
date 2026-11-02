from django.test import SimpleTestCase
from django.urls import resolve


class ApiImportTests(SimpleTestCase):
    """check the main api exports."""

    def test_api_functions_exist(self):
        from . import api

        for name in ("signup", "me", "chats", "chat_detail", "chat_send_message", "chat"):
            with self.subTest(name=name):
                self.assertTrue(callable(getattr(api, name)))
