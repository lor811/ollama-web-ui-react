import { Flex, Textarea, Stack, IconButton } from "@chakra-ui/react"
import { FaArrowTurnUp } from "react-icons/fa6"

type ChatFormProps = {
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: () => void;
  isStreaming: boolean;
}

const ChatForm = ({ input, handleInputChange, handleSubmit, isStreaming }: ChatFormProps ) => {
  
  const keyboardHandler = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!e.shiftKey && e.key == "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <>
      <Flex flexDir={"column"} w={"70%"} maxH={"250px"} maxW={"750px"}
      borderWidth={1} borderColor={"var(--primary)"} backgroundColor={"var(--background-contrast-dark)"} rounded={"2xl"} 
      p={2}>
        <Textarea css={{ overflowY: "auto !important" }} autoresize 
        disabled={ isStreaming } placeholder={"Write your message"} outline={0} borderWidth={0}
        value={ input } 
        onKeyDown={ (e) => keyboardHandler(e) }
        onChange={ (e) => handleInputChange(e) }
        />

        <Stack dir={"row"} w={"100%"}>
          <IconButton onClick={ handleSubmit } disabled={ isStreaming } alignSelf={"flex-end"} w={"fit-content"} size={"sm"} bg={"inherit"}>
            <FaArrowTurnUp />
          </IconButton>
        </Stack>
      </Flex>
    </>
  );
}

export default ChatForm