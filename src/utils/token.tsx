import React, { createContext, useContext, useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import jwt_decode from 'jwt-decode';

interface User {
    userId: string;
    isLogged: boolean;
}

interface AuthContextProps {
    user: User | null;
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextProps>({
    user: null,
    login: () => { },
    logout: () => { },
});

interface AuthProviderProps {
    children: React.ReactNode;
};

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [cookies, setCookie, removeCookie] = useCookies(['token']);
    const [user, setUser] = useState<User | null>(null);

    // useEffect(() => {
    //     if (cookies.token) {
    //         const decodedToken: any = jwt_decode(cookies.token);
    //         const currentTime = Date.now() / 1000;
    //         const userId= decodedToken.sub;
    //         if (decodedToken.exp < currentTime) {
    //             // Token 已过期，执行退出登录操作
    //             logout();
    //         } else {
    //             // Token 未过期，将 loggedIn 状态设置为 true
    //             setUser({ userId: userId, isLogged: true });
    //         }
    //     }
    // }, [cookies.token]);

    useEffect(() => {
        const interval = setInterval(() => {
          if (cookies.token) {
            const decodedToken: any = jwt_decode(cookies.token); 
            if (decodedToken.exp < Date.now() / 1000) {
              logout();
            }
          }
        }, 3600000);
    
        return () => {
          clearInterval(interval);
        };
      }, [cookies.token]);
    

    const login = (token: string) => {
        setCookie('token', token, { path: '/' });
        const decodedToken: any = jwt_decode(token);
        const userId= decodedToken.sub;
        setUser({ userId: userId, isLogged: true });
    };

    const logout = () => {
        removeCookie('token'); 
        if (cookies.token){
            const decodedToken: any = jwt_decode(cookies.token);
            const userId= decodedToken.sub;
            setUser({ userId: userId, isLogged: false });
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};