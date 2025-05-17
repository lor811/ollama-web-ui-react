import { authLogin, authRegister } from "@api/auth";
import { getUser } from "@api/user"
import { useQuery } from "@tanstack/react-query";
import { createContext, type ReactNode, useContext, useState } from "react"
import { useLocation, useNavigate } from "react-router";

type AuthContextType = {
    user: User | null;
    token: string | null;
    login: (credentials: AuthCredentials) => Promise<void>;
    logout: () => void;
    register: (credentials: AuthCredentials) => Promise<void>;
    isCheckingToken: boolean;
};

type User = {
    user_id: string;
    username: string;
};

export type AuthCredentials = {
    username: string;
    password: string;
};

const AuthContext = createContext<AuthContextType>({
    user: null,
    token: null,
    login: async () => {},
    logout: () => {},
    register: async () => {},
    isCheckingToken: true,
});

type AuthProviderProps = {
    children: ReactNode;
};

const AuthProvider = ({ children }: AuthProviderProps) => {
    const location = useLocation();
    const navigate = useNavigate();

    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem("access_token"));
    
    const isInLogin = location.pathname === "/login";
    const isInRegister = location.pathname === "/register";
    
    const {isLoading: isCheckingToken } = useQuery({
        queryKey: ['auth-check'], 
        queryFn: async () => {
            if (token == null) {
                logout();
                return null;
            }

            try {
                const data = await getUser(token);
                setUser(data.user);
                return data;
            } catch (error) {
                logout();
                throw error;
            }
        },
        enabled: !isInLogin && !isInRegister,
        refetchInterval: 10 * 60 * 1000,
        refetchIntervalInBackground: true,
        retry: false,
    });

    const login = async (credentials: AuthCredentials) => {
        const data = await authLogin(credentials);

        const access_token: string = data.access_token;
        const user: User = data.user;
        const user_string: string = JSON.stringify(user);

        localStorage.setItem("access_token", access_token);
        localStorage.setItem("user", user_string);
        setToken(access_token);
        setUser(user);
        navigate("/chat");
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
        navigate("/login");
    };

    const register = async (credentials: AuthCredentials) => {
        return await authRegister(credentials);
    }

    return (
        <AuthContext.Provider value={ { user, token, login, logout, register, isCheckingToken } }>
            { children }
        </AuthContext.Provider>
    );
}

export default AuthProvider

export const useAuth = () => useContext(AuthContext);