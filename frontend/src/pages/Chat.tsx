import MessageBubble from "@components/chat/messages/MessageBubble";
import { Flex, Spinner } from "@chakra-ui/react"
import { type Message, type Model } from "@providers/ChatProvider";
import {Navigate, useOutletContext } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@providers/AuthProvider";
import { getUserCurrentChat } from "@api/user";
import { useEffect, useRef } from "react";

type ChatProps = {
    chatId: string | undefined;
    messages: Message[];
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>
    setSelectedModel: React.Dispatch<React.SetStateAction<Model>>;
    setSelectionIsBlocked: React.Dispatch<React.SetStateAction<boolean>>;
    isStreaming: boolean;
}

const Chat = () => {
    const { chatId, messages, setSelectedModel, setSelectionIsBlocked, isStreaming } = useOutletContext<ChatProps>();
    const { token } = useAuth();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const { data: chat, isLoading, isError } = useQuery({
        queryKey: ['chatExists'],
        queryFn: () => getUserCurrentChat(chatId!, token!),
        enabled: !!chatId && !!token,
        retry: false
    });

    useEffect(() => {
        if (chat) {
            setSelectedModel({ model: chat.model, parameter_size: ""});
            setSelectionIsBlocked(true);
        }
    }, [chat]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });        
    }, [messages]);


    if (isLoading) {
        return (
            <Flex w={"100%"} h={"100%"}
            justifyContent={"center"} alignItems={"center"}
            >
                <Spinner />
            </Flex>
        )
    }

    if (isError) {
        return <Navigate to='/chat' />;
    }

    return (
        <Flex w={"100%"} h={"100%"}
        flexDir={"column"}
        overflowY={isStreaming ? "hidden" : "auto"}
        p={3} gap={4}>
            {
                messages.map((message, index) => {
                    return <MessageBubble key={ index } message={ message } />;
                })
            }
            <div ref={ messagesEndRef }></div>
        </Flex>
    )
}

export default Chat