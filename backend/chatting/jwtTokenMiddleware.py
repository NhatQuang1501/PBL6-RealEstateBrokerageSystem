from django.contrib.auth.models import AnonymousUser
from django.contrib.auth import get_user_model
from channels.auth import AuthMiddlewareStack
from channels.middleware import BaseMiddleware
from accounts.models import User
from urllib.parse import parse_qs
from django.db import close_old_connections
import jwt
from channels.db import database_sync_to_async
from django.conf import settings


class JWTAuthMiddleware(BaseMiddleware):

    async def __call__(self, scope, receive, send):
        query_string = parse_qs(scope["query_string"].decode())
        token = query_string.get("token", None)

        if token is None:
            scope["user"] = AnonymousUser()
        else:
            try:
                payload = jwt.decode(
                    token[0], settings.SECRET_KEY, algorithms=["HS256"]
                )
                user = await self.get_user_by_id(payload["user_id"])
                scope["user"] = user
            except (
                jwt.ExpiredSignatureError,
                jwt.InvalidTokenError,
                User.DoesNotExist,
            ):
                scope["user"] = AnonymousUser()

        close_old_connections()
        return await super().__call__(scope, receive, send)

    @database_sync_to_async
    def get_user_by_id(self, user_id):
        return User.objects.get(user_id=user_id)
