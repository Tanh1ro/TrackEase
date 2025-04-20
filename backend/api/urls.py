"""
URL configuration for the TrackEase API application.

This module defines the URL patterns for the API endpoints:
1. User endpoints - Authentication and profile management
2. Group endpoints - Group creation and management
3. Expense endpoints - Expense tracking and sharing
4. ExpenseShare endpoints - Managing expense settlements

@author Nandeesh Kantli
@date April 4, 2024
@version 1.0.0
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ExpenseViewSet, 
    GroupViewSet, 
    RegisterAPI,
    LoginAPI,
    check_email,
    user_profile_view,
    update_profile_view
)
from knox import views as knox_views

# Create a router for viewset routing
router = DefaultRouter()

# Register viewsets with the router
router.register(r'expenses', ExpenseViewSet)
router.register(r'groups', GroupViewSet)

# URL patterns for the API
urlpatterns = [
    # Include router URLs
    path('', include(router.urls)),
    
    # Auth endpoints
    path('auth/signup/', RegisterAPI.as_view(), name='register'),
    path('auth/login/', LoginAPI.as_view(), name='login'),
    path('auth/logout/', knox_views.LogoutView.as_view(), name='logout'),
    path('auth/check-email/', check_email, name='check-email'),
    
    # User endpoints
    path('profile/', user_profile_view, name='profile'),
    path('profile/update/', update_profile_view, name='update-profile'),
]
