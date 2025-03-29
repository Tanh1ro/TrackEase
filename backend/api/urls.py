from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ExpenseViewSet, signup_view, login_view, dashboard_view

router = DefaultRouter()
router.register(r'expenses', ExpenseViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('signup/', signup_view, name='signup'), 
    path("login/", login_view, name="login"),
    path("dashboard/", dashboard_view, name="dashboard"), 
]
