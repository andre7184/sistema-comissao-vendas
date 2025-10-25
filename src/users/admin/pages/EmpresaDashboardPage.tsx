// src/users/admin/pages/EmpresaDashboardPage.tsx

import { useEffect, useState } from 'react';
import DashboardLayout from '../../../layouts/DashboardLayout';
import { adminService } from '../services/adminService';
import type { EmpresaDashboardData } from '../types'; // Certifique-se que VendaDestaque e RankingItem estão em types.ts
import { formatarParaMoeda } from '../../../utils/formatters';
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    Legend, 
    ResponsiveContainer 
} from 'recharts';
import { Link, useNavigate } from 'react-router-dom';


// Componente de Card de Métrica
const MetricCard = ({ title, value, colorClass }: { title: string, value: string | number, colorClass: string }) => (
    <div className="bg-white p-6 rounded-lg shadow-md border-t-4" style={{ borderColor: colorClass.replace('text-', '#') }}>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className={`mt-1 text-3xl font-bold ${colorClass}`}>
            {value}
        </p>
    </div>
);


export default function EmpresaDashboardPage() {
    const [data, setData] = useState<EmpresaDashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const result = await adminService.buscarDashboardEmpresa();
                setData(result);
            } catch (e: any) {
                console.error("Erro ao buscar dashboard:", e);
                setError('Não foi possível carregar os dados do Dashboard. Verifique a conexão com a API.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return <DashboardLayout><p className="p-6">Carregando Dashboard da Empresa...</p></DashboardLayout>;
    }

    if (error) {
        return <DashboardLayout><div className="p-6 bg-red-100 text-red-700 rounded-lg">{error}</div></DashboardLayout>;
    }
    
    // Tratamento de segurança caso a API retorne null inesperadamente
    if (!data) {
        return <DashboardLayout><div className="p-6 bg-yellow-100 text-yellow-700 rounded-lg">Dados do dashboard não disponíveis.</div></DashboardLayout>;
    }
    
    // Agora podemos usar 'data' com segurança
    const dashboardData = data;
    
    // Funções de navegação (para reutilizar a lógica)
    const handleAbrirVendedor = (idVendedor: number) => {
        navigate(`/vendedores/${idVendedor}`); // Corrigido para a rota correta
    };


    return (
        <DashboardLayout>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard Gerencial</h1>
            
            {/* CARDS DE MÉTRICAS GLOBAIS (COM ACESSO SEGURO) */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <MetricCard 
                    title="Total de Vendedores Ativos" 
                    value={dashboardData?.totalVendedores ?? 0} 
                    colorClass="text-blue-600"
                />
                <MetricCard 
                    title="Vendas Registradas (Mês)" 
                    value={dashboardData?.totalVendasMes ?? 0} 
                    colorClass="text-purple-600"
                />
                <MetricCard 
                    title="Valor Vendido (Mês)" 
                    value={formatarParaMoeda(dashboardData?.valorTotalVendidoMes)} 
                    colorClass="text-green-600"
                />
                <MetricCard 
                    title="Média de Comissão (%)" 
                    // CORREÇÃO APLICADA AQUI
                    value={`${(dashboardData?.mediaComissaoEmpresa ?? 0).toFixed(2)}%`} 
                    colorClass="text-yellow-600"
                />
            </div>

            {/* GRÁFICO DE VENDAS MENSAIS E RANKING */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                
                {/* GRÁFICO DE VENDAS MENSAIS */}
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Histórico de Vendas (Últimos Meses)</h2>
                    {/* Verifica se há dados para o gráfico */}
                    {(dashboardData?.historicoVendasMensal && dashboardData.historicoVendasMensal.length > 0) ? (
                        <ResponsiveContainer width="100%" height={350}>
                            <BarChart data={dashboardData.historicoVendasMensal}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="mesAno" />
                                <YAxis 
                                    yAxisId="valor" 
                                    stroke="#10B981" 
                                    tickFormatter={(value) => `R$ ${value.toFixed(0)}`} 
                                />
                                <Tooltip 
                                    formatter={(value: any, name: any) => [formatarParaMoeda(Number(value)), name]} 
                                />
                                <Legend />
                                <Bar yAxisId="valor" dataKey="valorVendido" name="Vendas (R$)" fill="#10B981" />
                                <Bar yAxisId="valor" dataKey="valorComissao" name="Comissões (R$)" fill="#2563EB" />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className='text-gray-500 text-center py-10'>Sem dados históricos de vendas para exibir o gráfico.</p>
                    )}
                </div>

                {/* RANKING DE VENDEDORES (TOP 5) */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Ranking de Vendedores (Valor Vendido)</h2>
                    {/* Verifica se há dados para o ranking */}
                    {(dashboardData?.rankingVendedores && dashboardData.rankingVendedores.length > 0) ? (
                        <>
                            <ul className="divide-y divide-gray-200">
                                {dashboardData.rankingVendedores.slice(0, 5).map((item, index) => (
                                    <li key={item.idVendedor} className="py-3 flex justify-between items-center hover:bg-gray-50 px-2 rounded">
                                        <div className="flex items-center space-x-3">
                                            <span className={`text-lg font-bold w-6 text-center ${index === 0 ? 'text-yellow-500' : 'text-gray-500'}`}>{index + 1}º</span>
                                            <div>
                                                {/* Botão para abrir detalhes */}
                                                <button onClick={() => handleAbrirVendedor(item.idVendedor)} className="text-sm font-medium text-blue-600 hover:underline text-left">
                                                    {item.nomeVendedor}
                                                </button>
                                                <p className="text-xs text-gray-500">{item.qtdVendas} Vendas</p>
                                            </div>
                                        </div>
                                        <span className="font-semibold text-green-600">{formatarParaMoeda(item.valorTotal)}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-4 text-right">
                                <Link to="/vendedores" className="text-blue-600 hover:underline text-sm">Ver Todos os Vendedores &rarr;</Link>
                            </div>
                        </>
                    ) : (
                        <p className='text-gray-500 text-center py-10'>Sem dados de ranking de vendedores.</p>
                    )}
                </div>

            </div>

            {/* MAIORES VENDAS E ÚLTIMAS VENDAS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* MAIORES VENDAS (DESTAQUE) */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Maiores Vendas (Top 5)</h2>
                    {/* Verifica se há dados */}
                    {(dashboardData?.maioresVendas && dashboardData.maioresVendas.length > 0) ? (
                        <ul className="space-y-3">
                            {dashboardData.maioresVendas.map(venda => (
                                <li key={venda.idVenda} className="border-l-4 border-yellow-400 p-3 bg-yellow-50 rounded">
                                    <p className="font-bold text-green-700">{formatarParaMoeda(venda.valorVenda)}</p>
                                    <p className="text-sm text-gray-700">Vendedor: <button onClick={() => handleAbrirVendedor(venda.idVendedor)} className="text-blue-600 hover:underline">{venda.nomeVendedor}</button></p>
                                    <p className="text-xs text-gray-500">Data: {new Date(venda.dataVenda).toLocaleDateString('pt-BR')}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                         <p className='text-gray-500 text-center py-10'>Sem dados das maiores vendas.</p>
                    )}
                </div>

                {/* ÚLTIMAS VENDAS */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Últimas Vendas Registradas</h2>
                     {/* Verifica se há dados */}
                    {(dashboardData?.ultimasVendas && dashboardData.ultimasVendas.length > 0) ? (
                        <ul className="space-y-3">
                            {dashboardData.ultimasVendas.map(venda => (
                                <li key={venda.idVenda} className="border-l-4 border-gray-300 p-3 bg-gray-50 rounded">
                                    <p className="font-bold text-gray-700">{formatarParaMoeda(venda.valorVenda)}</p>
                                    <p className="text-sm text-gray-700">Vendedor: <button onClick={() => handleAbrirVendedor(venda.idVendedor)} className="text-blue-600 hover:underline">{venda.nomeVendedor}</button></p>
                                    <p className="text-xs text-gray-500">Data: {new Date(venda.dataVenda).toLocaleTimeString('pt-BR')}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                         <p className='text-gray-500 text-center py-10'>Sem dados das últimas vendas.</p>
                    )}
                </div>

            </div>
            
        </DashboardLayout>
    );
}