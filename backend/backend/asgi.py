import os
import django
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter, get_default_application
from channels.auth import AuthMiddlewareStack
from backend.routing import websocket_urlpatterns
from chatting.jwtTokenMiddleware import UserIDMiddleware


os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()
django_asgi_app = get_default_application()

application = ProtocolTypeRouter(
    {
        "http": get_asgi_application(),
        "websocket": UserIDMiddleware(
            AuthMiddlewareStack(URLRouter(websocket_urlpatterns))
        ),
    }
)
