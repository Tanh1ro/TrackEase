"""
Views for the TrackEase API application.

This module defines the view classes and functions that handle API requests:
1. Authentication views - User signup, login, and token management
2. User views - Profile management and user operations
3. Group views - Group CRUD operations and member management
4. Expense views - Expense tracking and sharing operations

@author Nandeesh Kantli
@date April 4, 2024
@version 1.0.0
"""

from rest_framework import viewsets, status, generics, permissions
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from .models import Group, Expense, UserProfile, User
from .serializers import GroupSerializer, ExpenseSerializer, UserSerializer, RegisterSerializer, LoginSerializer
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from django.contrib.auth import authenticate, login
from rest_framework.decorators import api_view, permission_classes
from rest_framework.authtoken.models import Token
from django.conf import settings
import requests
from django.core.exceptions import ObjectDoesNotExist
from django.db import models
from knox.models import AuthToken
from knox.views import LoginView as KnoxLoginView


class GroupViewSet(viewsets.ModelViewSet):
    """
    ViewSet for handling group operations.
    
    Provides CRUD operations for groups and handles:
    - Group creation
    - Member management
    - Group updates
    - Group deletion
    """
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Return groups where the user is a member or creator."""
        return Group.objects.filter(
            models.Q(members=self.request.user) | 
            models.Q(created_by=self.request.user)
        ).distinct()

    @action(detail=True, methods=['get'])
    def users(self, request, pk=None):
        group = self.get_object()
        users = group.users.all()
        return Response([{
            'id': user.id,
            'name': user.get_full_name() or user.username,
            'email': user.email
        } for user in users])

    @action(detail=True, methods=['post'])
    def add_user(self, request, pk=None):
        group = self.get_object()
        user_id = request.data.get('user_id')
        try:
            user = User.objects.get(id=user_id)
            group.users.add(user)
            return Response({'message': 'User added to group'})
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['delete'])
    def remove_user(self, request, pk=None):
        group = self.get_object()
        user_id = request.data.get('user_id')
        try:
            user = User.objects.get(id=user_id)
            group.users.remove(user)
            return Response({'message': 'User removed from group'})
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    def perform_create(self, serializer):
        """Create a new group and set the creator."""
        serializer.save(created_by=self.request.user)


class ExpenseViewSet(viewsets.ModelViewSet):
    """
    ViewSet for handling expense operations.
    
    Provides CRUD operations for expenses and handles:
    - Expense creation
    - Expense updates
    - Expense deletion
    - Expense listing by group
    """
    queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Return expenses for groups where the user is a member."""
        return Expense.objects.filter(
            models.Q(group__members=self.request.user) | 
            models.Q(group__created_by=self.request.user)
        ).distinct()

    def perform_create(self, serializer):
        """Create a new expense and set the payer."""
        serializer.save(paid_by=self.request.user)


@api_view(['POST'])
@permission_classes([AllowAny])
@csrf_exempt
def signup_view(request):
    """
    Handle user registration.
    
    Accepts POST requests with user data and creates a new user account.
    Returns authentication token on successful registration.
    """
    try:
        data = request.data
        username = data.get("username")
        password = data.get("password")
        email = data.get("email", "")
        first_name = data.get("first_name", "")
        last_name = data.get("last_name", "")
        phone = data.get("phone", "")
        food_type = data.get("food_type", "vegetarian")

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

        # Create the user with all fields
        user = User.objects.create_user(
            username=username,
            password=password,
            email=email,
            first_name=first_name,
            last_name=last_name,
            phone=phone,
            food_type=food_type
        )
        user.save()

        # Create a token for the new user
        token, created = Token.objects.get_or_create(user=user)

        # The UserProfile will be automatically created by the signal

        return Response(
            {
                "success": True,
                "message": "User created successfully",
                "token": token.key,
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "phone": user.phone,
                    "food_type": user.food_type
                }
            },
            status=status.HTTP_201_CREATED,
        )
    except Exception as e:
        return Response(
            {"success": False, "error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(['POST'])
@permission_classes([AllowAny])
@csrf_exempt
def login_view(request):
    """
    Handle user login.
    
    Accepts POST requests with credentials and authenticates the user.
    Returns authentication token on successful login.
    """
    try:
        username = request.data.get('username')
        password = request.data.get('password')
        
        if not username or not password:
            return Response(
                {"success": False, "error": "Username and password are required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user = authenticate(username=username, password=password)
        
        if user:
            login(request, user)
            token, created = Token.objects.get_or_create(user=user)
            serializer = UserSerializer(user)
            return Response({
                "success": True,
                "message": "Login successful",
                "token": token.key,
                "user": serializer.data
            })
        else:
            return Response(
                {"success": False, "error": "Invalid credentials"}, 
                status=status.HTTP_401_UNAUTHORIZED
            )
    except Exception as e:
        return Response(
            {"success": False, "error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
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

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def user_profile_view(request):
    try:
        user = request.user
        user_profile = UserProfile.objects.get(user=user)
        data = {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "date_joined": user.date_joined.strftime("%B %Y"),
            "is_active": user.is_active,
            "phone": user_profile.phone_number,
            "foodType": user_profile.food_type,
            "profile_image": user_profile.profile_image.url if user_profile.profile_image else None
        }
        return Response(data)
    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(["POST"])
@permission_classes([AllowAny])
def google_auth_view(request):
    try:
        data = request.data
        email = data.get('email')
        name = data.get('name')
        google_id = data.get('googleId')
        profile_image = data.get('profileImage')

        # Check if user exists
        try:
            user = User.objects.get(username=email)
        except ObjectDoesNotExist:
            # Create new user if doesn't exist
            user = User.objects.create_user(
                username=email,
                email=email,
                first_name=name.split()[0],
                last_name=' '.join(name.split()[1:]) if len(name.split()) > 1 else ''
            )
            user.save()

        # Create or get token
        token, created = Token.objects.get_or_create(user=user)

        return Response({
            "token": token.key,
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "profile_image": profile_image
            }
        })

    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

@api_view(["POST"])
@permission_classes([AllowAny])
def apple_auth_view(request):
    try:
        data = request.data
        email = data.get('email')
        name = data.get('fullName', {}).get('givenName', '')
        apple_id = data.get('user')
        profile_image = data.get('profileImage')

        # Check if user exists
        try:
            user = User.objects.get(username=email)
        except ObjectDoesNotExist:
            # Create new user if doesn't exist
            user = User.objects.create_user(
                username=email,
                email=email,
                first_name=name,
                last_name=''
            )
            user.save()

        # Create or get token
        token, created = Token.objects.get_or_create(user=user)

        return Response({
            "token": token.key,
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "profile_image": profile_image
            }
        })

    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_profile_view(request):
    try:
        user = request.user
        data = request.data
        
        # Update name if provided
        if 'first_name' in data:
            user.first_name = data['first_name']
        if 'last_name' in data:
            user.last_name = data['last_name']
            
        # Update password if provided
        if 'newPassword' in data:
            if not user.check_password(data.get('currentPassword')):
                return Response(
                    {"error": "Current password is incorrect"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            user.set_password(data['newPassword'])
            
        user.save()
        
        # Get or create user profile
        user_profile, created = UserProfile.objects.get_or_create(user=user)
        
        # Update phone number if provided
        if 'phone' in data:
            user_profile.phone_number = data['phone']
            
        # Update food type if provided
        if 'foodType' in data:
            user_profile.food_type = data['foodType']
            
        # Update profile image if provided
        if 'profileImage' in request.FILES:
            user_profile.profile_image = request.FILES['profileImage']
            
        user_profile.save()
        
        return Response({
            "message": "Profile updated successfully",
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "name": f"{user.first_name} {user.last_name}".strip() or user.username,
                "phone": user_profile.phone_number,
                "foodType": user_profile.food_type,
                "profile_image": user_profile.profile_image.url if user_profile.profile_image else None
            }
        })
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class GroupExpensesView(APIView):
    """
    View for handling group expense operations.
    
    Provides:
    - Expense listing by group
    - Group expense statistics
    - Member balance calculations
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, group_id):
        """Get all expenses for a specific group."""
        try:
            group = Group.objects.get(id=group_id)
            expenses = Expense.objects.filter(group=group)
            serializer = ExpenseSerializer(expenses, many=True)
            return Response(serializer.data)
        except Group.DoesNotExist:
            return Response(
                {'error': 'Group not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )

class ExpenseSharesView(APIView):
    """
    View for handling expense share operations.
    
    Provides:
    - Share listing by expense
    - Share creation for multiple users
    - Settlement marking
    - Share statistics
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, expense_id):
        """Get all shares for a specific expense."""
        try:
            expense = Expense.objects.get(id=expense_id)
            shares = ExpenseShare.objects.filter(expense=expense)
            serializer = ExpenseShareSerializer(shares, many=True)
            return Response(serializer.data)
        except Expense.DoesNotExist:
            return Response(
                {'error': 'Expense not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )

class RegisterAPI(generics.GenericAPIView):
    serializer_class = RegisterSerializer
    permission_classes = (permissions.AllowAny,)

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        token = AuthToken.objects.create(user)[1]
        
        return Response({
            "success": True,
            "message": "User created successfully",
            "token": token,
            "user": UserSerializer(user, context=self.get_serializer_context()).data
        }, status=status.HTTP_201_CREATED)

class LoginAPI(KnoxLoginView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        login(request, user)
        
        response = super(LoginAPI, self).post(request, format=None)
        token = response.data['token']
        
        return Response({
            "success": True,
            "message": "Login successful",
            "token": token,
            "user": UserSerializer(user).data
        })

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def check_email(request):
    email = request.data.get('email')
    if not email:
        return Response({
            'error': 'Email is required'
        }, status=status.HTTP_400_BAD_REQUEST)
        
    exists = User.objects.filter(email=email).exists()
    return Response({
        'exists': exists
    })