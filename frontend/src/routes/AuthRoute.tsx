import { Flex, Heading, Spacer, Text } from '@chakra-ui/react'
import { useState } from 'react';
import { Outlet } from 'react-router';
import './Auth.css'

const AuthLayout = () => {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const clearInput = () => {
        setUsername("");
        setPassword("");
    }

    return (
        <div className={"auth-div"}>
            <Spacer />
            <Flex h={"fit-content"} w={"400px"}
            flexDir={"column"}
            alignItems={"center"}
            p={4} m={0} gap={6}
            bg={"var(--background-contrast-dark)"} 
            borderWidth={1} borderColor={"var(--secondary)"} rounded={"2xl"}>
                <Heading fontSize={"3xl"} fontWeight={"semibold"}>
                    ollama-web-ui
                </Heading>

                <Outlet context={
                    { 
                        username: username, password: password,
                        setUsername: setUsername, setPassword: setPassword,
                        clearInput: clearInput
                    }
                } />
            </Flex>
            <Spacer />
            <Text alignSelf={"flex-end"} fontWeight={"lighter"} p={4}>By Lorenzo A.</Text>
        </div>
    )
}

export default AuthLayout