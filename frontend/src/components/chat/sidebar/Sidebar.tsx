import {
  Spacer,
  Separator,
  Stack,
  AvatarGroup,
  Avatar,
  Button,
  Text,
  Heading,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import SidebarTopButtons from "./SidebarTopButtons";
import { useAuth } from "@providers/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { getUserChats } from "@api/user";
import SidebarChatContainer from "./SidebarChatContainer";
import { useLocation } from "react-router";

type Chat = {
  chat_id: string;
  model: string;
  title: string;
};

const Sidebar = () => {
  const { user, logout, token } = useAuth()!;
  const location = useLocation();

  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    if (user) {
      setUsername(user.username);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [location.pathname]);

  const { data: chats, refetch } = useQuery<Chat[]>({
    queryKey: ["chats"],
    queryFn: async () => {
      const chats = (await getUserChats(token!)).chats;
      const mapped_infos = chats.map((chat: any) => {
        return {
          chat_id: chat.chat.user_chat_id,
          model: chat.chat.model,
          title: chat.title,
        };
      });
      return mapped_infos.reverse() ?? [];
    },
    retry: false,
  });

  return (
    <aside className={"sidebar"}>
      <SidebarTopButtons />

      <Heading mt={10} alignSelf={"center"}>
        Older chats
      </Heading>

      <Stack
        flexDir={"column"}
        h={"100%"}
        minW={"100%"}
        alignItems={"center"}
        mt={5}
        overflowY={"auto"}
        gap={1}
      >
        {chats
          ? chats.map((chat, index) => {
              return (
                <SidebarChatContainer
                  key={index}
                  chat_id={chat.chat_id}
                  model={chat.model}
                  title={chat.title}
                  mutate={refetch}
                />
              );
            })
          : []}
      </Stack>

      <Spacer />

      <Separator borderColor={"var(--primary)"} />
      <Stack
        direction={"row"}
        justifyContent={"center"}
        alignItems={"center"}
        gap={3}
        p={2}
        pl={5}
        pr={5}
      >
        <AvatarGroup>
          <Avatar.Root bg={"inherit"} borderColor={"gray.300"}>
            <Avatar.Fallback color={"gray.300"} />
          </Avatar.Root>
        </AvatarGroup>
        <Text truncate fontSize={"sm"} fontWeight={"semibold"}>
          {username}
        </Text>
        <Spacer />
        <Button bg={"var(--primary)"} size={"xs"} onClick={logout}>
          Log out
        </Button>
      </Stack>
    </aside>
  );
};

export default Sidebar;
