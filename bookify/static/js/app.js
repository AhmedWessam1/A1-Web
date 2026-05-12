function displayBooks() {
    const container = document.getElementById("booksContainer");

    if (!container) return;

    let books = JSON.parse(localStorage.getItem("books")) || [];

    container.innerHTML = "";

    books.forEach((book, index) => {
        container.innerHTML += `
        <div class="book-card">
            <h3>${book.name}</h3>
            <p>${book.author}</p>
            <p>${book.category}</p>
            <span class="badge ${book.status === "available" ? "available" : "not-available"}">
                ${book.status}
            </span>
            <button class="details-btn" onclick="window.location.href='/core/book_details/?id=${book.id}'">
                View Details
            </button>
        </div>
        `;
    });
}

function showDetails(index) {
    let books = JSON.parse(localStorage.getItem("books"));
    const book = books[index];
    
    window.location.href = `/core/book_details/?id=${book.id}`;
}

function closeModal() {
    document.getElementById("bookModal").style.display = "none";
}

function addBook(event) {
    event.preventDefault();

    let books = JSON.parse(localStorage.getItem("books")) || [];

    let bookName = document.getElementById("book-name").value;
    let author = document.getElementById("author").value;
    let category = document.getElementById("category").value;
    let description = document.getElementById("description").value;
    let newId = books.length > 0 ? Number(books[books.length - 1].id) + 1 : 101;

    let newBook = {
        id: newId,
        name: bookName,
        author: author,
        category: category,
        description: description,
        status: "available"
    };

    books.push(newBook);

    localStorage.setItem("books", JSON.stringify(books));

    alert("Book Added Successfully ✅");

    window.location.href = "/core/books/";
}

function displayHomeBooks() {
    const container = document.getElementById("homeBooksContainer");

    if (!container) return;

    let books = JSON.parse(localStorage.getItem("books")) || [];

    let latestBooks = books.slice(-3);

    container.innerHTML = "";

    latestBooks.forEach(book => {
        container.innerHTML += `
        <div class="book-card">
            <h3>${book.name}</h3>
            <p>${book.author}</p>
        </div>
        `;
    });
}
function initializeEditBookPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const bookId = urlParams.get("id");

    const books = JSON.parse(localStorage.getItem("books")) || [];
    const book = books.find(b => b.id == bookId);

    if (!book) return;

    
    document.getElementById("book-name").value = book.name;
    document.getElementById("author").value = book.author;
    document.getElementById("category").value = book.category;
    document.getElementById("description").value = book.description;
}
function updateBook(event) {
    event.preventDefault();

    let books = JSON.parse(localStorage.getItem("books")) || [];

    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");

    const index = books.findIndex(b => b.id == id);
    if (index === -1) return;

   
    books[index].name = document.getElementById("book-name").value;
    books[index].author = document.getElementById("author").value;
    books[index].category = document.getElementById("category").value;
    books[index].description = document.getElementById("description").value;

    
    localStorage.setItem("books", JSON.stringify(books));

    
    window.location.href = "/core/books/";
}

window.onclick = function(event) {
    let modal = document.getElementById("bookModal");
    if (event.target === modal) {
        modal.style.display = "none";
    }
}

function goToHome() {
    window.location.href = "/core/";
}

async function searchBooks(event) {
    event.preventDefault();

    const query = document.getElementById("searchInput").value.trim().toLowerCase();
    const container = document.getElementById("booksContainer");

    if (!container) return;

    if (!query) {
        displayBooks();
        return;
    }

    let books = JSON.parse(localStorage.getItem("books")) || [];

    const filtered = books.filter(book =>
        book.name.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query)
    );

    container.innerHTML = "";

    if (filtered.length === 0) {
        container.innerHTML = `<p style="color:white; text-align:center; grid-column:1/-1;">No books found.</p>`;
        return;
    }

    filtered.forEach(book => {
        container.innerHTML += `
        <div class="book-card">
            <h3>${book.name}</h3>
            <p>${book.author}</p>
            <p>${book.category}</p>
            <span class="badge ${book.status === "available" ? "available" : "not-available"}">
                ${book.status}
            </span>
            <button class="details-btn" onclick="window.location.href='/core/book_details/?id=${book.id}'">
                View Details
            </button>
        </div>
        `;
    });
}

function clearSearch() {
    const input = document.getElementById("searchInput");
    if (input) input.value = "";
    displayBooks();
}
 

 
document.addEventListener("DOMContentLoaded", function () {
    const path = window.location.pathname;
  
    if (path.includes("/core/books")) {
        displayBooks();
    }
 
    if (path === "/core/" || path.endsWith("/core/")) {
        displayHomeBooks();
    }
});



// Book Details Page

function getCSRFToken() {
    const cookieName = 'csrftoken';
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith(cookieName + '=')) {
            return decodeURIComponent(cookie.substring(cookieName.length + 1));
        }
    }
    return '';
}

async function initializeBookDetailsPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const bookId = urlParams.get('id');

    if (!bookId) {
        window.location.href = '/core/books/';
        return;
    }

    try {
        const response = await fetch(`/core/api/books/${bookId}/`, {
            method: 'GET',
            credentials: 'same-origin',
            headers: {
                'Accept': 'application/json',
            },
        });

        if (response.ok) {
            const data = await response.json();
            const book = data.book;

            if (!book) {
                throw new Error('Book not found');
            }

            populateBookDetails(book);
            setupBorrowButton(book);
            return;
        }
    } catch (error) {
        // Fall through to localStorage fallback
    }

    const localBook = getLocalBookById(bookId);
    if (localBook) {
        localBook.__source = 'local';
        populateBookDetails(localBook);
        setupBorrowButton(localBook);
        return;
    }

    window.location.href = '/core/books/';
}

function getLocalBooksSafe() {
    try {
        return JSON.parse(localStorage.getItem('books')) || [];
    } catch {
        return [];
    }
}

function setLocalBooksSafe(books) {
    localStorage.setItem('books', JSON.stringify(Array.isArray(books) ? books : []));
}

function getLocalBookById(bookId) {
    const books = getLocalBooksSafe();
    return books.find(b => String(b.id) === String(bookId)) || null;
}

function populateBookDetails(book) {

    const coverImg = document.querySelector('.book-cover');
    if (coverImg) {
        coverImg.src = book.coverImage || './Images/default-book-cover.jpg';
        coverImg.alt = book.name;
    }

    const titleElement = document.querySelector('.book-title');
    if (titleElement) {
        titleElement.textContent = book.name;
    }

    const categoryText = document.querySelector('#category .info-text');
    if (categoryText) {
        categoryText.innerHTML = `<strong>${book.category}</strong>`;
    }

    const authorText = document.querySelector('#author .info-text');
    if (authorText) {
        authorText.innerHTML = `<strong>${book.author}</strong>`;
    }

    const descriptionText = document.querySelector('#description .info-text');
    if (descriptionText) {
        descriptionText.innerHTML = book.description || 'No description available.';
    }

    const statusBadge = document.querySelector('.status-badge');
    if (statusBadge) {
        if (book.status === 'available') {
            statusBadge.textContent = 'Available';
            statusBadge.style.backgroundColor = '#2d4a2d';
            statusBadge.style.color = '#7ddf7d';
            statusBadge.style.border = '1px solid #3d7a3d';
        } else {
            statusBadge.textContent = 'Borrowed';
            statusBadge.style.backgroundColor = '#5a3d1c';
            statusBadge.style.color = '#e8b84c';
            statusBadge.style.border = '1px solid #b8862d';
        }
    }
}

function setupBorrowButton(book) {
    const borrowBtn = document.querySelector('.borrow-btn');
    const statusBadge = document.querySelector('.status-badge');
    const role = (typeof window !== 'undefined' && window.SERVER_ROLE) ? window.SERVER_ROLE : '';
    const isAuthenticated = (typeof window !== 'undefined' && window.IS_AUTHENTICATED) ? window.IS_AUTHENTICATED : false;
    const isLocalOnly = book && book.__source === 'local';

    if (!borrowBtn) return;

    if (role === 'admin') {
        const bookFooter = document.querySelector('.book-footer');
        if (bookFooter) {
            borrowBtn.remove();

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'borrow-btn';
            deleteBtn.type = 'button';
            deleteBtn.textContent = 'Delete';
            deleteBtn.onclick = async function () {
                const confirmed = confirm(`Are you sure you want to delete "${book.name}"?`);
                if (!confirmed) {
                    return;
                }

                try {
                    if (isLocalOnly) {
                        const books = getLocalBooksSafe();
                        const remaining = books.filter(b => String(b.id) !== String(book.id));
                        setLocalBooksSafe(remaining);
                        window.location.href = '/core/books/';
                        return;
                    }

                    const response = await fetch(`/core/api/books/${book.id}/delete/`, {
                        method: 'POST',
                        credentials: 'same-origin',
                        headers: {
                            'X-CSRFToken': getCSRFToken(),
                            'Accept': 'application/json',
                        },
                    });

                    if (!response.ok) {
                        const error = await response.json();
                        throw new Error(error.error || 'Delete failed');
                    }

                    window.location.href = '/core/books/';
                } catch (err) {
                    alert(err.message || 'Unable to delete the book.');
                }
            };

            const editBtn = document.createElement('button');
            editBtn.className = 'borrow-btn';
            editBtn.type = 'button';
            editBtn.textContent = 'Edit';
            editBtn.onclick = function () {
                window.location.href = `/core/edit_book/?id=${book.id}`;
            };

            bookFooter.appendChild(deleteBtn);
            bookFooter.appendChild(editBtn);
        }
        return;
    }

    if (book.status === 'borrowed') {
        borrowBtn.disabled = true;
        borrowBtn.textContent = 'Borrowed';
        borrowBtn.style.backgroundColor = '#555';
        borrowBtn.style.color = '#999';
        borrowBtn.style.cursor = 'not-allowed';
        borrowBtn.style.boxShadow = 'none';
        borrowBtn.style.opacity = '0.7';
        return;
    }

    if (!isAuthenticated) {
        borrowBtn.addEventListener('click', function(e) {
            e.preventDefault();
            alert('Please sign in to borrow books.');
            window.location.href = '/core/login/';
        });
        return;
    }

    borrowBtn.addEventListener('click', async function() {
        const confirmBorrow = confirm(`Do you want to borrow "${book.name}"?`);
        if (!confirmBorrow) {
            return;
        }

        try {
            if (isLocalOnly) {
                const books = getLocalBooksSafe();
                const index = books.findIndex(b => String(b.id) === String(book.id));
                if (index === -1) {
                    throw new Error('Book not found');
                }
                if (books[index].status === 'borrowed') {
                    throw new Error('Book is already borrowed.');
                }
                books[index].status = 'borrowed';
                setLocalBooksSafe(books);
            } else {
                const response = await fetch(`/core/api/books/${book.id}/borrow/`, {
                    method: 'POST',
                    credentials: 'same-origin',
                    headers: {
                        'X-CSRFToken': getCSRFToken(),
                        'Accept': 'application/json',
                    },
                });

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.error || 'Unable to borrow book');
                }
            }

            statusBadge.textContent = 'Borrowed';
            statusBadge.style.backgroundColor = '#5a3d1c';
            statusBadge.style.color = '#e8b84c';
            statusBadge.style.border = '1px solid #b8862d';

            borrowBtn.disabled = true;
            borrowBtn.textContent = 'Borrowed';
            borrowBtn.style.backgroundColor = '#555';
            borrowBtn.style.color = '#999';
            borrowBtn.style.cursor = 'not-allowed';
            borrowBtn.style.boxShadow = 'none';
            borrowBtn.style.opacity = '0.7';

            alert(`You have successfully borrowed "${book.name}"!`);
        } catch (err) {
            alert(err.message || 'Unable to borrow the book.');
        }
    });
}

// MY BOOKS PAGE 

async function initializeMyBooksPage() {
    const booksList = document.getElementById('myBooksList');
    if (!booksList) return;

    let borrowedBooks = [];
    try {
        const response = await fetch('/core/api/my_books/', {
            method: 'GET',
            credentials: 'same-origin',
            headers: {
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Unable to load borrowed books');
        }
        const data = await response.json();
        borrowedBooks = data.books || [];
    } catch (error) {
        borrowedBooks = [];
    }

    booksList.innerHTML = '';

    if (borrowedBooks.length === 0) {
        booksList.innerHTML = `
            <li style="text-align: center; color: #c0c0c0; padding: 40px; list-style: none;">
                You haven't borrowed any books yet.
            </li>
        `;
        return;
    }

    borrowedBooks.forEach(book => {
        const coverImage = book.coverImage || './Images/default-book-cover.jpg';
        const listItem = document.createElement('li');
        listItem.className = 'book-card';
        listItem.style.cursor = 'pointer';
        listItem.onclick = () => window.location.href = `/core/book_details/?id=${book.id}`;

        listItem.innerHTML = `
            <img class="book-cover" src="${coverImage}" alt="${book.name}" 
                 onerror="this.src='./Images/default-book-cover.jpg'">
            <div class="card-info">
                <h3 style="color: #e8e8e8; margin: 0 0 8px 0;">${book.name}</h3>
                <p style="color: #b0b0b0; margin: 0 0 12px 0;">by ${book.author}</p>
                <p style="color: #909090; margin: 0 0 12px 0;">${book.category}</p>
                <div class="book-status">
                    <span class="status-label">Status:</span>
                    <span class="status-badge" style="background-color: #5a3d1c; color: #e8b84c; border: 1px solid #b8862d; padding: 4px 12px; border-radius: 20px;">Borrowed</span>
                </div>
            </div>
        `;
        
        booksList.appendChild(listItem);
    });
}

document.addEventListener("DOMContentLoaded", function () {
    const path = window.location.pathname;

    if (path.includes("/core/books")) {
        displayBooks();
    }

    if (path === "/core/" || path.endsWith("/core/")) {
        displayHomeBooks();
    }

    if (path.includes("/core/book_details")) {
        initializeBookDetailsPage();
    }

    if (path.includes("/core/my_books")) {
        initializeMyBooksPage();
    }

    if (path.includes("/core/edit_book")) {
        initializeEditBookPage();
    }
});
