function MatchPassword() {
    const password = document.getElementById("password");
    const ConfirmPassword = document.getElementById("Confirm-Password");
    const matchPassword = document.getElementById("MatchPasswordlabel");

    if (password.value !== ConfirmPassword.value) {
        matchPassword.innerText = 'Confirm password should match password';
        return false;
    }
    else {
        matchPassword.innerText = '';
        return true;
    }
}

function chooseSignUpDashboard() {
    const userRadio = document.getElementById("user");
    const signupForm = document.getElementById("signupForm");

    if (!MatchPassword()) {
        return false;
    }

    if (userRadio.checked) {
        localStorage.setItem("Role", "user");
        window.location.href = "home.html";
        return false;
    }
    else {
        localStorage.setItem("Role", "admin");
        signupForm.action = "home.html";
    }
}

function chooseLoginDashboard() {
    const userRadio = document.getElementById("user");
    const loginForm = document.getElementById("loginForm");

    if (userRadio.checked) {
        localStorage.setItem("Role", "user");
        window.location.href = "home.html";
        return false;
    }
    else {
        localStorage.setItem("Role", "admin");
        loginForm.action = "home.html";
    }
}

function logout() {
    localStorage.removeItem("Role");
    
    const navList = document.querySelector(".nav-list");
    
    navList.innerHTML = `
    <li class="nav-item"><a href="sign-up.html">Sign Up</a></li>
    <li class="nav-item"><a href="login.html">Login</a></li>
    `;
}

function homeNavbarAndFooterForUser() {
    const navList = document.querySelector(".nav-list");
    const fotterList = document.querySelector(".footer-list");
    const role = localStorage.getItem("Role");

    if (role == "user") {
        navList.innerHTML = `
        <li class="nav-item"><a href="books.html">View Books</a></li>
        <li class="nav-item"><a href="my_books.html">My Borrowed Books</a></li>
        <li class="nav-item"><a href="login.html" onclick="logout()">Logout</a></li>
        `;
        fotterList.innerHTML = `
        <li class="footer-item"><a href="books.html">View Books</a></li>
        <li class="footer-item"><a href="my_books.html">My Borrowed Books</a></li>
        <li class="footer-item"><a href="login.html" onclick="logout()">Logout</a></li>
        `;
    }
    else if (role == "admin") {
        navList.innerHTML = `
        <li class="nav-item"><a href="add_book.html">Add Book</a></li>
        <li class="nav-item"><a href="books.html">View Books</a></li>
        <li class="nav-item"><a href="login.html" onclick="logout()">Logout</a></li>
        `;
        fotterList.innerHTML = `
        <li class="footer-item"><a href="add_book.html">Add Book</a></li>
        <li class="footer-item"><a href="books.html">View Books</a></li>
        <li class="footer-item"><a href="login.html" onclick="logout()">Logout</a></li>
        `;
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const path = window.location.pathname;
    if (path.endsWith("login.html") || path.endsWith("sign-up.html")) {
        localStorage.removeItem("Role");
        return;
    }
    else {
        homeNavbarAndFooterForUser();
    }
});


function displayBooks() {
    const container = document.getElementById("booksContainer");
    const role = localStorage.getItem("Role");

    if (!container) return;

    let books = JSON.parse(localStorage.getItem("books")) || [];

    container.innerHTML = "";

    books.forEach((book, index) => {
        if (role == "user") {
            container.innerHTML += `
            <div class="book-card">
                <h3>${book.name}</h3>
                <p>${book.author}</p>
                <p>${book.category}</p>
                <span class="badge ${book.status === "available" ? "available" : "not-available"}">
                    ${book.status}
                </span>
                <button class="details-btn" onclick="showDetails(${index})">
                    View Details
                </button>
            </div>
            `;
        }
        else if (role == "admin") {
            container.innerHTML += `
            <div class="book-card">
                <h3>${book.name}</h3>
                <p>${book.author}</p>
                <p>${book.category}</p>
                <span class="badge ${book.status === "available" ? "available" : "not-available"}">
                    ${book.status}
                </span>
                <button class="details-btn" onclick="showDetails(${index})">
                    View Details
                </button>
                <button class="details-btn" onclick="deleteBook(${index})">
                    Delete
                </button>
            </div>
            `;
        }
    });
}

function deleteBook(index) {
    let books = JSON.parse(localStorage.getItem("books")) || [];

    const confirmed = confirm(`Are you sure you want to delete "${books[index].name}"?`);
    if (!confirmed) {
        return;
    }

    books.splice(index, 1);
    localStorage.setItem("books", JSON.stringify(books));

    alert("Book deleted successfully.");
    displayBooks();
}

function showDetails(index) {
    let books = JSON.parse(localStorage.getItem("books"));
    const book = books[index];

    const modalBody = document.getElementById("modalBody");

    modalBody.innerHTML = `
        <p><strong>ID:</strong> ${book.id}</p>
        <p><strong>Name:</strong> ${book.name}</p>
        <p><strong>Author:</strong> ${book.author}</p>
        <p><strong>Category:</strong> ${book.category}</p>
        <p><strong>Description:</strong> ${book.description}</p>
        <p><strong>Status:</strong> ${book.status}</p>
    `;

    document.getElementById("bookModal").style.display = "block";
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

    window.location.href = "books.html";
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

window.onclick = function(event) {
    let modal = document.getElementById("bookModal");
    if (event.target === modal) {
        modal.style.display = "none";
    }
}

function goToHome() {
    window.location.href = "Home.html"
}

document.addEventListener("DOMContentLoaded", function () {
    const path = window.location.pathname;

    if (path.includes("books.html")) {
        displayBooks();
    }

    if (path.includes("home.html")) {
        displayHomeBooks();
    }

    if (path.endsWith("login.html") || path.endsWith("sign-up.html")) {
        localStorage.removeItem("Role");
        return;
    } else {
        homeNavbarAndFooterForUser();
    }
});

function searchBooks(event) {
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
        const allBooks = JSON.parse(localStorage.getItem("books")) || [];
        const index = allBooks.findIndex(b => b.id === book.id);
 
        container.innerHTML += `
        <div class="book-card">
            <h3>${book.name}</h3>
            <p>${book.author}</p>
            <p>${book.category}</p>
            <span class="badge ${book.status === "available" ? "available" : "not-available"}">
                ${book.status}
            </span>
            <button class="details-btn" onclick="showDetails(${index})">
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
 
    if (path.endsWith("login.html") || path.endsWith("sign-up.html")) {
        localStorage.removeItem("Role");
        return;
    }
 
    homeNavbarAndFooterForUser();
 
    if (path.includes("books.html")) {
        displayBooks();
    }
 
    if (path.includes("home.html")) {
        displayHomeBooks();
    }
});



// Book Details Page

function initializeBookDetailsPage() {
    const borrowBtn = document.querySelector(".borrow-btn");
    const statusBadge = document.querySelector(".status-badge");

    if (!borrowBtn) return;

    const bookTitle = document.querySelector(".book-title")?.textContent.trim() || "this book";

    const modal = document.createElement("div");
    modal.id = "borrow-modal";
    modal.innerHTML = `
        <div class="modal-backdrop"></div>
        <div class="modal-box" role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <h2 class="modal-title" id="modal-title">Confirm Borrow</h2>
            <p class="modal-msg">Are you sure you want to borrow <strong>${bookTitle}</strong>?</p>
            <div class="modal-actions">
                <button class="modal-btn modal-cancel" type="button">Cancel</button>
                <button class="modal-btn modal-confirm" type="button">Yes, Borrow</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);


    const style = document.createElement("style");
    style.textContent = `
        #borrow-modal {
            display: none;
            position: fixed;
            inset: 0;
            z-index: 1000;
            align-items: center;
            justify-content: center;
        }
        #borrow-modal.open {
            display: flex;
        }
        .modal-backdrop {
            position: absolute;
            inset: 0;
            background: rgba(0, 0, 0, 0.65);
            backdrop-filter: blur(3px);
            animation: fadeIn 0.2s ease;
        }
        .modal-box {
            position: relative;
            background: #242424;
            border: 1px solid #444;
            border-top: 3px solid #c9a84c;
            border-radius: 14px;
            padding: 36px 40px;
            max-width: 420px;
            width: 90%;
            box-shadow: 0 20px 60px rgba(0,0,0,0.6);
            animation: slideUp 0.25s ease;
            z-index: 1;
        }
        .modal-title {
            font-family: Georgia, serif;
            font-style: italic;
            font-size: 1.4rem;
            color: #c9a84c;
            margin: 0 0 14px;
        }
        .modal-msg {
            color: #c0c0c0;
            font-size: 1rem;
            line-height: 1.7;
            margin: 0 0 28px;
        }
        .modal-msg strong {
            color: #e8e8e8;
        }
        .modal-actions {
            display: flex;
            gap: 12px;
            justify-content: flex-end;
        }
        .modal-btn {
            padding: 10px 28px;
            border-radius: 8px;
            font-family: Georgia, serif;
            font-size: 0.9rem;
            font-weight: 700;
            letter-spacing: 0.06em;
            cursor: pointer;
            border: none;
            transition: background-color 0.2s, transform 0.15s;
        }
        .modal-cancel {
            background: #3a3a3a;
            color: #b0b0b0;
            border: 1px solid #555;
        }
        .modal-cancel:hover {
            background: #444;
            color: #e0e0e0;
        }
        .modal-confirm {
            background: #c9a84c;
            color: #1a1a1a;
            box-shadow: 0 4px 18px rgba(201,168,76,0.3);
        }
        .modal-confirm:hover {
            background: #d4b96a;
            transform: translateY(-1px);
        }
        .modal-confirm:active {
            transform: translateY(0);
        }
        .status-badge.status-borrowed {
            background-color: #3d2e10;
            color: #e0a040;
            border: 1px solid #66480a;
        }
        .borrow-btn:disabled {
            background-color: #555;
            color: #888;
            cursor: not-allowed;
            box-shadow: none;
            transform: none;
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to   { opacity: 1; }
        }
        @keyframes slideUp {
            from { opacity: 0; transform: translateY(20px); }
            to   { opacity: 1; transform: translateY(0);    }
        }
    `;
    document.head.appendChild(style);

    borrowBtn.addEventListener("click", () => {
        if (borrowBtn.disabled) return;
        modal.classList.add("open");
        modal.querySelector(".modal-confirm").focus();
    });

    modal.querySelector(".modal-cancel").addEventListener("click", closeBookDetailsModal);
    modal.querySelector(".modal-backdrop").addEventListener("click", closeBookDetailsModal);

    modal.querySelector(".modal-confirm").addEventListener("click", () => {
        closeBookDetailsModal();
        confirmBorrowForBook(statusBadge, borrowBtn);
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.classList.contains("open")) closeBookDetailsModal();
    });

    function closeBookDetailsModal() {
        modal.classList.remove("open");
    }

    restoreBookBorrowState(statusBadge, borrowBtn);
}

function confirmBorrowForBook(statusBadge, borrowBtn) {

    statusBadge.textContent = "Borrowed";
    statusBadge.className = "status-badge status-borrowed";

    borrowBtn.disabled = true;
    borrowBtn.textContent = "Borrowed";

    const bookId = getBookIdFromPage();
    if (bookId) {
        const borrowed = JSON.parse(localStorage.getItem("borrowedBooks") || "{}");
        borrowed[bookId] = "borrowed";
        localStorage.setItem("borrowedBooks", JSON.stringify(borrowed));
    }
}

function getBookIdFromPage() {
    const filename = window.location.pathname.split("/").pop();
    const idMap = {
        "book_details.html": "book_details",
        "book_details3.html": "book_details3",
        "book_deatils2.html": "book_deatils2"
    };
    return idMap[filename] || filename?.replace(".html", "") || null;
}

function restoreBookBorrowState(statusBadge, borrowBtn) {
    const bookId = getBookIdFromPage();
    if (!bookId) return;
    const borrowed = JSON.parse(localStorage.getItem("borrowedBooks") || "{}");
    if (borrowed[bookId] === "borrowed") {
        statusBadge.textContent = "Borrowed";
        statusBadge.className = "status-badge status-borrowed";
        borrowBtn.disabled = true;
        borrowBtn.textContent = "Borrowed";
    }
}


// My Books Page

function initializeMyBooksPage() {

    const bookPageMap = {
        "subtle-art": "book_details.html",
        "atomic-habits": "book_details3.html",
        "rich-dad-poor-dad": "book_deatils2.html",
    };


    const statusConfig = {
        returned: { label: "Returned", cls: "status-returned" },
        overdue: { label: "Overdue", cls: "status-overdue" },
        borrowed: { label: "Borrowed", cls: "status-borrowed" },
        available: { label: "Available", cls: "status-available" },
    };


    const style = document.createElement("style");
    style.textContent = `
        .status-available {
            background-color: #1a3d2b;
            color: #4caf77;
            border: 1px solid #2e6644;
        }
        .status-available::before {
            background-color: #4caf77;
        }
        .book-card {
            cursor: pointer;
        }
        .book-card:hover .book-cover {
            opacity: 0.85;
            transition: opacity 0.2s;
        }
    `;
    document.head.appendChild(style);


    const borrowed = JSON.parse(localStorage.getItem("borrowedBooks") || "{}");

    Object.entries(bookPageMap).forEach(([cardId, pageFile]) => {
        const card = document.getElementById(cardId);
        if (!card) return;

        const badge = card.querySelector(".status-badge");
        if (!badge) return;

        const storageKey = pageFile.replace(".html", "");

        if (borrowed[storageKey] === "borrowed") {
            applyStatusToBadge(badge, "borrowed", statusConfig);
        }


        card.addEventListener("click", () => {
            window.location.href = pageFile;
        });
    });

    function applyStatusToBadge(badge, statusKey, config) {
        const cfg = config[statusKey];
        if (!cfg) return;


        Object.values(config).forEach(({ cls }) => badge.classList.remove(cls));

        badge.textContent = cfg.label;
        badge.classList.add(cfg.cls);
    }
}

// Modefied DOMContentLoaded TO HANDLE ALL PAGES


document.addEventListener("DOMContentLoaded", function () {
    const path = window.location.pathname;
    const filename = path.split("/").pop();

    if (filename === "login.html" || filename === "sign-up.html") {
        localStorage.removeItem("Role");
        return;
    }

    homeNavbarAndFooterForUser();

    if (filename === "books.html") {
        displayBooks();
    }

    if (filename === "home.html") {
        displayHomeBooks();
    }

    if (filename === "book_details.html" || filename === "book_details3.html" || filename === "book_deatils2.html") {
        initializeBookDetailsPage();
    }

    if (filename === "my_books.html") {
        initializeMyBooksPage();
    }
});
