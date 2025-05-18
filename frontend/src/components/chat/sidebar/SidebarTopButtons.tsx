import { useChat } from "@providers/ChatProvider";
import { IconButton, Stack } from "@chakra-ui/react";
import { RiChatNewFill } from "react-icons/ri";
import { useNavigate } from "react-router";
import { SiOllama } from "react-icons/si";

const SidebarTopButtons = () => {
  let navigate = useNavigate();
  const { isStreaming } = useChat();

  return (
    <Stack
      flexDir={"row-reverse"}
      justifyContent={"center"}
      w={"100%"}
      gap={1}
      p={2}
    >
      <SidebarButton
        onClick={() => navigate("/chat")}
        icon={<RiChatNewFill />}
        disabled={isStreaming}
      />
      <SidebarButton
        onClick={() => window.open("https://ollama.com/search", "_blank")}
        icon={<SiOllama />}
        disabled={false}
      />
    </Stack>
  );
};

export default SidebarTopButtons;

type SidebarButtonProps = {
  disabled: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  background?: string;
  color?: string;
  hoverBackground?: string;
};

const SidebarButton = ({
  disabled,
  onClick,
  icon,
  background,
  color,
  hoverBackground,
}: SidebarButtonProps) => {
  if (!background) background = "inherit";
  if (!color) color = "white";
  if (!hoverBackground) hoverBackground = "var(--background-contrast)";
  return (
    <IconButton
      background={background}
      color={color}
      _hover={{
        background: hoverBackground,
        cursor: "pointer",
      }}
      disabled={disabled}
      onClick={onClick}
    >
      {icon}
    </IconButton>
  );
};
