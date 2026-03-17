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

    if (!signupForm) {
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

    if (!loginForm) {
        return false;
    }

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

function homeNavbarForUser() {
    const navList = document.querySelector(".nav-list");
    const role = localStorage.getItem("Role");

    if (!navList || !role) {
        return;
    }

    if (role == "user") {
        navList.innerHTML = `
        <li class="nav-item"><a href="user_dashboard.html">Dashboard</a></li>
        <li class="nav-item"><a href="books.html">View Books</a></li>
        <li class="nav-item"><a href="my_books.html">My Borrowed Books</a></li>
        <li class="nav-item"><a href="login.html" onclick="logout()">Logout</a></li>
        `;
    }
    else if (role == "admin") {
        navList.innerHTML = `
        <li class="nav-item"><a href="admin_dashboard.html">Dashboard</a></li>
        <li class="nav-item"><a href="add_book.html">Add Book</a></li>
        <li class="nav-item"><a href="books.html">View Books</a></li>
        <li class="nav-item"><a href="login.html" onclick="logout()">Logout</a></li>
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
        homeNavbarForUser();
    }
});