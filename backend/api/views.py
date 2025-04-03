from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth.models import User
from .models import Group, Expense, UserProfile
from .serializers import GroupSerializer, ExpenseSerializer
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from django.contrib.auth import authenticate
from rest_framework.decorators import api_view, permission_classes
from rest_framework.authtoken.models import Token
from django.conf import settings
import requests
from django.core.exceptions import ObjectDoesNotExist


class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Group.objects.filter(users=self.request.user)

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


class ExpenseViewSet(viewsets.ModelViewSet):
    queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Expense.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


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