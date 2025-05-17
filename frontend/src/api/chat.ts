import type { Message } from "@providers/ChatProvider";

export const createChat = async (selected_model: string, token: string) => {
    const response = await fetch(`/api/data/chat/create`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ selected_model: selected_model })
    });

    if (response.ok) {
        return response.json();
    } else {
        throw new Error((await response.json()).detail);
    }
};

export const deleteChat = async (chat_id: string, token: string) => {
    const response = await fetch(`/api/data/chat/${chat_id}/delete`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
    });

    return response.ok;
}

export const getChatMessages = async (chat_id: string, token: string) => {
    const response = await fetch(`/api/data/chat/${chat_id}/messages`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        },
    });

    if (response.ok) {
        return response.json();
    } else {
        throw new Error((await response.json()).detail);
    }
};

export const createMessage = (role?: string, content?: string) => {
    return {
        role: role,
        content: content,
        sent_date: (new Date().toLocaleDateString("en-GB")),
        sent_time: (new Date().toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        }))
    } as Message;
};


