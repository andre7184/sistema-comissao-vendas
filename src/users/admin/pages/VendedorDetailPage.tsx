// src/users/admin/pages/VendedorDetailPage.tsx

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../../layouts/DashboardLayout';
import type { VendedorDetalhado } from '../types'; // Importa o tipo Detalhado
import { adminService } from '../services/adminService';
import { formatarParaMoeda } from '../../../utils/formatters'; // Importa o utilitário de moeda

// Helper para formatar data de cadastro
const formatarDataSimples = (dataISO: string) => {
  try {
    if (!dataISO) return 'N/A';
    return new Intl.DateTimeFormat('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(dataISO));
  } catch (e) {
    return dataISO;
  }
};


export default function VendedorDetailPage() {
  
  // Obtém o ID da URL. Assume que a rota é /vendedor/:id
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const vendedorId = id ? parseInt(id, 10) : null;
  
  // O estado usa o tipo VendedorDetalhado
  const [vendedor, setVendedor] = useState<VendedorDetalhado | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!vendedorId || isNaN(vendedorId)) {
      setError('ID do vendedor inválido.');
      setLoading(false);
      return;
    }

    const fetchDetalhes = async () => {
      setLoading(true);
      setError(null);
      try {
        // Chama o serviço para buscar os dados detalhados
        const data = await adminService.buscarDetalhesVendedor(vendedorId);
        setVendedor(data);
      } catch (err: any) {
        console.error("Erro ao buscar detalhes do vendedor:", err);
        setError(err.response?.data?.message || `Vendedor com ID ${vendedorId} não encontrado ou erro de API.`);
      } finally {
        setLoading(false);
      }
    };

    fetchDetalhes();
  }, [vendedorId]);


  if (loading) {
    return (
      <DashboardLayout>
        <p className="text-lg text-gray-600">Carregando detalhes do vendedor...</p>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="p-4 bg-red-100 text-red-700 rounded-lg border border-red-400">
          <p className="font-bold">Erro ao carregar detalhes:</p>
          <p>{error}</p>
          <button onClick={() => navigate('/vendedores')} className="mt-4 text-blue-600 hover:underline">
            &larr; Voltar para a lista de Vendedores
          </button>
        </div>
      </DashboardLayout>
    );
  }

  if (!vendedor) {
      return (
          <DashboardLayout>
              <p>Nenhum dado encontrado para o vendedor especificado.</p>
          </DashboardLayout>
      );
  }


  return (
    <DashboardLayout>
      <div className="space-y-8">
        
        {/* CABEÇALHO */}
        <header className="pb-4 border-b flex justify-between items-center">
            <div>
                <h1 className="text-3xl font-bold text-gray-800">
                    Desempenho: {vendedor.nome}
                </h1>
                <p className="text-gray-500 mt-1">ID: {vendedor.id} &middot; Comissão Base: {vendedor.percentualComissao}%</p>
            </div>
            <button
                onClick={() => navigate('/vendedores')}
                className="px-4 py-2 bg-gray-200 rounded-md text-gray-700 hover:bg-gray-300 transition"
            >
                &larr; Voltar para Vendedores
            </button>
        </header>

        {/* DADOS PRINCIPAIS - CARDS DE MÉTRICAS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Email */}
          <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-500">
            <p className="text-sm font-medium text-gray-500">Email / Login</p>
            <p className="text-lg font-semibold text-gray-900 truncate">{vendedor.email}</p>
          </div>
          
          {/* Tempo de Cadastro */}
          <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-purple-500">
            <p className="text-sm font-medium text-gray-500">Membro Desde</p>
            <p className="text-lg font-semibold text-gray-900">{formatarDataSimples(vendedor.dataCadastro)}</p>
          </div>
          
          {/* QTD Vendas */}
          <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-yellow-500">
            <p className="text-sm font-medium text-gray-500">Total de Vendas</p>
            <p className="text-lg font-semibold text-gray-900">{vendedor.qtdVendas || 0}</p>
          </div>
          
          {/* Valor Total Vendido */}
          <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-green-500">
            <p className="text-sm font-medium text-gray-500">Valor Total Vendido</p>
            <p className="text-lg font-semibold text-green-600">{formatarParaMoeda(vendedor.valorTotalVendas)}</p>
          </div>
          
        </div>

        {/* GRÁFICOS E RENDIMENTOS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Gráfico de Desempenho (Placeholder) */}
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Rendimento Mensal (Últimos Meses)</h2>
            <div className="h-64 bg-gray-50 flex items-center justify-center border border-dashed rounded-lg">
              <p className="text-gray-400 text-center">
                **Placeholder para Gráfico de Barras/Linhas**<br/>
                (Integre com bibliotecas como Recharts ou Chart.js aqui)
              </p>
            </div>
            
            {/* Tabela de rendimentos */}
            <h3 className="text-lg font-semibold mt-8 mb-3 border-b pb-1">Histórico de Comissões</h3>
            <div className='overflow-x-auto'>
                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                    <thead className='bg-gray-100'>
                        <tr>
                            <th className='p-3 text-sm font-semibold text-left text-gray-600'>Mês/Ano</th>
                            <th className='p-3 text-sm font-semibold text-right text-gray-600'>Vendido (R$)</th>
                            <th className='p-3 text-sm font-semibold text-right text-gray-600'>Comissão (R$)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vendedor.historicoRendimentos && vendedor.historicoRendimentos.length > 0 ? (
                            vendedor.historicoRendimentos.slice(0, 8).map((h, index) => (
                                <tr key={index} className='border-t hover:bg-blue-50/50'>
                                    <td className='p-3 text-sm font-medium'>{h.mesAno}</td>
                                    <td className='p-3 text-sm text-right'>{formatarParaMoeda(h.valorVendido)}</td>
                                    <td className='p-3 text-sm text-right text-blue-600 font-semibold'>{formatarParaMoeda(h.valorComissao)}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={3} className='p-4 text-center text-gray-500 text-sm'>Nenhum histórico de rendimento disponível no momento.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            
          </div>

          {/* Média de Comissão */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Média de Comissão</h2>
            <div className="h-64 bg-blue-50 flex flex-col items-center justify-center border-2 border-blue-200 rounded-lg">
                <p className='text-7xl font-extrabold text-blue-600'>
                    {vendedor.mediaComissao !== undefined ? vendedor.mediaComissao.toFixed(2) : '0.00'}%
                </p>
                <p className="text-gray-500 mt-2">Média percentual sobre as vendas</p>
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}