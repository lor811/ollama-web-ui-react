
export const fetchModels = async (access_token: string) => {
    const response = await fetch("/api/ollama/models", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${access_token}`,
            "Content-Type": "application/json"
        },
    });

    if (response.status == 503 || !response.ok) {
        throw new Error((await response.json()).detail);
    }

    return await response.json();
}

export const getStreamingResponse = async (
    selected_model: string, 
    user_message: string, 
    chat_id: string | undefined, 
    token: string
) => {
    const response = await fetch(`/api/ollama/chat/${chat_id}`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            selected_model: selected_model,
            user_message: user_message
        }),
    });
    return response;
}

export const processStream = async (
    streamingResponse: Response, 
    updateStreamingMessage: (chunk: string) => void,
) => {

    if (!streamingResponse.body) {
        throw new Error('Not supported: streaming response was expected to have a body.');
    }

    const reader = streamingResponse.body.getReader();
    const decoder = new TextDecoder();
    
    let generated_message = "";
    while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
            return;
        }
        
        const chunk = decoder.decode(value, { stream: true });
        generated_message += chunk;
        updateStreamingMessage(generated_message);
    }
};
