from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ExpenseViewSet, 
    GroupViewSet, 
    signup_view, 
    login_view, 
    dashboard_view, 
    user_profile_view,
    google_auth_view,
    apple_auth_view,
    update_profile_view
)

router = DefaultRouter()
router.register(r'expenses', ExpenseViewSet)
router.register(r'groups', GroupViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('signup/', signup_view, name='signup'), 
    path("login/", login_view, name="login"),
    path("dashboard/", dashboard_view, name="dashboard"),
    path("profile/", user_profile_view, name="profile"),
    path("profile/update/", update_profile_view, name="update-profile"),
    path("social-auth/google/", google_auth_view, name="google-auth"),
    path("social-auth/apple/", apple_auth_view, name="apple-auth"),
]
