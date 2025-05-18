import { Flex, Theme } from "@chakra-ui/react";

type FallbackLayoutProps = {
  children: React.ReactElement | React.ReactElement[];
};

const FallbackLayout = ({ children }: FallbackLayoutProps) => {
  return (
    <Flex
      w={"100%"}
      h={"100%"}
      alignItems={"Center"}
      justifyContent={"center"}
      p={1}
    >
      <Theme appearance={"dark"} bg={"inherit"}>
        {children}
      </Theme>
    </Flex>
  );
};

export default FallbackLayout;
