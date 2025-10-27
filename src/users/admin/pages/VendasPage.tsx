// src/users/admin/pages/VendasPage.tsx

import { useEffect, useState } from 'react';
import DashboardLayout from '../../../layouts/DashboardLayout';
import type { Venda, Vendedor, VendaRequestDTO } from '../types';
import { adminService } from '../services/adminService';
import GenericFormModal from '../../../components/GenericFormModal';
import VendaForm from '../components/VendaForm';
// NOVO: Importa a função de navegação, assumindo que você usa react-router-dom
import { useNavigationUtils } from '../hooks/useNavigationUtils';

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
  const { handleAbrirVendedor } = useNavigationUtils(); // Renomeado para maior clareza

  // Função para carregar dados da página (vendas e vendedores)
  const fetchData = async () => {
    setLoading(true);
    try {
      const [vendasData, vendedoresData] = await Promise.all([
        adminService.listarVendas(),
        adminService.listarVendedores()
      ]);
      setVendas(vendasData);
      setVendedores(vendedoresData);
    } catch (e) {
      console.error('Erro ao carregar dados:', e);
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
    if (!formError && !formLoading) {
      fetchData();
    }
  };
  
  const handleSubmit = async (data: VendaRequestDTO) => {
    setFormLoading(true);
    setFormError(null);
    try {
      await adminService.lancarVenda(data);
      handleCloseModal();
    } catch (e: any) {
      const errorMsg = e.response?.data?.message || 'Erro ao lançar venda.';
      setFormError(errorMsg);
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Lançamento de Vendas</h1>
        <button
          onClick={() => setIsModalOpen(true)} // CHAMA A FUNÇÃO DE ABRIR MODAL
          className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 transition" // Adicionado o estilo do btn-primary
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
          <table className="w-full min-w-[1000px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="th-cell">Data</th>
                <th className="th-cell">Nome Vendedor</th>
                <th className="th-cell">Valor da Venda (R$)</th>
                <th className="th-cell">Comissão Calculada (R$)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {vendas.map((venda) => (
                <tr key={venda.id}><td className="td-cell">{formatarData(venda.dataVenda)}</td>
                  {/* Nome do Vendedor */}
                  <td className="td-cell font-medium text-gray-900">
                    <a onClick={() => handleAbrirVendedor(venda.vendedor.idVendedor)}
                      className="text-indigo-600 hover:text-indigo-800 font-medium text-xs cursor-pointer"
                      title="Abrir página de detalhes do vendedor"
                    >
                      <span className="text-sm">{venda.vendedor.nome}</span>
                    </a>
                    <p className="text-xs text-gray-500">({venda.vendedor.email})</p>
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
        closeOnOutsideClick={false} 
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