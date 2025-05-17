import { Icon, Input, Stack } from '@chakra-ui/react'
import { FaRegUserCircle } from "react-icons/fa";
import { TbLockPassword } from "react-icons/tb";

type AuthFormProps = {
    username: string;
    setUsername: (username: string) => void;
    password: string;
    setPassword: (username: string) => void;
}

const AuthForm = ({ username, setUsername, password, setPassword }: AuthFormProps) => {
    return (
        <>
            <Stack direction={"row"} w={"80%"} alignItems={"center"} gap={5}>
                <Icon>
                    <FaRegUserCircle />
                </Icon>
                <Input type={"text"} value={ username } placeholder={"Username"}
                size={"sm"} borderColor={"var(--background-contrast)"} outlineColor={"var(--primary)"}
                onChange={(e) => setUsername(e.target.value)}/>
            </Stack>

            <Stack direction={"row"} w={"80%"} alignItems={"center"} gap={5}>
                <Icon>
                <TbLockPassword />
                </Icon>
                <Input type={"password"} value={ password } placeholder={"Password"} 
                size={"sm"} borderColor={"var(--background-contrast)"}  outlineColor={"var(--primary)"}
                onChange={(e) => setPassword(e.target.value)}/>
            </Stack>
        </>
    )
}

export default AuthForm