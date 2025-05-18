export const getUser = async (access_token: string) => {
    const response = await fetch("/api/auth/me", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${access_token}`
        },
    });

    if (!response.ok) {
        throw new Error(`Unauthorized: ${(await response.json()).detail}`);
    }

    const data = await response.json();

    return {
        user: {
            user_id: data.user_id,
            username: data.username
        }
    };
}

export const getUserCurrentChat = async (chat_id: string, token: string) => {
    const response = await fetch(`/api/data/chat/${chat_id}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
    });

    if (response.ok) {
        return response.json();
    } else {
        throw new Error((await response.json()).detail);
    }
};

export const getUserChats = async (token: string) => {
    const response = await fetch(`/api/data/chats`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
    });
    if (response.ok) {
        return response.json();
    } else {
        throw new Error((await response.json()).detail);
    }
};