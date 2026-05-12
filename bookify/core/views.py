import json

from django.http import JsonResponse, HttpResponseNotAllowed
from django.shortcuts import redirect, render, get_object_or_404
from django.contrib.auth.hashers import make_password, check_password

from .models import User, Book

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


def get_current_user(request):
    user_id = request.session.get('user_id')
    if not user_id:
        return None

    return User.objects.filter(id=user_id).first()


def format_book(book):
    return {
        'id': book.id,
        'name': book.name,
        'author': book.author,
        'category': book.category,
        'description': book.description,
        'status': book.status,
        'coverImage': book.cover_image or '',
    }


def serialize_books(queryset):
    return json.dumps([format_book(book) for book in queryset], ensure_ascii=False)


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
    books_json = serialize_books(Book.objects.all())
    return render(
        request,
        'home.html',
        {
            'role': get_role(request),
            'is_authenticated': is_user_authenticated(request),
            'books_json': books_json,
        },
    )


def logout_user(request):
    request.session.flush()
    return redirect('login')


def add_book_page(request):
    return render(
        request,
        'add_book.html',
        {
            'role': get_role(request),
            'is_authenticated': is_user_authenticated(request),
        },
    )



# Book Details View
def book_details_page(request):
    return render(
        request,
        'book_details.html',
        {
            'role': get_role(request),
            'is_authenticated': is_user_authenticated(request),
        },
    )


def books_page(request):
    books_json = serialize_books(Book.objects.all())
    return render(
        request,
        'books.html',
        {
            'role': get_role(request),
            'is_authenticated': is_user_authenticated(request),
            'books_json': books_json,
        },
    )


def edit_book_page(request):
    books_json = serialize_books(Book.objects.all())
    return render(
        request,
        'edit_book.html',
        {
            'role': get_role(request),
            'is_authenticated': is_user_authenticated(request),
            'books_json': books_json,
        },
    )



# My Books View
def my_books_page(request):
    return render(
        request,
        'my_books.html',
        {
            'role': get_role(request),
            'is_authenticated': is_user_authenticated(request),
        },
    )


def api_books_list(request):
    if request.method != 'GET':
        return HttpResponseNotAllowed(['GET'])

    books = [format_book(book) for book in Book.objects.all()]
    return JsonResponse({'books': books})


def api_book_detail(request, book_id):
    if request.method != 'GET':
        return HttpResponseNotAllowed(['GET'])

    book = get_object_or_404(Book, id=book_id)
    return JsonResponse({'book': format_book(book)})


def api_add_book(request):
    if request.method != 'POST':
        return HttpResponseNotAllowed(['POST'])

    current_user = get_current_user(request)
    if not current_user or current_user.role != 'admin':
        return JsonResponse({'error': 'Admin access required.'}, status=403)

    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON.'}, status=400)

    name = data.get('name', '').strip()
    author = data.get('author', '').strip()
    category = data.get('category', '').strip()
    description = data.get('description', '').strip()
    cover_image = data.get('coverImage', '').strip()

    if not name or not author or not category:
        return JsonResponse({'error': 'Name, author, and category are required.'}, status=400)

    book = Book.objects.create(
        name=name,
        author=author,
        category=category,
        description=description,
        cover_image=cover_image or None,
    )

    return JsonResponse({'book': format_book(book)}, status=201)


def api_edit_book(request, book_id):
    if request.method != 'POST':
        return HttpResponseNotAllowed(['POST'])

    current_user = get_current_user(request)
    if not current_user or current_user.role != 'admin':
        return JsonResponse({'error': 'Admin access required.'}, status=403)

    book = get_object_or_404(Book, id=book_id)

    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON.'}, status=400)

    name = data.get('name', '').strip()
    author = data.get('author', '').strip()
    category = data.get('category', '').strip()
    description = data.get('description', '').strip()

    if not name or not author or not category:
        return JsonResponse({'error': 'Name, author, and category are required.'}, status=400)

    book.name = name
    book.author = author
    book.category = category
    book.description = description
    book.save()

    return JsonResponse({'book': format_book(book)})


def api_borrow_book(request, book_id):
    if request.method != 'POST':
        return HttpResponseNotAllowed(['POST'])

    if not is_user_authenticated(request):
        return JsonResponse({'error': 'Authentication required.'}, status=401)

    book = get_object_or_404(Book, id=book_id)
    if book.status == Book.STATUS_BORROWED:
        return JsonResponse({'error': 'Book is already borrowed.'}, status=400)

    current_user = get_current_user(request)
    if not current_user:
        return JsonResponse({'error': 'Authentication required.'}, status=401)

    book.status = Book.STATUS_BORROWED
    book.borrower = current_user
    book.save()
    return JsonResponse({'book': format_book(book)})


def api_delete_book(request, book_id):
    if request.method != 'POST':
        return HttpResponseNotAllowed(['POST'])

    current_user = get_current_user(request)
    if not current_user or current_user.role != 'admin':
        return JsonResponse({'error': 'Admin access required.'}, status=403)

    book = get_object_or_404(Book, id=book_id)
    book.delete()
    return JsonResponse({'success': True})


def api_my_books(request):
    if request.method != 'GET':
        return HttpResponseNotAllowed(['GET'])

    current_user = get_current_user(request)
    if not current_user:
        return JsonResponse({'books': []})

    books = [format_book(book) for book in Book.objects.filter(borrower=current_user)]
    return JsonResponse({'books': books})




