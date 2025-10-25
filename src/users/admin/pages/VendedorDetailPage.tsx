import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../../layouts/DashboardLayout';
import type { VendedorDetalhado, VendedorUpdateRequestDTO } from '../types';
import { adminService } from '../services/adminService';
import { formatarParaMoeda } from '../../../utils/formatters'; 
// IMPORTS DO RECHARTS
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
import VendedorForm from '../components/VendedorForm';
import GenericFormModal from '../../../components/GenericFormModal';


// =====================================================================
// HELPERS
// =====================================================================

/**
 * Formata a data ISO para um formato mais legível (DD/MM/AAAA)
 */
const formatarDataCadastro = (dataISO: string): string => {
    try {
        if (!dataISO) return 'N/A';
        return new Intl.DateTimeFormat('pt-BR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        }).format(new Date(dataISO));
    } catch (e) {
        return 'Data Inválida';
    }
};

/**
 * Componente simples para exibir uma métrica
 */
interface MetricCardProps {
    title: string;
    value: string | number;
    colorClass: string;
}

const MetricCard = ({ title, value, colorClass }: MetricCardProps) => (
    <div className="bg-white p-6 rounded-lg shadow-md border-t-4" style={{ borderColor: colorClass }}>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className={`mt-1 text-3xl font-bold ${colorClass}`}>
            {value}
        </p>
    </div>
);


// =====================================================================
// COMPONENTE PRINCIPAL
// =====================================================================

export default function VendedorDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [vendedor, setVendedor] = useState<VendedorDetalhado | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Estados para o Modal de Edição
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formLoading, setFormLoading] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    // Garante que o array de histórico é inicializado (necessário para o gráfico)
    const historicoRendimentos = vendedor?.historicoRendimentos || [];


    useEffect(() => {
        const idVendedor = parseInt(id || '0', 10);

        if (!id || idVendedor <= 0) {
            setError('ID de Vendedor inválido ou não fornecido.');
            setLoading(false);
            return;
        }

        const fetchVendedorDetalhes = async () => {
            setLoading(true);
            setError(null);
            try {
                // Chama o novo serviço de busca detalhada
                const data = await adminService.buscarDetalhesVendedor(idVendedor);
                setVendedor(data);
            } catch (err) {
                console.error("Erro ao buscar detalhes do vendedor:", err);
                setError('Não foi possível carregar os detalhes do vendedor. Verifique se o endpoint da API está ativo.');
            } finally {
                setLoading(false);
            }
        };

        fetchVendedorDetalhes();
    }, [id]);

    
    // Handler para o formulário de edição (Comissão, Nome e Email)
    const handleUpdate = async (data: any) => { 
        const idVendedor = vendedor?.id;
        if (!idVendedor) return;
        setFormLoading(true);
        setFormError(null);
        try {
            // Reutiliza o serviço de atualização
            await adminService.atualizarComissaoVendedor(idVendedor, data);
            
            // Recarrega os dados e fecha o modal
            fetchVendedorDetalhes(); 
            setIsModalOpen(false);
        } catch (e: any) {
            const errorMsg = e.response?.data?.message || 'Erro ao atualizar dados do vendedor.';
            setFormError(errorMsg);
        } finally {
            setFormLoading(false);
        }
    };


    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex justify-center items-center h-48">
                    <p className="text-lg text-gray-600 font-semibold">Carregando detalhes do vendedor...</p>
                </div>
            </DashboardLayout>
        );
    }

    if (error) {
        return (
            <DashboardLayout>
                <div className="p-6 bg-red-100 text-red-700 rounded-lg border border-red-400">
                    <h1 className="text-2xl font-bold mb-4">Erro</h1>
                    <p>{error}</p>
                    <button 
                        onClick={() => navigate('/vendedores')}
                        className="mt-4 text-blue-600 hover:text-blue-800"
                    >
                        Voltar para a lista de Vendedores
                    </button>
                </div>
            </DashboardLayout>
        );
    }

    if (!vendedor) {
        return (
            <DashboardLayout>
                <div className="p-6 bg-yellow-100 text-yellow-700 rounded-lg">
                    <h1 className="text-2xl font-bold mb-4">Vendedor Não Encontrado</h1>
                    <button 
                        onClick={() => navigate('/vendedores')}
                        className="mt-4 text-blue-600 hover:text-blue-800"
                    >
                        Voltar para a lista de Vendedores
                    </button>
                </div>
            </DashboardLayout>
        );
    }
    
    // Desestrutura os dados do vendedor para uso no JSX
    const { 
        nome, 
        email, 
        percentualComissao, 
        dataCadastro, 
        qtdVendas, 
        valorTotalVendas, 
        mediaComissao,
    } = vendedor;


    return (
        <DashboardLayout>
            {/* HEADER COM DETALHES BÁSICOS */}
            <header className="mb-6 pb-4 border-b flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900">{nome}</h1>
                    <p className="text-lg text-gray-600">{email}</p>
                    <p className="text-sm text-gray-500">Cadastrado em: {formatarDataCadastro(dataCadastro)}</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-indigo-500 text-white px-4 py-2 rounded shadow hover:bg-indigo-600 transition"
                >
                    Editar Vendedor
                </button>
            </header>
            
            {/* CARDS DE MÉTRICAS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <MetricCard 
                    title="Comissão Atual" 
                    value={`${percentualComissao.toFixed(2)}%`} 
                    colorClass="text-indigo-600"
                />
                <MetricCard 
                    title="Vendas Realizadas" 
                    value={qtdVendas} 
                    colorClass="text-blue-600"
                />
                <MetricCard 
                    title="Valor Total Vendido" 
                    value={formatarParaMoeda(valorTotalVendas)} 
                    colorClass="text-green-600"
                />
                <MetricCard 
                    title="Média de Comissão" 
                    value={`${mediaComissao.toFixed(2)}%`} 
                    colorClass="text-purple-600"
                />
            </div>

            {/* GRÁFICOS E RENDIMENTOS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* GRÁFICO DE BARRAS FUNCIONAL (2/3 da largura em telas grandes) */}
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Rendimento Mensal</h2>
                    
                    {historicoRendimentos.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart
                                data={historicoRendimentos}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                barCategoryGap="20%" // Espaçamento entre grupos de barras
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                                <XAxis dataKey="mesAno" stroke="#6b7280" /> 
                                
                                {/* Eixo Y Esquerdo: Valor Monetário */}
                                <YAxis 
                                    yAxisId="left" 
                                    stroke="#10B981" 
                                    // CORREÇÃO DOMAIN: Garante que o valor total (R$ 800.00) caiba
                                    domain={[0, (dataMax: number) => dataMax * 1.2]} 
                                    tickFormatter={(value) => `R$ ${value.toFixed(0)}`}
                                />
                                
                                <Tooltip 
                                    formatter={(value, name) => {
                                        if (typeof value === 'number') {
                                            return [formatarParaMoeda(value), name];
                                        }
                                        return [value, name];
                                    }}
                                />
                                <Legend />
                                
                                {/* BARRA 1: Valor Vendido (Verde) */}
                                <Bar 
                                    dataKey="valorVendido" // CORRIGIDO: Agora usa a chave correta da API
                                    name="Valor Vendido" 
                                    fill="#10B981" 
                                    yAxisId="left" 
                                />
                                
                                {/* BARRA 2: Comissão (Azul) */}
                                <Bar 
                                    dataKey="valorComissao" 
                                    name="Comissão (R$)" 
                                    fill="#2563EB" 
                                    yAxisId="left"
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                         <div className="h-64 bg-gray-50 flex items-center justify-center border border-dashed rounded-lg">
                             <p className="text-gray-500">Nenhum dado histórico de rendimento disponível para o gráfico.</p>
                         </div>
                    )}
                </div>

                {/* HISTÓRICO EM TABELA (1/3 da largura em telas grandes) */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Detalhes do Histórico</h2>
                    <p className="text-sm text-gray-500 mb-4">Comissão Base: {percentualComissao.toFixed(2)}%</p>
                    <div className="overflow-y-auto h-72">
                        {historicoRendimentos.length > 0 ? (
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 sticky top-0">
                                    <tr>
                                        <th className="th-cell py-2 text-left">Mês</th>
                                        <th className="th-cell py-2 text-right">Comissão</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {historicoRendimentos.slice().reverse().map((item, index) => (
                                        <tr key={index} className="border-b hover:bg-gray-50">
                                            <td className="td-cell py-2">{item.mesAno}</td>
                                            <td className="td-cell py-2 text-right text-blue-600 font-semibold">
                                                {formatarParaMoeda(item.valorComissao)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="text-gray-500 pt-4">Nenhum histórico disponível.</p>
                        )}
                    </div>
                </div>

            </div>

            {/* MODAL DE EDIÇÃO */}
            <GenericFormModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setFormError(null);
                }}
                title="Editar Vendedor"
                closeOnOutsideClick={false} 
            >
                <VendedorForm
                    initialData={vendedor} 
                    onSubmit={handleUpdate}
                    loading={formLoading}
                    error={formError}
                />
            </GenericFormModal>
        </DashboardLayout>
    );
}

function fetchVendedorDetalhes() {
  throw new Error('Function not implemented.');
}
