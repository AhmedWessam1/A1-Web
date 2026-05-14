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
            Accept: 'application/json',
            'Cache-Control': 'no-cache'
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
        container.innerHTML = `<p style="color:red">Failed to load books</p>`;
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
    const borrowBtn = document.getElementById('borrowBtn');
    const returnBtn = document.getElementById('returnBtn');

    if (!borrowBtn || !returnBtn) return;

    const isAvailable = book.status === 'available';

    // Borrow button
    borrowBtn.disabled = !isAvailable;
    borrowBtn.style.opacity = isAvailable ? '1' : '0.4';
    borrowBtn.style.cursor = isAvailable ? 'pointer' : 'not-allowed';

    // Return button
    returnBtn.disabled = isAvailable;
    returnBtn.style.opacity = isAvailable ? '0.4' : '1';
    returnBtn.style.cursor = isAvailable ? 'not-allowed' : 'pointer';

    borrowBtn.onclick = async () => {
        if (borrowBtn.disabled) return;

        const downloadWindow = window.open("", "_blank");
        try {
            const response = await fetch(`/core/api/books/${book.id}/borrow/`, {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    'X-CSRFToken': getCSRFToken(),
                    Accept: 'application/json'
                }
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error);
            }

            // Download the PDF
            const pdfUrl = data.book.pdfUrl;
            if (pdfUrl) {
                downloadWindow.location.href = pdfUrl;
            }
            alert("Book Borrowed ✅  —  Your PDF download has started!");

            location.reload();
        } catch (err) {

            if (downloadWindow) {
                downloadWindow.close();
            }

            alert(err.message || "Borrow failed");
        }
    };

    returnBtn.onclick = async () => {
        if (returnBtn.disabled) return;
        try {
            const response = await fetch(`/core/api/books/${book.id}/return/`, {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    'X-CSRFToken': getCSRFToken(),
                    Accept: 'application/json'
                }
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error);
            alert("Book Returned ✅");
            window.location.href = "/core/my_books/";
        } catch (err) {
            alert(err.message || "Return failed");
        }
    };
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

    window.addEventListener('pageshow', (event) => {
        if (event.persisted) {
            displayBooks();
            displayHomeBooks();
        }
    });
})

