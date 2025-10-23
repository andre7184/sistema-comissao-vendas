import type { ReactNode } from 'react';
import { createContext, useState, useEffect, useMemo } from 'react';
import { jwtDecode } from 'jwt-decode';

// Interface para o payload do JWT
interface DecodedToken {
  sub: string;
  role: 'ROLE_SUPER_ADMIN' | 'ROLE_ADMIN' | 'ROLE_VENDEDOR' | string;
  exp: number; // Expiration Time (em segundos desde a época Unix)
  iat: number;
}

interface AuthContextType {
  token: string | null;
  role: string | null;
  permissoes: string[] | null;
  login: (token: string, permissoes: string[]) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  token: null,
  role: null,
  permissoes: null,
  login: () => {},
  logout: () => {},
});

// Helper para pegar permissoes do localStorage
const getStoredPermissoes = (): string[] | null => {
  const stored = localStorage.getItem('permissoes');
  return stored ? JSON.parse(stored) : null;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [role, setRole] = useState<string | null>(null);
  const [permissoes, setPermissoes] = useState<string[] | null>(getStoredPermissoes());

  // Garante que a função logout esteja estável para o useEffect
  const logout = useMemo(() => () => {
    localStorage.removeItem('token');
    localStorage.removeItem('permissoes');
    setToken(null);
    setRole(null);
    setPermissoes(null);
  }, []);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        
        // 1. OBTÉM O TEMPO ATUAL (em segundos)
        const currentTime = Date.now() / 1000; 

        // 2. VERIFICA SE O TOKEN EXPIROU
        if (decoded.exp < currentTime) {
            console.warn('Token JWT expirado no frontend. Deslogando usuário.');
            // Força o logout, limpando o token e o localStorage
            logout(); 
            return; // Interrompe a execução
        }
        
        // Se o token não expirou, define o role
        setRole(decoded.role || null);
        
      } catch (e) {
        console.error('Token JWT inválido ou corrompido:', e);
        logout();
      }
    } else {
        // Garante que o role seja limpo se o token não existir
        setRole(null);
    }
    
    // Adicione 'logout' como dependência
  }, [token, logout]); 

  const login = (newToken: string, newPermissoes: string[]) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('permissoes', JSON.stringify(newPermissoes));
    setToken(newToken);
    setPermissoes(newPermissoes);
  };

  // O logout agora é definido via useMemo acima

  const contextValue = useMemo(() => ({
    token,
    role,
    permissoes,
    login,
    logout,
  }), [token, role, permissoes, login, logout]); // Inclua todas as dependências

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};