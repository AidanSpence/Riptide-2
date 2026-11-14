import secrets
from django.conf import settings
from django.http import JsonResponse


class CloudFrontOriginMiddleware:
    """only allow the configured distribution to reach the demo backend."""

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # liveness has no private data and works without a database
        if request.path == "/health/":
            return self.get_response(request)
        if not settings.DEBUG:
            supplied = request.headers.get("X-Riptide-Origin", "")
            if not secrets.compare_digest(supplied, settings.CLOUDFRONT_ORIGIN_SECRET):
                return JsonResponse({"error": "Forbidden"}, status=403)
            # the distribution must redirect viewers to https
            request.META["HTTP_X_FORWARDED_PROTO"] = "https"
        else:
            request.META.pop("HTTP_X_FORWARDED_PROTO", None)
        return self.get_response(request)
