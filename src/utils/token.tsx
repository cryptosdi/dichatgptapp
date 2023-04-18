import React, { createContext, useContext, useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import jwt_decode from 'jwt-decode';

interface AuthContextProps {
    isLogged: boolean;
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextProps>({
    isLogged: false,
    login: () => { },
    logout: () => { },
});

interface AuthProviderProps  {
    children: React.ReactNode;
};

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children })=> {
    const [cookies, setCookie, removeCookie] = useCookies(['token']);
    const [isLogged, setLoggedIn] = useState(false);

    useEffect(() => {
        if (cookies.token) {
            const decodedToken: any = jwt_decode(cookies.token);
            const currentTime = Date.now() / 1000;

            if (decodedToken.exp < currentTime) {
                // Token 已过期，执行退出登录操作
                logout();
            } else {
                // Token 未过期，将 loggedIn 状态设置为 true
                setLoggedIn(true);
            }
        }
    }, [cookies.token]);

    const login = (token: string) => {
        // 将 Token 存储到 cookie 中
        setCookie('token', token, { path: '/' });
        // 将 loggedIn 状态设置为 true
        setLoggedIn(true);
    };

    const logout = () => {
        // 从 cookie 中删除 Token
        removeCookie('token');
        // 将 loggedIn 状态设置为 false
        setLoggedIn(false);
    };

    return (
        <AuthContext.Provider value={{ isLogged, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};