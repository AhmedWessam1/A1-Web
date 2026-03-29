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

function goToAddBooks() {
    window.location.href = "add_book.html"
}

function goToEditBooks() {
    window.location.href = "edit_book.html"
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
        homeNavbarForUser();
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
