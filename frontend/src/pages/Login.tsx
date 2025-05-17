import { Text } from "@chakra-ui/react"
import AuthButtons from "@components/auth/AuthButtons"
import AuthErrorAlert from "@components/auth/AuthErrorAlert"
import AuthForm from "@components/auth/AuthForm"
import { useNavigate, useOutletContext } from "react-router"
import { useAuth } from "@providers/AuthProvider"
import { useState } from "react"

type LoginProps = {
    username: string;
    setUsername: React.Dispatch<React.SetStateAction<string>>;
    password: string;
    setPassword: React.Dispatch<React.SetStateAction<string>>;
    clearInput: () => void;
}

const Login = () => {
    const { username, setUsername, password, setPassword, clearInput } = useOutletContext<LoginProps>();
    const { login } = useAuth();
    const navigate = useNavigate();

    const [isError, setIsError] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");

    const handleLogin = async () => {
      setIsError(false);
      setErrorMessage("");

      try {
        await login({ username: username, password: password });
      } catch (error) {
          setIsError(true);
          if (error instanceof Error) {
              setErrorMessage("Invalid username or password");
          } else {
              setErrorMessage('Unexpected error occurred');
          }
      }
      clearInput();
    }

    return (
        <>
          <Text fontSize={"sm"} fontWeight={"light"}>
            Sign in to your account
          </Text>
          <AuthForm  username={ username } setUsername={ setUsername } 
          password={ password } setPassword={ setPassword } />
    
          { isError && 
            <AuthErrorAlert status={"error"} message={ errorMessage }  />
          }
    
          <AuthButtons firstButtonText={"Sign in"} secondButtonText={"Sign up"}
          firstButtonOnClick={ () => handleLogin() } secondButtonOnClick={ () => navigate("/register") }/>
          
        </>
      )
}

export default Login