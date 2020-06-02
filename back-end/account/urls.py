from django.conf.urls import url
from django.contrib import admin
from django.urls import path, include, re_path
from .api import RegistrationAPI, UserViewSet
from rest_framework.routers import DefaultRouter, SimpleRouter
from rest_framework_jwt.views import obtain_jwt_token, ObtainJSONWebToken, verify_jwt_token
from .serializers import CustomJWTSerializer


router = DefaultRouter(trailing_slash=False)
router.register(r'', UserViewSet, basename='user')


urlpatterns = [
  path('register', RegistrationAPI.as_view(), name='user_register'),
  # path('login', LoginAPI.as_view(), name='user_login'),
  path('login', ObtainJSONWebToken.as_view(serializer_class=CustomJWTSerializer)),

  path('', include(router.urls), name='user_list'),
  
  # url(r'^api-token-verify/', verify_jwt_token),

  # path('api/auth/users', include(router.urls)),
]