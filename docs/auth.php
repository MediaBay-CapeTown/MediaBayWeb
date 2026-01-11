<?php
session_start();
require_once 'config/database.php';

/* =========================
   LOGOUT
========================= */
if (isset($_POST['logout'])) {
    session_unset();
    session_destroy();
    header("Location: index.php");
    exit;
}

/* =========================
   SIGNUP
========================= */
if (isset($_POST['form_action']) && $_POST['form_action'] === 'signup') {

    $email    = trim($_POST['email'] ?? '');
    $password = trim($_POST['password'] ?? '');
    $confirm  = trim($_POST['confirm_password'] ?? '');

    $signup_errors = [];

    // Email validation
    if ($email === '') {
        $signup_errors['email'] = 'Email is required';
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $signup_errors['email'] = 'Invalid email address';
    }

    // Password validation
    if ($password === '') {
        $signup_errors['password'] = 'Password is required';
    } elseif (strlen($password) < 8) {
        $signup_errors['password'] = 'Password must be at least 8 characters';
    }

    // Confirm password
    if ($confirm === '') {
        $signup_errors['confirm_password'] = 'Please confirm your password';
    } elseif ($password !== $confirm) {
        $signup_errors['confirm_password'] = 'Passwords do not match';
    }

    // If validation errors exist
    if (!empty($signup_errors)) {
        $_SESSION['signup_errors'] = $signup_errors;
        header("Location: index.php");
        exit;
    }

    // Check if email exists
    $check = mysqli_prepare($conn, "SELECT id FROM users WHERE email = ?");
    mysqli_stmt_bind_param($check, "s", $email);
    mysqli_stmt_execute($check);
    mysqli_stmt_store_result($check);

    if (mysqli_stmt_num_rows($check) > 0) {
        $_SESSION['signup_errors']['email'] = 'Email already exists';
        header("Location: index.php");
        exit;
    }

    // Insert user
    $hash = password_hash($password, PASSWORD_DEFAULT);

    $stmt = mysqli_prepare(
        $conn,
        "INSERT INTO users (email, password, created_at) VALUES (?, ?, NOW())"
    );
    mysqli_stmt_bind_param($stmt, "ss", $email, $hash);
    mysqli_stmt_execute($stmt);

    $_SESSION['signup_success'] = 'Registration successful. Please log in.';
    header("Location: index.php");
    exit;
}

/* =========================
   LOGIN
========================= */
if (isset($_POST['form_action']) && $_POST['form_action'] === 'login') {

    $email    = trim($_POST['login_email'] ?? '');
    $password = trim($_POST['login_password'] ?? '');

    $log_errors = [];

    // Validation
    if ($email === '') {
        $log_errors['email'] = 'Email is required';
    }

    if ($password === '') {
        $log_errors['password'] = 'Password is required';
    }

    if (!empty($log_errors)) {
        $_SESSION['log_errors'] = $log_errors;
        header("Location: index.php");
        exit;
    }

    // Check user
    $stmt = mysqli_prepare(
        $conn,
        "SELECT id, email, password FROM users WHERE email = ?"
    );
    mysqli_stmt_bind_param($stmt, "s", $email);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);

    if ($user = mysqli_fetch_assoc($result)) {
        if (password_verify($password, $user['password'])) {
            $_SESSION['id']       = $user['id'];
            $_SESSION['email']    = $user['email'];
            $_SESSION['username'] = $user['email'];

            header("Location: index.php");
            exit;
        }
    }

    // Invalid login
    $_SESSION['log_errors']['password'] = 'Invalid email or password';
    header("Location: index.php");
    exit;
}
