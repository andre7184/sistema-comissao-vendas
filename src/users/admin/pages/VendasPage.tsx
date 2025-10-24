// src/users/admin/pages/VendasPage.tsx

import { useEffect, useState } from 'react';
import DashboardLayout from '../../../layouts/DashboardLayout';
import type { Venda, Vendedor, VendaRequestDTO } from '../types';
import { adminService } from '../services/adminService';
import GenericFormModal from '../../../components/GenericFormModal';
import VendaForm from '../components/VendaForm';
// NOVO: Importa a função de navegação, assumindo que você usa react-router-dom
import { useNavigate } from 'react-router-dom'; 

// Helper para formatar data (opcional)
const formatarData = (dataISO: string) => {
  try {
    return new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'short',
      timeStyle: 'short',
    }).format(new Date(dataISO));
  } catch (e) {
    return dataISO;
  }
};

export default function VendasPage() {
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [vendedores, setVendedores] = useState<Vendedor[]>([]); // Para o form
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // NOVO: Hook de navegação
  const navigate = useNavigate();


  // Função para carregar dados da página (vendas e vendedores)
  const fetchData = async () => {
    setLoading(true);
    try {
      // Carrega os dados de forma paralela (melhor performance)
      const [vendasData, vendedoresData] = await Promise.all([
        adminService.listarVendas(),
        adminService.listarVendedores()
      ]);
      setVendas(vendasData);
      setVendedores(vendedoresData);
    } catch (e) {
      console.error('Erro ao carregar dados:', e);
      // Você pode adicionar um estado para exibir erro ao carregar lista
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormError(null);
    // Após fechar o modal (e se o submit foi bem-sucedido), recarrega os dados
    if (!formError && !formLoading) {
      fetchData();
    }
  };
  
  const handleSubmit = async (data: VendaRequestDTO) => {
    setFormLoading(true);
    setFormError(null);
    try {
      await adminService.lancarVenda(data);
      handleCloseModal(); // Fecha e recarrega a lista
    } catch (e: any) {
      const errorMsg = e.response?.data?.message || 'Erro ao lançar venda.';
      setFormError(errorMsg);
    } finally {
      setFormLoading(false);
    }
  };

  // NOVO: Função para navegar para a página de edição de vendedor
  const handleAbrirVendedor = (idVendedor: number) => {
    // Navega para a página de vendedores, usando o state para indicar qual vendedor destacar/editar.
    // Você precisará implementar a lógica de highlight/edição na VendedoresPage.tsx
    navigate(`/vendedor`, { state: { highlightVendedorId: idVendedor } });
  };


  return (
    <DashboardLayout>
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Lançamento de Vendas</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary"
        >
          Lançar Nova Venda
        </button>
      </header>

      {loading && <p className="text-gray-600">Carregando dados das vendas...</p>}

      {!loading && vendas.length === 0 && (
        <p className="text-gray-600">Nenhuma venda registrada ainda.</p>
      )}

      {!loading && vendas.length > 0 && (
        <div className="bg-white shadow rounded-lg overflow-x-auto">
          <table className="w-full min-w-[1000px]"> {/* Aumentei o min-width para acomodar as colunas */}
            <thead className="bg-gray-50">
              <tr>
                <th className="th-cell">Data</th>
                <th className="th-cell">ID Vendedor</th> {/* NOVO */}
                <th className="th-cell">Nome Vendedor</th> {/* NOVO */}
                <th className="th-cell">Email</th> {/* NOVO */}
                <th className="th-cell">Valor da Venda (R$)</th>
                <th className="th-cell">Comissão Calculada (R$)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {vendas.map((venda) => (
                <tr key={venda.id}>
                  <td className="td-cell">{formatarData(venda.dataVenda)}</td>
                  
                  {/* NOVO: ID Vendedor */}
                  <td className="td-cell text-sm">
                    {venda.vendedor.idVendedor}
                  </td>
                  
                  {/* NOVO: Nome do Vendedor */}
                  <td className="td-cell font-medium text-gray-900 cursor-pointer">
                    <a
                      onClick={() => handleAbrirVendedor(venda.vendedor.idVendedor)}
                      className="text-indigo-600 hover:text-indigo-800 font-medium"
                      title="Abrir página de edição do vendedor"
                    >
                      {venda.vendedor.nome}
                    </a>
                  </td>
                  
                  {/* NOVO: Email do Vendedor */}
                  <td className="td-cell text-sm text-gray-500">
                    {venda.vendedor.email}
                  </td>
                  
                  <td className="td-cell text-green-600 font-medium">
                    R$ {venda.valorVenda.toFixed(2)}
                  </td>
                  <td className="td-cell text-blue-600 font-medium">
                    R$ {venda.valorComissaoCalculado.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL DE LANÇAMENTO DE VENDA */}
      <GenericFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Lançar Nova Venda"
        closeOnOutsideClick={false} // Desabilita o fechamento ao clicar fora
      >
        <VendaForm
          onSubmit={handleSubmit}
          vendedores={vendedores}
          loading={formLoading}
          error={formError}
        />
      </GenericFormModal>
    </DashboardLayout>
  );
}