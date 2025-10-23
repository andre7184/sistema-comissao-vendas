import { useForm } from 'react-hook-form';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

interface LoginForm {
    email: string;
    senha: string;
}

export default function Login() {
    const { register, handleSubmit } = useForm<LoginForm>();
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const onSubmit = async (data: LoginForm) => {
        try {
            const res = await api.post('/api/auth/login', data);
            
            // 1. Log para confirmar que a requisição teve sucesso (código 200)
            console.log("SUCESSO: Resposta completa da API:", res);
            
            // 2. Tentar usar os dados
            const token = res.data.token;
            const permissoes = res.data.permissoesModulos;

            if (token && permissoes) {
                login(token, permissoes); 
                navigate('/dashboard');
            } else {
                // Este caso só acontece se o backend enviar 200, mas os campos estiverem faltando
                console.error("ERRO DE DADOS: Token ou Permissões ausentes na resposta 200.", res.data);
                alert('Erro inesperado na resposta da API.');
            }

        } catch (err: any) {
            // 3. Log para capturar a falha da requisição (código 4xx, 5xx ou erro de rede)
            console.error('FALHA DE REQUISIÇÃO:', err);

            // Mensagem mais informativa
            if (err.response) {
                // Se for um erro do servidor (ex: 401 Unauthorized)
                alert(`Erro ${err.response.status}: Credenciais inválidas ou Proibido.`);
            } else if (err.request) {
                // Se for erro de rede (URL base errada ou CORS)
                alert('Erro de Rede: Verifique a URL do seu backend ou se o CORS está ativo.');
            } else {
                alert('Erro ao configurar a requisição.');
            }
        }
    };
    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded shadow-md w-80">
            <h2 className="text-xl mb-4">Login</h2>
            <input {...register('email')} placeholder="Email" className="input mb-2 w-full border p-2" />
            <input {...register('senha')} type="password" placeholder="Senha" className="input mb-4 w-full border p-2" />
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded w-full">Entrar</button>
        </form>
        </div>
    );
}
