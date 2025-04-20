"""
Models for the TrackEase API application.

This module defines the database models used in the application:
1. User - Custom user model for authentication
2. Group - Model for expense sharing groups
3. Expense - Model for tracking shared expenses
4. ExpenseShare - Model for tracking how expenses are shared among group members

@author Nandeesh Kantli
@date April 4, 2024
@version 1.0.0
"""

from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _
from django.db.models.signals import post_save
from django.dispatch import receiver
from core.models import User

class Group(models.Model):
    """
    Model for expense sharing groups.
    
    Fields:
    - name: Group name
    - description: Group description
    - members: Users who are members of the group
    - created_by: User who created the group
    - created_at: Group creation timestamp
    """
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_groups')
    members = models.ManyToManyField(User, related_name='member_groups')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['-created_at']

class Expense(models.Model):
    """
    Model for tracking shared expenses.
    
    Fields:
    - description: Expense description
    - amount: Expense amount
    - date: Date of expense
    - category: Expense category
    - group: Group the expense belongs to
    - paid_by: User who paid the expense
    - created_at: Expense creation timestamp
    """
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name='expenses')
    description = models.CharField(max_length=200)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    paid_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='paid_expenses')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.description} - {self.amount}"

class ExpenseShare(models.Model):
    """
    Model for tracking how expenses are shared among group members.
    
    Fields:
    - expense: The expense being shared
    - user: User who owes part of the expense
    - amount: Amount owed by the user
    - is_settled: Whether the share has been settled
    - settled_at: When the share was settled
    """
    expense = models.ForeignKey(Expense, on_delete=models.CASCADE, related_name='shares')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='expense_shares')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    is_settled = models.BooleanField(default=False)
    settled_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.username} owes {self.amount} for {self.expense.description}"

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    profile_image = models.ImageField(upload_to='profile_images/', null=True, blank=True)
    food_type = models.CharField(max_length=20, choices=[
        ('vegetarian', 'Vegetarian'),
        ('non-vegetarian', 'Non-Vegetarian')
    ], default='vegetarian')

    def __str__(self):
        return self.user.username

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    try:
        instance.userprofile.save()
    except UserProfile.DoesNotExist:
        UserProfile.objects.create(user=instance)