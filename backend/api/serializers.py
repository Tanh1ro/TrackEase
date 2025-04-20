"""
Serializers for the TrackEase API application.

This module defines the serializers used to convert model instances to JSON and vice versa:
1. UserSerializer - For user data serialization
2. GroupSerializer - For group data serialization
3. ExpenseSerializer - For expense data serialization
4. ExpenseShareSerializer - For expense share data serialization

@author Nandeesh Kantli
@date April 4, 2024
@version 1.0.0
"""

from rest_framework import serializers
from .models import Group, Expense, User
from django.contrib.auth.models import User as AuthUser
from django.contrib.auth import authenticate

class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for the User model.
    
    Handles:
    - User data serialization
    - Profile information
    - Authentication data
    """
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name')
        read_only_fields = ('id',)

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'first_name', 'last_name')
        extra_kwargs = {
            'password': {'write_only': True},
            'username': {'required': False}
        }

    def validate(self, data):
        # Use email as username if not provided
        if 'username' not in data:
            data['username'] = data.get('email')
        return data

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        return user

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Invalid email or password")

class GroupSerializer(serializers.ModelSerializer):
    """
    Serializer for the Group model.
    
    Handles:
    - Group data serialization
    - Member list serialization
    - Creator information
    """
    class Meta:
        model = Group
        fields = ['id', 'name', 'description', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

class ExpenseSerializer(serializers.ModelSerializer):
    """
    Serializer for the Expense model.
    
    Handles:
    - Expense data serialization
    - Group and payer information
    - Date formatting
    """
    class Meta:
        model = Expense
        fields = '__all__'
        read_only_fields = ['user']
