from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),

    path('signup/', views.signup_page, name='signup'),

    path('login/', views.login_page, name='login'),

    path('add_book/', views.add_book_page, name='add_book'),

    path('book_details/', views.book_details_page, name='book_details'),

    path('books/', views.books_page, name='books'),

    path('edit_book/', views.edit_book_page, name='edit_book'),

    path('my_books/', views.my_books_page, name='my_books'),
]