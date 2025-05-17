import { type Message } from "@providers/ChatProvider";
import { Button, Flex, Heading, Icon, Stack, Text } from "@chakra-ui/react";
import { FaReact } from "react-icons/fa";
import { SiTypescript } from "react-icons/si";
import { useLocation, useOutletContext } from "react-router";
import { useEffect } from "react";

type NewChatProps = {
  selectedModel: string;
  setInput: (input: string) => void;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setSelectionIsBlocked: React.Dispatch<React.SetStateAction<boolean>>;
}

const NewChat = () => {
  let location = useLocation();
  const { selectedModel, setInput, setMessages, setSelectionIsBlocked } = useOutletContext<NewChatProps>();

  useEffect(() => {
    setSelectionIsBlocked(false);
    setMessages([]);
  }, [location]);

  const suggestionButtons = [
    {
        text: "Learn React",
        onClick: () => setInput("Can you provide a step-by-step guide for learning React from scratch, including recommended resources and projects to practice?"),
        icon: <FaReact />,
        iconColor: "#61DAFB"
    },
    {
        text: "Why TypeScript?",
        onClick: () => setInput("What are the main advantages of using TypeScript over JavaScript, and how does it improve the development process?"),
        icon: <SiTypescript />,
        iconColor: "#3178C6"
    }
  ];

  return (
    <Flex w={"100%"} h={"100%"} flexDir={"column"} justifyContent={"center"} alignItems={"center"} gap={6}>
      <Heading as={"h1"} size={"3xl"}>
        { selectedModel &&
          `What’s on your mind? — Ask ${selectedModel}` 
        }
      </Heading>
      <Stack flexDir={"row"} gap={4}>
        { suggestionButtons.map((button, index) => {
          return (
            <SuggestionButton key={index} text={ button.text } onClick={ button.onClick } 
            icon={ button.icon } iconColor={ button.iconColor } />
          )
        })
        }
      </Stack>
    </Flex>
  )
}

export default NewChat

type SuggestionButtonProps = {
  text: string;
  onClick: () => void;
  icon: React.ReactNode;
  iconColor: string;
}

const SuggestionButton = ({ text, onClick, icon, iconColor }: SuggestionButtonProps) => {
  return (
    <Button type={"button"} onClick={ onClick } direction={"row"} 
    bg={"inherit"} borderWidth={1} rounded={"2xl"} borderColor={"var(--background-contrast)"}>
      <Stack flexDir={"row"} gap={2}>
        {icon && <Icon color={ iconColor }>{icon}</Icon>}
        <Text>
          { text }
        </Text>
      </Stack>
    </Button>
  )
}