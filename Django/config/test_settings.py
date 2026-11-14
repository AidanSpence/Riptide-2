from .settings import *

# test cache is isolated; oauth state and budget tests still use postgres
CACHES = {"default": {"BACKEND": "django.core.cache.backends.locmem.LocMemCache"}}
REST_FRAMEWORK = {**REST_FRAMEWORK, "DEFAULT_THROTTLE_CLASSES": []}
PASSWORD_HASHERS = ["django.contrib.auth.hashers.MD5PasswordHasher"]
