import { Alert, Button, Stack } from "@chakra-ui/react";
import FallbackLayout from "./FallbackLayout";
import { type FallbackProps } from "react-error-boundary";
import { useAuth } from "@providers/AuthProvider";

const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  const { logout } = useAuth();

  const handleLogout = async () => {
    logout();
    resetErrorBoundary();
  };

  return (
    <FallbackLayout>
      <Alert.Root
        status={"error"}
        size={"lg"}
        borderStartWidth={"3px"}
        borderStartColor={"colorPalette.600"}
      >
        <Alert.Indicator />
        <Alert.Content>
          <Alert.Title>An error has occurred</Alert.Title>
          <Alert.Description>
            <p>{error.message}</p>
            <p>Is ollama running?</p>
          </Alert.Description>
          <Stack flexDir={"row"} gap={1}>
            <Button
              size={"sm"}
              w={"fit-content"}
              m={5}
              onClick={() => resetErrorBoundary()}
            >
              Retry
            </Button>
            <Button size={"sm"} w={"fit-content"} m={5} onClick={handleLogout}>
              Logout
            </Button>
          </Stack>
        </Alert.Content>
      </Alert.Root>
    </FallbackLayout>
  );
};

export default ErrorFallback;
