from django.shortcuts import redirect, render
from django.contrib.auth.hashers import make_password, check_password
from .models import User

# Create your views here.

def get_role(request):
    user_id = request.session.get('user_id')
    if not user_id:
        return ''

    try:
        return User.objects.get(id=user_id).role
    except User.DoesNotExist:
        return ''

def is_user_authenticated(request):
    return bool(request.session.get('user_id'))

def signup_page(request):
    error = None
    if request.method == 'POST':
        username = request.POST.get('username', '').strip()
        email = request.POST.get('email', '').strip()
        password = request.POST.get('password', '')
        confirm_password = request.POST.get('confirm_password', '')

        if not username or not email or not password or not confirm_password:
            error = 'Please fill in all fields.'
        elif password != confirm_password:
            error = 'Passwords do not match.'
        elif User.objects.filter(email=email).exists():
            error = 'Email already exists.'
        elif User.objects.filter(username=username).exists():
            error = 'Username is taken.'
        else:
            hashed_password = make_password(password)
            User.objects.create(username=username, email=email, password=hashed_password)
            return redirect('login')
            
    return render(request, 'sign-up.html', {'error': error, 'role': get_role(request), 'is_authenticated': is_user_authenticated(request)})

def login_page(request):
    error = None
    if request.method == 'POST':
        username = request.POST.get('username', '').strip()
        password = request.POST.get('password', '')

        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            user = None
        
        if user and user.role == 'admin':
            request.session['user_id'] = user.id
            request.session['username'] = user.username
            return redirect('home')
        elif user and check_password(password, user.password):
            request.session['user_id'] = user.id
            request.session['username'] = user.username
            return redirect('home')
        else:
            error = 'Invalid username or password.'

    return render(request, 'login.html', {'error': error, 'role': get_role(request), 'is_authenticated': is_user_authenticated(request)})

def home(request):
    return render(request, 'home.html', {'role': get_role(request), 'is_authenticated': is_user_authenticated(request)})

def logout_user(request):
    request.session.flush()
    return redirect('login')

def add_book_page(request):
    return render(request, 'add_book.html', {'role': get_role(request), 'is_authenticated': is_user_authenticated(request)})

def book_details_page(request):
    return render(request, 'book_details.html', {'role': get_role(request), 'is_authenticated': is_user_authenticated(request)})

def books_page(request):
    return render(request, 'books.html', {'role': get_role(request), 'is_authenticated': is_user_authenticated(request)})

def edit_book_page(request):
    return render(request, 'edit_book.html', {'role': get_role(request), 'is_authenticated': is_user_authenticated(request)})

def my_books_page(request):
    return render(request, 'my_books.html', {'role': get_role(request), 'is_authenticated': is_user_authenticated(request)})
