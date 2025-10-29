// src/pages/Login.tsx

import { useForm } from 'react-hook-form';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
// NOVO: Importa jwt-decode e as constantes
import { jwtDecode } from 'jwt-decode';
import { ROLES } from '../config/constants'; // Ajuste o path se necessário

// Interface para os dados do formulário
interface LoginForm {
    email: string;
    senha: string;
}

// NOVO: Interface para o payload decodificado do JWT (igual à do AuthContext)
interface DecodedToken {
  sub: string; // Subject (geralmente email ou ID do usuário)
  role: string; // O papel do usuário (ex: 'ROLE_ADMIN')
  exp: number; // Timestamp de expiração
  iat?: number; // Timestamp de emissão (opcional)
  // Adicione outros campos se o seu token tiver (ex: idEmpresa)
}


export default function Login() {
    const { register, handleSubmit } = useForm<LoginForm>();
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const onSubmit = async (data: LoginForm) => {
        try {
            // 1. Faz a requisição de login
            const res = await api.post('/api/auth/login', data);
            
            console.log("SUCESSO: Resposta completa da API:", res);
            
            // 2. Extrai token e permissões
            const token = res.data.token;
            const permissoes = res.data.permissoesModulos; // Confirme se o nome da chave é este

            if (token && permissoes) {
                // 3. Decodifica o token para obter o Role IMEDIATAMENTE
                let userRole: string | null = null;
                try {
                    const decoded = jwtDecode<DecodedToken>(token);
                    userRole = decoded.role; // Extrai o role do payload
                    
                    // Verificação de expiração (opcional mas recomendada aqui também)
                    const currentTime = Date.now() / 1000;
                    if (decoded.exp < currentTime) {
                        throw new Error("Token recebido já está expirado.");
                    }

                } catch (decodeError) {
                    console.error("ERRO DE DECODIFICAÇÃO:", decodeError);
                    alert('Erro ao processar o token de autenticação. Tente novamente.');
                    return; // Interrompe o processo
                }

                // 4. Armazena no AuthContext
                login(token, permissoes); 

                // 5. Decide para onde navegar baseado no Role
                if (userRole === ROLES.ADMIN) {
                    console.log("Login como ADMIN, redirecionando para /empresa/home...");
                    navigate('/empresa/home', { replace: true }); // Redireciona Admin para a home da empresa
                } else {
                    console.log(`Login como ${userRole}, redirecionando para /dashboard...`);
                    navigate('/dashboard', { replace: true }); // Outros roles vão para o dashboard genérico
                }

            } else {
                console.error("ERRO DE DADOS: Token ou Permissões ausentes na resposta.", res.data);
                alert('Resposta da API inválida após login.');
            }

        } catch (err: any) {
            console.error('FALHA DE REQUISIÇÃO:', err);
            if (err.response) {
                alert(`Erro ${err.response.status}: Credenciais inválidas ou acesso negado.`);
            } else if (err.request) {
                alert('Erro de Rede: Não foi possível conectar ao servidor.');
            } else {
                alert('Erro ao tentar fazer login.');
            }
        }
    };

    // JSX do formulário (inalterado)
    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded shadow-md w-full max-w-sm">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">Login</h2>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                        Email
                    </label>
                    <input 
                        id="email"
                        {...register('email', { required: 'Email é obrigatório' })} 
                        placeholder="seuemail@exemplo.com" 
                        className="input shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                    />
                </div>
                <div className="mb-6">
                     <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="senha">
                        Senha
                    </label>
                    <input 
                        id="senha"
                        {...register('senha', { required: 'Senha é obrigatória' })} 
                        type="password" 
                        placeholder="********" 
                        className="input shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" 
                    />
                </div>
                <div className="flex items-center justify-between">
                    <button 
                        type="submit" 
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                    >
                        Entrar
                    </button>
                </div>
            </form>
        </div>
    );
}