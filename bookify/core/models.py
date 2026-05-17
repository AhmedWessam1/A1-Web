from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.
class User(models.Model):
    username = models.CharField(max_length=100)
    email = models.CharField(max_length=100)
    password = models.CharField(max_length=50)
    role = models.CharField(max_length=10, default='user')

# Borrow Model
class Book(models.Model):
    STATUS_AVAILABLE = 'available'
    STATUS_BORROWED = 'borrowed'

    STATUS_CHOICES = [
        (STATUS_AVAILABLE, 'Available'),
        (STATUS_BORROWED, 'Borrowed'),
    ]

    name = models.CharField(max_length=150)
    author = models.CharField(max_length=100)
    category = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default=STATUS_AVAILABLE)

    borrower = models.ForeignKey(
        User,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='borrowed_books'
    )
    cover_image = models.ImageField(upload_to='covers/', blank=True, null=True)
    pdf_file = models.FileField(upload_to='pdfs/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
           return self.name
