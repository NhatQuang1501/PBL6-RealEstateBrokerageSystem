import os
import django
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from django.core.asgi import get_asgi_application

# Set Django settings module
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django_asgi_app = get_asgi_application()
django.setup()

# Import after Django setup to avoid AppRegistryNotReady
from backend.routing import websocket_urlpatterns
from chatting.jwtTokenMiddleware import UserIDMiddleware

application = ProtocolTypeRouter(
    {
        "http": django_asgi_app,
        "websocket": UserIDMiddleware(
            AuthMiddlewareStack(URLRouter(websocket_urlpatterns))
        ),
    }
)
