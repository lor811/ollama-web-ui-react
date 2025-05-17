import { Alert, type ConditionalValue, Stack, Theme } from "@chakra-ui/react"

type AuthAlertProps = {
    status: ConditionalValue<"info" | "warning" | "success" | "error" | "neutral" | undefined>;
    message: string;
}

const AuthAlert = ({ status, message }: AuthAlertProps) => {
  return (
    <Theme appearance="dark" bg={"inherit"}>
        <Stack>
            <Alert.Root status={ status }>
                <Alert.Indicator />
                <Alert.Title>{ message }</Alert.Title>
            </Alert.Root>
        </Stack>
    </Theme>
    
  )
}

export default AuthAlert