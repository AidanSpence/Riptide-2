'use client';

// Register a new user, takes the username, password, and a confirmation password
// to ensure the password is correct.
export async function register(
    username: string,
    email: string,
    password: string,
    password_confirm: string
) {
const response = await fetch("/api/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password, password_confirm }),
    });

    if (!response.ok) {
        throw new Error("Login failed");
    }
    else { return response.json(); }
}

export async function login(
    username: string,
    password: string
) {
const response = await fetch("/api/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
        throw new Error("Login failed");
    }
    else{ return response.json(); }
}

export async function logout(
) {
const response =
    await fetch("/api/logout", {
        method: "POST",
    });

    if (!response.ok) {
        throw new Error("Logout failed");
    }
    else{ return "Logout successful"; }
}





// make sure that Set-Cookie is set or django aint gonna authenticate anything
// https://docs.djangoproject.com/en/6.1/ref/settings/#sessions
// https://docs.djangoproject.com/en/6.1/topics/auth/default/#how-to-log-a-user-in

// also may have some issues with cross-domain stuff or authentication stuff like riptide 1

