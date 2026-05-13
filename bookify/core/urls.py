from django.urls import path
# pyrefly: ignore [missing-import]
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    
    path('signup/', views.signup_page, name='signup'),
    
    path('login/', views.login_page, name='login'),
    
    path('logout/', views.logout_user, name='logout'),
    
    path('add_book/', views.add_book_page, name='add_book'),
    
    path('book_details/', views.book_details_page, name='book_details'),
    
    path('books/', views.books_page, name='books'),
    
    path('edit_book/', views.edit_book_page, name='edit_book'),
    
    path('my_books/', views.my_books_page, name='my_books'),

    # API endpoints for book details and my books
    path('api/books/', views.api_books_list, name='api_books_list'),
    
    path('api/books/<int:book_id>/', views.api_book_detail, name='api_book_detail'),
    
    path('api/books/<int:book_id>/borrow/', views.api_borrow_book, name='api_borrow_book'),
    
    
    path('api/books/<int:book_id>/delete/', views.api_delete_book, name='api_delete_book'),
    
    path('api/my_books/', views.api_my_books, name='api_my_books'),
    path('api/books/add/', views.api_add_book, name='api_add_book'),
    path('api/books/<int:book_id>/edit/', views.api_edit_book, name='api_edit_book'),
    path('unborrow/<int:book_id>/', views.api_unborrow_book, name='api_unborrow_book'),
    path('api/v2/books/<int:book_id>/', views.api_book_detail_v2, name='api_book_detail_v2'),

    path('api/books/<int:book_id>/return/', views.api_return_book, name='api_return_book'),

]



