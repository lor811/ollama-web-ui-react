import { useAuth } from "@providers/AuthProvider";
import { IconButton, Stack, Text } from "@chakra-ui/react";
import { MdDelete } from "react-icons/md";
import { useNavigate, useParams } from "react-router";
import { deleteChat } from "@api/chat";
import { useChat } from "@providers/ChatProvider";
import { useEffect, useState } from "react";

type SidebarChatContainerProps = {
    chat_id: string;
    model: string;
    title: string;
    mutate: () => void;
}

const SidebarChatContainer = ({ chat_id, model, title, mutate }: SidebarChatContainerProps) => {
    const navigate = useNavigate();
    const { isStreaming } = useChat();
    const { token } = useAuth();
    let current_chat_id = useParams().chat_id;

    const [isSelected, setIsSelected] = useState<boolean>(false);

    useEffect(() => {
        if (current_chat_id == chat_id) {
            setIsSelected(true);
        } else {
            setIsSelected(false);
        }
    }, [current_chat_id]);
    
    const goToChat = () => {
        if (!isStreaming) navigate(`/chat/${chat_id}`);
    };

    const deleteChatPermanently = async () => {
        const deleted = await deleteChat(chat_id, token!);
        if (deleted) {
            mutate();
            if (current_chat_id == chat_id) {
                navigate('/chat');
            }
        } else {
            throw new Error("Unknown error: could not delete chat");
        }
    };

    return (
        <Stack direction={"row"} rounded={"2xl"} minW={"95%"} maxW={"95%"}
        bg={ isSelected ? "var(--background-contrast)" : "inherit"}
        _hover={ !isSelected ? {
            background: "var(--background-contrast)",
            cursor: "pointer",
        } : {} }
        justifyContent={"flex-center"} alignItems={"center"} m={0} p={1} gap={1}>
            <Stack direction={"row"} justifyContent={"flex-center"} alignItems={"center"} gap={2} minW={"2/3"} maxW={"2/3"}
            rounded={"2xl"} p={1}
            onClick={ !isSelected ? goToChat : () => {} }
            >
                <Text truncate fontSize={"md"} title={model+' | '+title}>
                    { title }
                </Text>
            </Stack>
            
            <IconButton color={"red.500"} background={"inherit"} onClick={ deleteChatPermanently } ml={"auto"}
            rounded={"4xl"} transition={"none"}
            _hover={{
                background: "red.500",
                color: "whiteAlpha.900",
                cursor: "pointer",
            }}
            disabled={ isStreaming && current_chat_id == chat_id }>
                <MdDelete />    
            </IconButton>
        </Stack>
    )
}

export default SidebarChatContainer