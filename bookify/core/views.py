from django.shortcuts import render

# Create your views here.

def signup_page(request):
    return render(request, 'sign-up.html')

def login_page(request):
    return render(request, 'login.html')

def home(request):
    return render(request, 'home.html')

def add_book_page(request):
    return render(request, 'add_book.html')

def book_details_page(request):
    return render(request, 'book_details.html')

def books_page(request):
    return render(request, 'books.html')

def edit_book_page(request):
    return render(request, 'edit_book.html')

def my_books_page(request):
    return render(request, 'my_books.html')