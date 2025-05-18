import { type AuthCredentials } from "@providers/AuthProvider";

export const authLogin = async (credentials: AuthCredentials) => {
    const formData = new URLSearchParams();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);

    const response = await fetch("/api/auth/login", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
    });

    if (!response.ok) {
        throw new Error(`Unauthorized: ${(await response.json()).detail}`);
    }

    const data = await response.json();

    return {
        access_token: data.token.access_token,
        user: {
            user_id: data.user.user_id,
            username: data.user.username
        }
    };
}

export const authRegister = async (credentials: AuthCredentials) => {
    const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: credentials.username, password: credentials.password }),
    });

    if (!response.ok) {
        throw new Error((await response.json()).detail);
    }

    return response.json();
}