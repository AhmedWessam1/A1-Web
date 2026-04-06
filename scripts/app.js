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
    
    if (navList) {
        navList.innerHTML = `
        <li class="nav-item"><a href="sign-up.html">Sign Up</a></li>
        <li class="nav-item"><a href="login.html">Login</a></li>
        `;
    }
}

function homeNavbarAndFooterForUser() {
    const navList = document.querySelector(".nav-list");
    const fotterList = document.querySelector(".footer-list");
    const role = localStorage.getItem("Role");

    if (role == "user") {
        if (navList) {
            navList.innerHTML = `
            <li class="nav-item"><a href="books.html">View Books</a></li>
            <li class="nav-item"><a href="my_books.html">My Borrowed Books</a></li>
            <li class="nav-item"><a href="login.html" onclick="logout()">Logout</a></li>
            `;
        }
        if (fotterList) {
            fotterList.innerHTML = `
            <li class="footer-item"><a href="books.html">View Books</a></li>
            <li class="footer-item"><a href="my_books.html">My Borrowed Books</a></li>
            <li class="footer-item"><a href="login.html" onclick="logout()">Logout</a></li>
            `;
        }
    }
    else if (role == "admin") {
        if (navList) {
            navList.innerHTML = `
            <li class="nav-item"><a href="add_book.html">Add Book</a></li>
            <li class="nav-item"><a href="books.html">View Books</a></li>
            <li class="nav-item"><a href="login.html" onclick="logout()">Logout</a></li>
            `;
        }
        if (fotterList) {
            fotterList.innerHTML = `
            <li class="footer-item"><a href="add_book.html">Add Book</a></li>
            <li class="footer-item"><a href="books.html">View Books</a></li>
            <li class="footer-item"><a href="login.html" onclick="logout()">Logout</a></li>
            `;
        }
    }
}

function displayBooks() {
    const container = document.getElementById("booksContainer");
    const role = localStorage.getItem("Role");

    if (!container) return;

    let books = JSON.parse(localStorage.getItem("books")) || [];

    container.innerHTML = "";

    books.forEach((book, index) => {
        if (role == "user") {
            const isBorrowed = book.status === "borrowed";
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
                <button class="borrow-from-books-btn" onclick="borrowBookFromBooks(${index})" ${book.status !== "available" ? "disabled" : ""}>
                    ${isBorrowed ? "Borrowed" : "Borrow"}
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
                <button class="details-btn" onclick="">
                    Edit
                </button>
            </div>
            `;
        }
    });
}

function borrowBookFromBooks(index) {
    let books = JSON.parse(localStorage.getItem("books")) || [];
    const book = books[index];

    if (book.status !== "available") {
        alert("This book is not available for borrowing.");
        return;
    }

    const confirmed = confirm(`Are you sure you want to borrow "${book.name}"?`);
    if (!confirmed) return;

    book.status = "borrowed";
    books[index] = book;
    localStorage.setItem("books", JSON.stringify(books));

    let borrowedBooks = JSON.parse(localStorage.getItem("borrowedBooksList")) || [];
    const alreadyBorrowed = borrowedBooks.some(b => b.id === book.id);
    if (!alreadyBorrowed) {
        borrowedBooks.push({
            id: book.id,
            name: book.name,
            author: book.author,
            category: book.category,
            description: book.description,
            borrowedDate: new Date().toISOString(),
            dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
            status: "borrowed"
        });
        localStorage.setItem("borrowedBooksList", JSON.stringify(borrowedBooks));
    }

    alert(`You have successfully borrowed "${book.name}". It is due in 14 days.`);
    displayBooks();
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

function searchBooks(event) {
    event.preventDefault();
    const role = localStorage.getItem("Role");
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
 
        if (role == "user") {
            const isBorrowed = book.status === "borrowed";
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
                <button class="borrow-from-books-btn" onclick="borrowBookFromBooks(${index})" ${book.status !== "available" ? "disabled" : ""}>
                    ${isBorrowed ? "Borrowed" : "Borrow"}
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

// BOOK DETAILS PAGE

function borrowBookFromDetails(bookTitle, bookAuthor, bookId) {

    let borrowedBooks = JSON.parse(localStorage.getItem("borrowedBooksList")) || [];
    const alreadyBorrowed = borrowedBooks.some(b => b.id === bookId);
    
    if (alreadyBorrowed) {
        alert("You have already borrowed this book!");
        return false;
    }
    
    let books = JSON.parse(localStorage.getItem("books")) || [];
    const bookInMain = books.find(b => b.name === bookTitle);
    
    if (bookInMain && bookInMain.status === "borrowed") {
        alert("This book is already borrowed by someone else!");
        return false;
    }
    
    const confirmed = confirm(`Are you sure you want to borrow "${bookTitle}"?`);
    if (!confirmed) return false;
    
    if (bookInMain) {
        bookInMain.status = "borrowed";
        localStorage.setItem("books", JSON.stringify(books));
    }
    
    borrowedBooks.push({
        id: bookId,
        name: bookTitle,
        author: bookAuthor,
        borrowedDate: new Date().toISOString(),
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        status: "borrowed"
    });
    localStorage.setItem("borrowedBooksList", JSON.stringify(borrowedBooks));
    
    alert(`You have successfully borrowed "${bookTitle}". It is due in 14 days.`);
    return true;
}

function setupBookDetailsPage() {
    const borrowBtn = document.querySelector(".borrow-btn");
    const statusBadge = document.querySelector(".status-badge");
    
    if (!borrowBtn) return;
    
    const bookTitle = document.querySelector(".book-title")?.textContent.trim() || "";
    let bookAuthor = "";
    
    const authorElement = document.querySelector("#author .info-text");
    if (authorElement) {
        const authorText = authorElement.textContent.trim();
        const match = authorText.match(/—\s*(.*?)(?:\n|$)/);
        bookAuthor = match ? match[1].trim() : authorText;
    }
    
    const bookId = bookTitle.replace(/\s+/g, "-").toLowerCase();
    
    let borrowedBooks = JSON.parse(localStorage.getItem("borrowedBooksList")) || [];
    const isBorrowed = borrowedBooks.some(b => b.id === bookId);
    
    if (isBorrowed) {

        borrowBtn.disabled = true;
        borrowBtn.textContent = "Borrowed";
        borrowBtn.style.backgroundColor = "#555";
        borrowBtn.style.color = "#888";
        borrowBtn.style.cursor = "not-allowed";
        borrowBtn.style.opacity = "0.6";
        
        if (statusBadge) {
            statusBadge.textContent = "Borrowed";
            statusBadge.style.backgroundColor = "#3d2e10";
            statusBadge.style.color = "#e0a040";
        }
    }
    
    borrowBtn.onclick = function() {
        if (borrowBtn.disabled) return;
        
        const success = borrowBookFromDetails(bookTitle, bookAuthor, bookId);
        if (success) {

            borrowBtn.disabled = true;
            borrowBtn.textContent = "Borrowed";
            borrowBtn.style.backgroundColor = "#555";
            borrowBtn.style.color = "#888";
            borrowBtn.style.cursor = "not-allowed";
            borrowBtn.style.opacity = "0.6";
            
            if (statusBadge) {
                statusBadge.textContent = "Borrowed";
                statusBadge.style.backgroundColor = "#3d2e10";
                statusBadge.style.color = "#e0a040";
            }
        }
    };
}

// MY BOOKS PAGE

function displayMyBooks() {
    const container = document.querySelector(".books-list");
    if (!container) return;
    
    let borrowedBooks = JSON.parse(localStorage.getItem("borrowedBooksList")) || [];
    
    if (borrowedBooks.length === 0) {
        container.innerHTML = `
            <li style="list-style: none; text-align: center; padding: 60px;">
                <p style="color: #c0c0c0;">📚 You haven't borrowed any books yet.</p>
                <a href="books.html" style="display: inline-block; margin-top: 20px; padding: 10px 20px; background: #c9a84c; color: #1a1a1a; text-decoration: none; border-radius: 6px;">Browse Books</a>
            </li>
        `;
        return;
    }
    
    container.innerHTML = "";
    
    borrowedBooks.forEach((book, index) => {
        const dueDate = new Date(book.dueDate);
        const today = new Date();
        const daysLeft = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
        const isOverdue = daysLeft < 0;
        
        const listItem = document.createElement("li");
        listItem.className = "book-card";
        listItem.style.cssText = "display: flex; gap: 20px; padding: 20px; background: #242424; border-radius: 10px; margin-bottom: 15px;";
        
        listItem.innerHTML = `
            <div style="flex: 1;">
                <h3 style="color: #c9a84c; margin: 0 0 8px 0;">${book.name}</h3>
                <p style="color: #c0c0c0; margin: 0 0 5px 0;">by ${book.author || "Unknown Author"}</p>
                <p style="color: #909090; font-size: 0.9rem; margin: 10px 0;">
                    <strong>Borrowed:</strong> ${new Date(book.borrowedDate).toLocaleDateString()}<br>
                    <strong>Due:</strong> ${dueDate.toLocaleDateString()}
                    ${isOverdue ? '<span style="color: #d05555;"> (OVERDUE)</span>' : `<span style="color: #4caf77;"> (${daysLeft} days left)</span>`}
                </p>
                <button onclick="returnBookFromMyBooks(${index})" style="padding: 8px 20px; background: #444; color: #c9a84c; border: 1px solid #c9a84c; border-radius: 6px; cursor: pointer;">
                    Return Book
                </button>
            </div>
        `;
        
        container.appendChild(listItem);
    });
}

function returnBookFromMyBooks(index) {
    let borrowedBooks = JSON.parse(localStorage.getItem("borrowedBooksList")) || [];
    const book = borrowedBooks[index];
    
    if (!book) return;
    
    const confirmed = confirm(`Are you sure you want to return "${book.name}"?`);
    if (!confirmed) return;
    
    borrowedBooks.splice(index, 1);
    localStorage.setItem("borrowedBooksList", JSON.stringify(borrowedBooks));
    
    let books = JSON.parse(localStorage.getItem("books")) || [];
    const bookInMain = books.find(b => b.name === book.name);
    if (bookInMain) {
        bookInMain.status = "available";
        localStorage.setItem("books", JSON.stringify(books));
    }
    
    alert(`"${book.name}" has been returned successfully!`);
    displayMyBooks();
}

// Main DOMContentLoaded handler
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
        setupBookDetailsPage();
    }

    if (filename === "my_books.html") {
        displayMyBooks();
    }
});
