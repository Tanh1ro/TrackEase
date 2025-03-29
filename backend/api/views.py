from rest_framework import viewsets
from .models import Expense
from .serializers import ExpenseSerializer
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from django.contrib.auth import authenticate
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework import status
from rest_framework.permissions import AllowAny


class ExpenseViewSet(viewsets.ModelViewSet):
    queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Filter expenses to only include those created by the authenticated user
        return self.queryset.filter(created_by=self.request.user)


@api_view(["POST"])
@permission_classes([AllowAny])  # Allow unauthenticated access for signup
def signup_view(request):
    try:
        data = request.data
        username = data.get("username")
        password = data.get("password")

        if not username or not password:
            return Response(
                {"error": "Username and password are required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if User.objects.filter(username=username).exists():
            return Response(
                {"error": "Username already exists"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = User.objects.create_user(username=username, password=password)
        user.save()

        # Create a token for the new user
        token, created = Token.objects.get_or_create(user=user)

        return Response(
            {"message": "User created successfully", "token": token.key},
            status=status.HTTP_201_CREATED,
        )
    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(["POST"])
@permission_classes([AllowAny])  # Allow unauthenticated access for login
def login_view(request):
    username = request.data.get("username")
    password = request.data.get("password")

    if not username or not password:
        return Response(
            {"error": "Username and password are required"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    user = authenticate(username=username, password=password)
    if user:
        token, created = Token.objects.get_or_create(user=user)
        return Response({"token": token.key}, status=status.HTTP_200_OK)
    else:
        return Response(
            {"error": "Invalid credentials"},
            status=status.HTTP_401_UNAUTHORIZED,
        )
    
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def dashboard_view(request):
    try:
        # Return a simple response for the dashboard
        user = request.user
        data = {
            "message": f"Welcome to the dashboard, {user.username}!",
            "user_id": user.id,
            "username": user.username,
        }
        return Response(data)
    except Exception as e:
        return Response({"error": str(e)}, status=500)