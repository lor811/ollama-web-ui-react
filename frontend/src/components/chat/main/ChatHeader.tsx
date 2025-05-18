import { Heading, Spacer } from "@chakra-ui/react";
import ModelSelectionPopover from "../model-selection/ModelSelectionPopover";

const ChatHeader = () => {
  return (
    <>
      <ModelSelectionPopover />
      <Spacer />
      <Heading fontWeight={"semibold"}>ollama-web-ui</Heading>
    </>
  );
};

export default ChatHeader;
