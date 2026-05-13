// HELPERS

function getCSRFToken() {
    const cookies = document.cookie.split(';');

    for (let cookie of cookies) {
        cookie = cookie.trim();

        if (cookie.startsWith('csrftoken=')) {
            return decodeURIComponent(cookie.substring(10));
        }
    }

    return '';
}

function goToHome() {
    window.location.href = "/core/";
}

// FETCH BOOKS 

async function fetchAllBooks() {

    const response = await fetch('/core/api/books/', {
        method: 'GET',
        credentials: 'same-origin',
        headers: {
            Accept: 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch books');
    }

    const data = await response.json();

    window.IS_ADMIN = data.is_admin;

    return data.books || [];
}

// RENDER BOOKS 

function renderBooks(container, books) {

    if (!container) return;

    if (books.length === 0) {
        container.innerHTML = `
            <p style="color:white;text-align:center;">
                No books found
            </p>
        `;
        return;
    }

    container.innerHTML = books.map(book => `
        <div class="book-card">

            <h3>${book.name}</h3>

            <p>${book.author}</p>

            <p>${book.category}</p>

            <span class="badge ${book.status === 'available'
                ? 'available'
                : 'not-available'}">

                ${book.status}

            </span>

            <button class="details-btn"
                onclick="goToDetails(${book.id})">
                View Details
            </button>
        </div>
    `).join('');
}

// NAVIGATION

function goToDetails(id) {
    window.location.href = `/core/book_details/?id=${id}`;
}

function goToEdit(id) {
    window.location.href = `/core/edit_book/?id=${id}`;
}

async function deleteBook(id) {

    const confirmDelete = confirm("Delete this book?");

    if (!confirmDelete) return;

    try {

        const response = await fetch(
            `/core/api/books/${id}/delete/`,
            {
                method: "POST",

                credentials: "same-origin",

                headers: {
                    "X-CSRFToken": getCSRFToken(),
                    Accept: "application/json"
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error);
        }

        alert("Book Deleted ✅");

        const container = document.getElementById("booksContainer");

        if (container) {
            displayBooks();
        } else {
            window.location.href = "/core/books/";
        }

    } catch (err) {

        alert(err.message);
    }
}

// BOOKS PAGE 

let allBooks = [];

async function displayBooks() {

    const container = document.getElementById("booksContainer");

    if (!container) return;

    try {

        allBooks = await fetchAllBooks();

        renderBooks(container, allBooks);

    } catch {

        container.innerHTML = `
            <p style="color:red">
                Failed to load books
            </p>
        `;
    }
}

// HOME PAGE

async function displayHomeBooks() {

    const container = document.getElementById("homeBooksContainer");

    if (!container) return;

    try {

        const books = await fetchAllBooks();

        renderBooks(container, books.slice(-3));

    } catch {

        container.innerHTML = `
            <p style="color:red">
                Failed to load books
            </p>
        `;
    }
}

// SEARCH 

function searchBooks(event) {

    event.preventDefault();

    const query = document
        .getElementById("searchInput")
        .value
        .trim()
        .toLowerCase();

    const filtered = allBooks.filter(book =>

        book.name.toLowerCase().includes(query) ||

        book.author.toLowerCase().includes(query)
    );

    renderBooks(
        document.getElementById("booksContainer"),
        filtered
    );
}

function clearSearch() {

    document.getElementById("searchInput").value = "";

    renderBooks(
        document.getElementById("booksContainer"),
        allBooks
    );
}

// ADD BOOK

async function addBook(event) {

    event.preventDefault();

    const body = {

        name:
            document.getElementById("book-name").value.trim(),

        author:
            document.getElementById("author").value.trim(),

        category:
            document.getElementById("category").value.trim(),

        description:
            document.getElementById("description").value.trim()
    };

    try {

        const response = await fetch('/core/api/books/add/', {

            method: 'POST',

            credentials: 'same-origin',

            headers: {

                'Content-Type': 'application/json',

                'X-CSRFToken': getCSRFToken(),

                Accept: 'application/json'
            },

            body: JSON.stringify(body)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error);
        }

        alert("Book Added Successfully ✅");

        window.location.href = "/core/books/";

    } catch (err) {

        alert(err.message);
    }
}

// EDIT BOOK

async function initializeEditBookPage() {

    const id = new URLSearchParams(window.location.search).get("id");

    if (!id) return;

    try {

        const response = await fetch(`/core/api/books/${id}/`);

        const data = await response.json();

        const book = data.book;

        document.getElementById("book-name").value = book.name;

        document.getElementById("author").value = book.author;

        document.getElementById("category").value = book.category;

        document.getElementById("description").value = book.description;

    } catch {

        alert("Failed to load book");
    }
}

async function updateBook(event) {

    event.preventDefault();

    const id = new URLSearchParams(window.location.search).get("id");

    const body = {

        name:
            document.getElementById("book-name").value.trim(),

        author:
            document.getElementById("author").value.trim(),

        category:
            document.getElementById("category").value.trim(),

        description:
            document.getElementById("description").value.trim()
    };

    try {

        const response = await fetch(`/core/api/books/${id}/edit/`, {

            method: 'POST',

            credentials: 'same-origin',

            headers: {

                'Content-Type': 'application/json',

                'X-CSRFToken': getCSRFToken(),

                Accept: 'application/json'
            },

            body: JSON.stringify(body)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error);
        }

        alert("Book Updated ✅");

        window.location.href = "/core/books/";

    } catch (err) {

        alert(err.message);
    }
}

// BOOK DETAILS 

async function initializeBookDetailsPage() {

    const id = new URLSearchParams(window.location.search).get("id");

    if (!id) {
        window.location.href = "/core/books/";
        return;
    }

    try {

        const response = await fetch(`/core/api/books/${id}/`);

        const data = await response.json();

        const book = data.book;

        // Cover Image
        const cover = document.getElementById("bookCover");
        if (cover) {
            if (book.coverImage) {
                cover.src = book.coverImage;
            } else {
                cover.src = "/static/images/default-book-cover.jpg";
            }
            cover.alt = book.name;
        }

        document.querySelector(".book-title").textContent = book.name;

        document.querySelector("#author .info-text").innerHTML =
            `<strong>${book.author}</strong>`;

        document.querySelector("#category .info-text").innerHTML =
            `<strong>${book.category}</strong>`;

        document.querySelector("#description .info-text").innerHTML =
            book.description || "No description";

        const badge = document.querySelector(".status-badge");

        badge.textContent =
            book.status === "available"
                ? "Available"
                : "Borrowed";

        setupBorrowButton(book);

    } catch {

        window.location.href = "/core/books/";
    }
}

// BORROW

function setupBorrowButton(book) {

    const btn = document.querySelector(
        ".borrow-btn[data-action='borrow'], .borrow-btn:not([data-action])"
    );

    if (!btn) return;

    if (book.status === "borrowed") {

        btn.disabled = true;

        btn.textContent = "Borrowed";

        return;
    }

    btn.addEventListener("click", async () => {

        // Some browsers block window.open() after an async boundary (await).
        // Pre-open the window synchronously on click to keep it user-initiated.
        const pdfUrlHint = book?.pdfUrl;
        const downloadWindow = pdfUrlHint ? window.open("", "_blank") : null;

        try {

            const response = await fetch(
                `/core/api/books/${book.id}/borrow/`,
                {
                    method: 'POST',

                    credentials: 'same-origin',

                    headers: {
                        'X-CSRFToken': getCSRFToken(),
                        Accept: 'application/json'
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error);
            }

            // Download the PDF
            const pdfUrl = data?.book?.pdfUrl || pdfUrlHint;
            if (pdfUrl) {
                if (downloadWindow) {
                    downloadWindow.location.href = pdfUrl;
                } else {
                    // If pre-open was blocked, fall back to same-tab navigation.
                    window.location.href = pdfUrl;
                    return;
                }
            } else if (downloadWindow) {
                downloadWindow.close();
            }

            alert("Book Borrowed ✅  —  Your PDF download has started!");

            location.reload();

        } catch (err) {

            if (downloadWindow) {
                downloadWindow.close();
            }

            alert(err.message || "Borrow failed");
        }
    });
}

// MY BOOKS

async function initializeMyBooksPage() {

    const container = document.getElementById("myBooksList");

    if (!container) return;

    try {

        const response = await fetch('/core/api/my_books/');

        const data = await response.json();

        const books = data.books || [];

        if (books.length === 0) {

            container.innerHTML = `
                <li style="color:white">
                    No borrowed books
                </li>
            `;

            return;
        }

        container.innerHTML = books.map(book => `

            <li class="book-card"
                onclick="goToDetails(${book.id})">

                <h3>${book.name}</h3>

                <p>${book.author}</p>

                <p>${book.category}</p>

            </li>

        `).join('');

    } catch {

        container.innerHTML = `
            <li style="color:red">
                Failed to load books
            </li>
        `;
    }
}


document.addEventListener("DOMContentLoaded", () => {

    const path = window.location.pathname;

    if (
        path.includes("/core/books") &&
        !path.includes("book_details") &&
        !path.includes("edit_book")
    ) {
        displayBooks();
    }

    if (
        path === "/core/" ||
        path.endsWith("/core/")
    ) {
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


document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);
    const bookId = urlParams.get('id');
    const currentUserId = window.CURRENT_USER_ID; 

    function getCsrfToken() {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, 10) === ('csrftoken=')) {
                    cookieValue = decodeURIComponent(cookie.substring(10));
                    break;
                }
            }
        }
        return cookieValue;
    }

    if (bookId) {
        fetch(`/api/v2/books/${bookId}/`) 
            .then(response => response.json())
            .then(data => {
                const book = data.book;
                const footerContainer = document.querySelector('.book-footer');
                const borrowBtn = document.querySelector('.borrow-btn[data-action="borrow"]');
                
                if (currentUserId && book.borrower_id == currentUserId) {
                    if (borrowBtn) {
                        borrowBtn.disabled = true;
                        borrowBtn.innerText = "Borrowed";
                        borrowBtn.style.opacity = "0.5";
                        borrowBtn.style.cursor = "not-allowed";

                        const unborrowBtn = document.createElement('button');
                        unborrowBtn.className = 'borrow-btn';
                        unborrowBtn.style.backgroundColor = '#d9534f';
                        unborrowBtn.style.marginLeft = '10px';
                        unborrowBtn.innerText = 'Unborrow';
                        unborrowBtn.type = 'button';
                        
                        unborrowBtn.onclick = function() {
                            if (confirm("Are you sure you want to return this book?")) {
                                fetch(`/unborrow/${bookId}/`, {
                                    method: 'POST',
                                    headers: {
                                        'X-CSRFToken': getCsrfToken(),
                                        'Content-Type': 'application/json'
                                    }
                                })
                                .then(res => res.json())
                                .then(result => {
                                    if (result.success) {
                                        alert("Book returned successfully!");
                                        window.location.reload(); 
                                    } else {
                                        alert(result.error || "An error occurred.");
                                    }
                                })
                                .catch(err => console.error("Error during unborrow:", err));
                            }
                        };
                        footerContainer.appendChild(unborrowBtn);
                    }
                }
            })
            .catch(err => console.error("Error fetching book details:", err));
    }
});

