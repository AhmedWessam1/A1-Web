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
                <button class="details-btn" onclick="window.location.href='book_details.html?id=${book.id}'">
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
                <button class="details-btn" onclick="window.location.href='book_details.html?id=${book.id}'">
                    View Details
                </button>
                <button class="details-btn" onclick="deleteBook(${index})">
                    Delete
                </button>
                <button class="details-btn" onclick="">
                    Edit
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
    
    window.location.href = `book_details.html?id=${book.id}`;
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
        const role = localStorage.getItem("Role");
        
        if (role == "user") {
            container.innerHTML += `
            <div class="book-card">
                <h3>${book.name}</h3>
                <p>${book.author}</p>
                <p>${book.category}</p>
                <span class="badge ${book.status === "available" ? "available" : "not-available"}">
                    ${book.status}
                </span>
                <button class="details-btn" onclick="window.location.href='book_details.html?id=${book.id}'">
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
                <button class="details-btn" onclick="window.location.href='book_details.html?id=${book.id}'">
                    View Details
                </button>
                <button class="details-btn" onclick="deleteBook(${index})">
                    Delete
                </button>
                <button class="details-btn" onclick="">
                    Edit
                </button>
            </div>
            `;
        }
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
    const urlParams = new URLSearchParams(window.location.search);
    const bookId = urlParams.get('id');
    
    if (!bookId) {
        window.location.href = "books.html";
        return;
    }
    
    const books = JSON.parse(localStorage.getItem("books")) || [];
    const book = books.find(b => b.id == bookId);
    
    if (!book) {
        window.location.href = "books.html";
        return;
    }
    
    populateBookDetails(book);
    
    setupBorrowButton(book);
}

function populateBookDetails(book) {

    const coverImg = document.querySelector(".book-cover");
    if (coverImg) {
        coverImg.src = book.coverImage || "./Images/default-book-cover.jpg";
        coverImg.alt = book.name;
    }
    
    const titleElement = document.querySelector(".book-title");
    if (titleElement) {
        titleElement.textContent = book.name;
    }
    
    const categoryText = document.querySelector("#category .info-text");
    if (categoryText) {
        categoryText.innerHTML = `<strong>${book.category}</strong>`;
    }
    
    const authorText = document.querySelector("#author .info-text");
    if (authorText) {
        authorText.innerHTML = `<strong>${book.author}</strong>`;
    }
    
    const descriptionText = document.querySelector("#description .info-text");
    if (descriptionText) {
        descriptionText.innerHTML = book.description || "No description available.";
    }
    
    const statusBadge = document.querySelector(".status-badge");
    if (statusBadge) {
        if (book.status === "available") {
            statusBadge.textContent = "Available";
            statusBadge.style.backgroundColor = "#2d4a2d";
            statusBadge.style.color = "#7ddf7d";
            statusBadge.style.border = "1px solid #3d7a3d";
        } else {
            statusBadge.textContent = "Borrowed";
            statusBadge.style.backgroundColor = "#5a3d1c";
            statusBadge.style.color = "#e8b84c";
            statusBadge.style.border = "1px solid #b8862d";
        }
    }
}

function setupBorrowButton(book) {
    const borrowBtn = document.querySelector(".borrow-btn");
    const statusBadge = document.querySelector(".status-badge");
    
    if (!borrowBtn) return;
    
    if (book.status === "borrowed") {
        borrowBtn.disabled = true;
        borrowBtn.textContent = "Borrowed";
        borrowBtn.style.backgroundColor = "#555";
        borrowBtn.style.color = "#999";
        borrowBtn.style.cursor = "not-allowed";
        borrowBtn.style.boxShadow = "none";
        borrowBtn.style.opacity = "0.7";
        return;
    }
    
    borrowBtn.addEventListener("click", function() {
        const role = localStorage.getItem("Role");
        if (!role || role !== "user") {
            alert("Please login as a user to borrow books!");
            window.location.href = "login.html";
            return;
        }
        
        const confirmBorrow = confirm(`Do you want to borrow "${book.name}"?`);
        
        if (confirmBorrow) {
            statusBadge.textContent = "Borrowed";
            statusBadge.style.backgroundColor = "#5a3d1c";
            statusBadge.style.color = "#e8b84c";
            statusBadge.style.border = "1px solid #b8862d";
            
            borrowBtn.disabled = true;
            borrowBtn.textContent = "Borrowed";
            borrowBtn.style.backgroundColor = "#555";
            borrowBtn.style.color = "#999";
            borrowBtn.style.cursor = "not-allowed";
            borrowBtn.style.boxShadow = "none";
            borrowBtn.style.opacity = "0.7";
            
            const books = JSON.parse(localStorage.getItem("books")) || [];
            const bookIndex = books.findIndex(b => b.id == book.id);
            
            if (bookIndex !== -1) {
                books[bookIndex].status = "borrowed";
                localStorage.setItem("books", JSON.stringify(books));
            }
            
            const borrowed = JSON.parse(localStorage.getItem("borrowedBooks") || "{}");
            borrowed[book.id] = "borrowed";
            localStorage.setItem("borrowedBooks", JSON.stringify(borrowed));
            
            alert(`You have successfully borrowed "${book.name}"!`);
        }
    });
}

// MY BOOKS PAGE 

function initializeMyBooksPage() {
    const booksList = document.getElementById("myBooksList");
    
    if (!booksList) return;
    
    const borrowed = JSON.parse(localStorage.getItem("borrowedBooks") || "{}");
    const books = JSON.parse(localStorage.getItem("books")) || [];
    
    const borrowedBooks = books.filter(book => {
        return (borrowed[book.id] === "borrowed" || book.status === "borrowed");
    });
    
    booksList.innerHTML = "";
    
    if (borrowedBooks.length === 0) {
        booksList.innerHTML = `
            <li style="text-align: center; color: #c0c0c0; padding: 40px; list-style: none;">
                You haven't borrowed any books yet.
            </li>
        `;
        return;
    }
    
    borrowedBooks.forEach(book => {
        const coverImage = book.coverImage || "./Images/default-book-cover.jpg";
        
        const listItem = document.createElement("li");
        listItem.className = "book-card";
        listItem.style.cursor = "pointer";
        listItem.onclick = () => window.location.href = `book_details.html?id=${book.id}`;
        
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

    if (filename === "book_details.html" || filename.includes("book_details")) {
        initializeBookDetailsPage();
    }

    if (filename === "my_books.html") {
        initializeMyBooksPage();
    }
});
