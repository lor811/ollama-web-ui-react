import { Flex, Stack, Icon, Text, Spinner } from "@chakra-ui/react";
import { SiOllama } from "react-icons/si";
import { type Message } from "@providers/ChatProvider";
import MarkdownRenderer from "./MarkdownRenderer";

type MessageBubbleProps = {
    message: Message;
}

const MessageBubble = ({ message }: MessageBubbleProps) => {
    const isUserMessage = message.role == 'user';
    const isLoadingBubble = message.role == 'assistant' && message.content == "";
    const isError = message.role == 'system';

    return (
        <Flex alignSelf={ isUserMessage ? "flex-end" : "flex-start"}
        maxW={"70%"}
        maxH={"fit-content"}
        borderWidth={1} rounded={"2xl"}
        borderColor={ !isError ? "var(--primary)" : "red.500"} 
        p={2} mr={4} ml={4}
        bg={"var(--background-contrast-dark)"}
        >
            <Stack direction={"column"} gap={1} p={0} m={0} maxWidth={"100%"}>
                <Stack direction={"row"} alignItems={"center"} justifyContent={"center"} gap={3}>
                    { !isUserMessage && 
                        <Flex h={"100%"} flexDir={"row"} justifyContent={"center"}>
                        <Icon bg={"whitesmoke"} rounded={"xl"} size={"lg"}>
                            <SiOllama color={"black"} />
                        </Icon>
                        </Flex>
                    }

                    <Stack direction={"column"} className={"markdown-container"}>
                        { isLoadingBubble ? 
                            <Spinner size={"md"} />
                        :
                            <MarkdownRenderer>
                                { message.content }
                            </MarkdownRenderer>
                        }
                    </Stack>
                    
                    <Text alignSelf={"flex-end"} fontSize={"xx-small"} minW={"fit-content"} fontWeight={"light"} p={0} m={0}>
                        { message.sent_time }
                    </Text>
                </Stack>
            </Stack>
        </Flex>
    )
}

export default MessageBubble