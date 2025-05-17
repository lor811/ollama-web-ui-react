import { Text } from "@chakra-ui/react"
import AuthButtons from "@components/auth/AuthButtons"
import AuthErrorAlert from "@components/auth/AuthErrorAlert"
import AuthForm from "@components/auth/AuthForm"
import { useNavigate, useOutletContext } from "react-router";
import { useAuth } from "@providers/AuthProvider";
import { useState } from "react";

type RegisterProps = {
  username: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  clearInput: () => void;
}


const Register = () => {
  const { username, setUsername, password, setPassword, clearInput } = useOutletContext<RegisterProps>();
  const authContext = useAuth();
  const navigate = useNavigate();
  
  const [isError, setIsError] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  
  const handleRegister = async () => {
    setIsError(false);
    setErrorMessage("");
    setIsSuccess(false);

    try {
        await authContext.register({ username: username, password: password });
        setIsSuccess(true);
    } catch (error) {
        setIsError(true);
        if (error instanceof Error) {
            setErrorMessage(error.message);
        } else {
            setErrorMessage('Unexpected error occurred');
        }
    }
    clearInput();
  }
  
  return (
    <>
      <Text fontSize={"sm"} fontWeight={"light"}>
        Create an account:
      </Text>

      <AuthForm  username={ username } setUsername={ setUsername } 
      password={ password } setPassword={ setPassword } />

      { isError && 
        <AuthErrorAlert status={"error"} message={ errorMessage }  />
      }

      { isSuccess && 
        <AuthErrorAlert status={"success"} message={"Account created successfully"} />
      }

      <AuthButtons firstButtonText={"Sign up"} secondButtonText={"Sign in"}
      firstButtonOnClick={ () => handleRegister() } secondButtonOnClick={ () => navigate("/login") }/>

    </>
  )
}

export default Register