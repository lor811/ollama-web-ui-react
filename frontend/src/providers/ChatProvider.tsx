import { createContext, type ReactNode, useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useAuth } from './AuthProvider';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createChat, createMessage, getChatMessages } from '@api/chat';
import { getStreamingResponse, processStream } from '@api/ollama';

export type Model = {
    model: string;
    parameter_size: string;
};

export type Message = {
    role: string;
    content: string;
    sent_date: string;
    sent_time: string;
}

interface ChatContextType {
    selectedModel: Model;
    setSelectedModel: React.Dispatch<React.SetStateAction<Model>>;
    selectionIsBlocked: boolean;
    setSelectionIsBlocked: React.Dispatch<React.SetStateAction<boolean>>;
    chatId: string | undefined;
    setChatId: React.Dispatch<React.SetStateAction<string | undefined>>;
    input: string;
    setInput: React.Dispatch<React.SetStateAction<string>>;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => void; 
    messages: Message[];
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
    handleSubmit: () => void;
    isLoadingPreviousMessages: boolean;
    isStreaming: boolean;
};

const ChatContext = createContext<ChatContextType>({
    selectedModel: { 'model': '', parameter_size: ''},
    setSelectedModel: () => {},
    selectionIsBlocked: false,
    setSelectionIsBlocked: () => {},
    chatId: undefined,
    setChatId: () => {},
    input: '',
    setInput: () => {},
    handleInputChange: () => {}, 
    messages: [],
    setMessages: () => {},
    handleSubmit: async () => {},
    isLoadingPreviousMessages: false,
    isStreaming: false,
});

type ChatProviderType = {
    children: ReactNode;
};

const ChatProvider = ({ children }: ChatProviderType) => {
    let navigate = useNavigate();
    let chat_id = useParams().chat_id;
    let { token } = useAuth(); 
    let queryClient = useQueryClient();

    const [selectedModel, setSelectedModel] = useState<Model>({ model: "", parameter_size: "" });
    const [selectionIsBlocked, setSelectionIsBlocked] = useState<boolean>(false);
    const [chatId, setChatId] = useState<string | undefined>(chat_id);
    const [input, setInput] = useState<string>("");
    const [messages, setMessages] = useState<Message[]>([]);

    useEffect(() => {
        setChatId(chat_id);
    }, [chat_id]);

    const { mutate: handleSubmit, isPending: isStreaming } = useMutation({
        mutationFn: async () => {
            if (input.trim() === "") return;

            const userMessage = input;
            setInput("");
            
            let new_chat_id = undefined;
            if (!chat_id) {
                const new_chat = (await createChat(selectedModel.model, token!));
                new_chat_id = new_chat.user_chat_id;
                setChatId(new_chat_id);
                navigate(`/chat/${new_chat_id}`);
            }

            setMessages(prev => [
                ...prev,
                createMessage('user', userMessage),
                createMessage('assistant', '') 
            ]);
            
            const setLastMessageContent = (content: string) => {
                setMessages(prev => {
                    if (prev.length > 0) {
                        const lastMessage = prev[prev.length - 1];
                        return [
                            ...prev.slice(0, -1),
                            { ...lastMessage, content: content }
                        ];
                    }
                    return prev;
                });
            }
            
            const streamingResponse = await getStreamingResponse(selectedModel.model, userMessage, chatId ?? new_chat_id, token!);
            await processStream(streamingResponse, setLastMessageContent);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['chat', chatId, 'messages'],
                exact: true
            });
        },
        onError: (error: Error) => {
            setMessages(prev => {
                if (prev.length > 0) {
                    const lastMessage = prev[prev.length - 1];
                    return [
                        ...prev.slice(0, -1),
                        { ...lastMessage, role: 'system', content: `Unexpected error: ${error}` }
                    ];
                }
                return prev;
            });
        }
    });

    const { isLoading: isLoadingPreviousMessages } = useQuery({
        queryKey: ['chat', chatId, 'messages'],
        queryFn: async () => {
            const messages: Message[] = await getChatMessages(chatId!, token ?? "");
            setMessages(messages);
            return messages;
        },
        enabled: !!chatId && !isStreaming,
        refetchOnWindowFocus: false,
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
        setInput(e.target.value);
    }

    return (
        <ChatContext.Provider value={
            {
                selectedModel, setSelectedModel, selectionIsBlocked, setSelectionIsBlocked,
                chatId, setChatId, input, setInput, handleInputChange,
                messages, setMessages, handleSubmit,
                isLoadingPreviousMessages, isStreaming
            }
        }>
            {children}
        </ChatContext.Provider>
    );
}

export default ChatProvider

export const useChat = () => useContext(ChatContext);
