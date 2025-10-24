// src/users/admin/pages/VendasPage.tsx

import { useEffect, useState } from 'react';
import DashboardLayout from '../../../layouts/DashboardLayout';
import type { Venda, Vendedor, VendaRequestDTO } from '../types';
import { adminService } from '../services/adminService';
import GenericFormModal from '../../../components/GenericFormModal';
import VendaForm from '../components/VendaForm';

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

// REMOVIDO: interface VendaFormData extends VendaRequestDTO { vendedorSelecionadoNome: string; }


export default function VendasPage() {
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [vendedores, setVendedores] = useState<Vendedor[]>([]); // Para o form
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Função para carregar dados da página (vendas e vendedores)
  const fetchData = async () => {
    setLoading(true);
    try {
      // Carrega os dois endpoints em paralelo
      const [vendasData, vendedoresData] = await Promise.all([
        adminService.listarVendas(),      // 
        adminService.listarVendedores() // 
      ]);
      setVendas(vendasData);
      setVendedores(vendedoresData);
    } catch (err) {
      console.error("Erro ao buscar dados:", err);
      // Aqui você pode setar um erro de página inteira se desejar
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = () => {
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormError(null);
  };

  // Função chamada pelo VendaForm no submit - AGORA RECEBE VendaRequestDTO NOVAMENTE
  const handleSubmit = async (data: VendaRequestDTO) => { // ALTERADO AQUI
    setFormLoading(true);
    setFormError(null);
    
    // Nenhuma conversão necessária, pois o VendaForm já submete o DTO limpo.

    try {
      await adminService.lancarVenda(data); //
      await fetchData(); // Recarrega a lista de vendas
      handleCloseModal(); // Fecha o modal
      
    } catch (err: any) {
      console.error('Erro ao lançar venda:', err.response?.data || err.message);
      const msg = err.response?.data?.message || `Erro ao lançar venda. Verifique os dados.`;
      setFormError(msg); // Exibe o erro dentro do modal
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Lançamentos de Vendas</h2>
        <button
          onClick={handleOpenModal}
          disabled={vendedores.length === 0} // Desabilita se não há vendedores
          className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 transition disabled:bg-gray-400"
        >
          + Lançar Venda
        </button>
      </div>
      
      {vendedores.length === 0 && !loading && (
        <div className="p-3 mb-4 bg-yellow-100 text-yellow-800 border border-yellow-300 rounded">
          Você precisa <a href="/vendedores" className="font-bold underline">cadastrar vendedores</a> antes de lançar vendas.
        </div>
      )}

{/* MODAL DE LANÇAMENTO DE VENDA */}
      <GenericFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal} // Mantém o botão de fechar funcionando
        title="Lançar Nova Venda"
        closeOnOutsideClick={false} // NOVO: Desabilita o fechamento ao clicar fora
      >
        <VendaForm
          onSubmit={handleSubmit}
          vendedores={vendedores}
          loading={formLoading}
          error={formError}
        />
      </GenericFormModal>

      {/* LISTAGEM DE VENDAS */}
      {loading ? (
        <p>Carregando vendas...</p>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="th-cell">Data</th>
                <th className="th-cell">Vendedor</th>
                <th className="th-cell">Valor da Venda (R$)</th>
                <th className="th-cell">Comissão Calculada (R$)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {vendas.map((venda) => (
                <tr key={venda.id}>
                  <td className="td-cell">
                    {formatarData(venda.dataVenda)}
                  </td>
                  <td className="td-cell">
                    {/* A API pode retornar o objeto Vendedor aninhado, ou apenas o ID. 
                        Ajuste 'venda.vendedor?.nome' conforme a resposta real da sua API */}
                    <div className="font-medium text-gray-900">{venda.vendedor || 'Vendedor não carregado'}</div>
                    <div className="text-xs text-gray-500">{venda.vendedorId || ''}</div>
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
    </DashboardLayout>
  );
}