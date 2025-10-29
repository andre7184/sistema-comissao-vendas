// src/users/admin/pages/VendasPage.tsx

import { useEffect, useState } from 'react';
import DashboardLayout from '../../../layouts/DashboardLayout';
// Importa VendaUpdateRequestDTO que será usado na edição
import type { Venda, Vendedor, VendaRequestDTO, VendaUpdateRequestDTO} from '../types';
import { adminService } from '../services/adminService';
import GenericFormModal from '../../../components/GenericFormModal';
import VendaForm from '../components/VendaForm';
import { useNavigationUtils } from '../hooks/useNavigationUtils'; // Hook para navegação
import { formatarParaMoeda } from '../../../utils/formatters'; // Importa formatador de moeda

// Helper para formatar data (opcional)
const formatarData = (dataISO: string) => {
  try {
    return new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'short',
      timeStyle: 'short',
    }).format(new Date(dataISO));
  } catch (e) {
    console.error("Erro ao formatar data:", dataISO, e);
    return 'Data inválida';
  }
};

export default function VendasPage() {
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [vendedores, setVendedores] = useState<Vendedor[]>([]); // Para popular o form
  const [isModalOpen, setIsModalOpen] = useState(false); // Controla visibilidade do modal

  const [loading, setLoading] = useState(true); // Loading da lista principal
  const [formLoading, setFormLoading] = useState(false); // Loading do submit do form no modal
  const [formError, setFormError] = useState<string | null>(null); // Erro do form no modal

  // NOVO ESTADO: Guarda a venda que está sendo editada
  const [editandoVenda, setEditandoVenda] = useState<Venda | null>(null);

  // Hook para navegação
  const { handleAbrirVendedor } = useNavigationUtils(); // Usando o nome do seu hook

  // Função para carregar dados da página (vendas e vendedores)
  const fetchData = async () => {
    // Evita recarregar se já estiver carregando
    if (!loading) setLoading(true);
    try {
      const [vendasData, vendedoresData] = await Promise.all([
        adminService.listarVendas(),
        adminService.listarVendedores() // Necessário para o VendaForm
      ]);
      setVendas(vendasData);
      setVendedores(vendedoresData);
    } catch (e) {
      console.error('Erro ao carregar dados da página de vendas:', e);
      // Opcional: Adicionar um estado de erro para a página inteira
    } finally {
      setLoading(false);
    }
  };

  // Carrega os dados iniciais ao montar o componente
  useEffect(() => {
    fetchData();
  }, []); // Array vazio garante que rode apenas uma vez na montagem

  // Abre o modal para CADASTRO
  const handleOpenModalCadastro = () => {
    setEditandoVenda(null); // Garante que não está em modo de edição
    setFormError(null); // Limpa erros do form anterior
    setIsModalOpen(true); // Abre o modal
  };

  // NOVO: Abre o modal para EDIÇÃO
  const handleOpenModalEdicao = (venda: Venda) => {
    setEditandoVenda(venda); // Define a venda a ser editada
    setFormError(null); // Limpa erros do form anterior
    setIsModalOpen(true); // Abre o modal
  };

  // Fecha o modal e limpa os estados relacionados
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditandoVenda(null); // Limpa a venda em edição
    setFormError(null);
    // Não recarrega dados aqui, só após o submit bem-sucedido
  };

  // ATUALIZADO: Função de Submit (lida com Criar e Editar)
  const handleSubmit = async (data: VendaRequestDTO) => { // Recebe VendaRequestDTO do form
    setFormLoading(true);
    setFormError(null);
    try {
      if (editandoVenda) {
        // --- MODO EDIÇÃO ---
        // Cria o DTO de atualização SÓ com valor e descrição
        const updateData: VendaUpdateRequestDTO = {
            valorVenda: data.valorVenda,
            descricaoVenda: data.descricaoVenda || '', // Garante string vazia
        };
        // Chama o serviço de atualização
        await adminService.atualizarVenda(editandoVenda.id, updateData);
      } else {
        // --- MODO CRIAÇÃO ---
        // Chama o serviço de lançamento (DTO já está correto)
        await adminService.lancarVenda(data);
      }
      // Sucesso: Recarrega a lista e fecha o modal
      await fetchData(); // Recarrega os dados após sucesso
      handleCloseModal();

    } catch (e: any) {
      const errorMsg = e.response?.data?.message || `Erro ao ${editandoVenda ? 'atualizar' : 'lançar'} venda.`;
      setFormError(errorMsg); // Mostra o erro no modal
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <DashboardLayout>
      {/* Header da Página */}
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gerenciamento de Vendas</h1>
        <button
          onClick={handleOpenModalCadastro} // Botão chama cadastro
          className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 transition"
        >
          + Lançar Nova Venda
        </button>
      </header>

      {/* Indicador de Loading */}
      {loading && <p className="text-gray-600 text-center py-4">Carregando vendas...</p>}

      {/* Mensagem se não houver vendas */}
      {!loading && vendas.length === 0 && (
        <p className="text-gray-600 text-center py-4">Nenhuma venda registrada ainda.</p>
      )}

      {/* Tabela e Cards Responsivos */}
      {!loading && vendas.length > 0 && (
        <div className="bg-white shadow rounded-lg"> {/* Removido overflow-x-auto */}

          {/* Tabela Desktop */}
          <div className="overflow-x-auto hidden sm:block"> {/* Adicionado overflow aqui */}
              <table className="w-full min-w-[1000px]">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="th-cell">Data</th>
                    <th className="th-cell">Nome Vendedor</th>
                    <th className="th-cell">Descrição</th>
                    <th className="th-cell">Valor (R$)</th>
                    <th className="th-cell">Comissão (R$)</th>
                    <th className="th-cell">Ações</th> {/* Coluna Ações */}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {vendas.map((venda) => (
                    <tr key={venda.id}>
                      <td className="td-cell">{formatarData(venda.dataVenda)}</td>
                      <td className="td-cell font-medium text-gray-900">
                        {/* Botão/Link para detalhes do vendedor */}
                        <button onClick={() => handleAbrirVendedor(venda.vendedor.idVendedor)} className="text-indigo-600 hover:text-indigo-800 font-medium text-xs cursor-pointer underline">
                          {venda.vendedor.nome}
                        </button>
                        <p className="text-xs text-gray-500">({venda.vendedor.email})</p>
                      </td>
                      <td className="td-cell max-w-[200px] truncate" title={venda.descricaoVenda}>
                        {venda.descricaoVenda || '-'} {/* Mostra '-' se descrição for vazia/null */}
                      </td>
                      <td className="td-cell text-green-600 font-medium"> {formatarParaMoeda(venda.valorVenda)} </td>
                      <td className="td-cell text-blue-600 font-medium"> {formatarParaMoeda(venda.valorComissaoCalculado)} </td>
                      {/* Célula com Botão Editar */}
                      <td className="td-cell space-x-2 whitespace-nowrap">
                        <button
                          onClick={() => handleOpenModalEdicao(venda)} // Chama a função de edição
                          className="text-yellow-600 hover:text-yellow-800 font-medium text-xs px-2 py-1 rounded hover:bg-yellow-50"
                          title="Editar esta venda"
                        >
                          Editar
                        </button>
                        {/* Futuro botão Excluir pode vir aqui */}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
          </div>

          {/* Lista Mobile (Cards) */}
          <div className="sm:hidden p-4 space-y-4">
              {vendas.map((venda) => (
                  <div key={venda.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm space-y-3">
                      {/* Header Card */}
                      <div className="flex justify-between items-start border-b pb-2 mb-2">
                          <p className="font-semibold text-gray-700">Venda #{venda.id}</p>
                          <p className="text-xs text-gray-500">{formatarData(venda.dataVenda)}</p>
                      </div>

                      {/* Vendedor */}
                      <div>
                          <p className="text-xs font-medium text-gray-500 mb-0.5">Vendedor:</p>
                          <div className="flex justify-between items-center">
                              <p className="text-sm font-semibold">{venda.vendedor.nome}</p>
                              <button onClick={() => handleAbrirVendedor(venda.vendedor.idVendedor)} className="text-indigo-600 hover:text-indigo-800 font-medium text-xs"> Ver Detalhes &rarr; </button>
                          </div>
                      </div>

                      {/* Descrição */}
                       <div>
                           <p className="text-xs font-medium text-gray-500 mb-0.5">Descrição:</p>
                           <p className="text-sm text-gray-700">{venda.descricaoVenda || '-'}</p>
                       </div>

                      {/* Valor e Comissão */}
                      <div className="grid grid-cols-2 gap-3 pt-2 border-t mt-2">
                           <div> <p className="text-xs font-medium text-gray-500">Valor:</p> <p className="text-sm font-medium text-green-600">{formatarParaMoeda(venda.valorVenda)}</p> </div>
                           <div> <p className="text-xs font-medium text-gray-500">Comissão:</p> <p className="text-sm font-medium text-blue-600">{formatarParaMoeda(venda.valorComissaoCalculado)}</p> </div>
                      </div>

                      {/* Ações no Card Mobile */}
                       <div className="pt-3 border-t text-right mt-2">
                           <button
                               onClick={() => handleOpenModalEdicao(venda)} // Chama a função de edição
                               className="text-yellow-700 hover:text-yellow-900 font-medium text-sm px-4 py-1.5 bg-yellow-100 hover:bg-yellow-200 rounded transition duration-150"
                           >
                               Editar Venda
                           </button>
                       </div>
                  </div>
              ))}
          </div>
        </div>
      )}

      {/* MODAL DE LANÇAMENTO/EDIÇÃO DE VENDA */}
      <GenericFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        // Título dinâmico
        title={editandoVenda ? `Editar Venda #${editandoVenda.id}` : 'Lançar Nova Venda'}
        closeOnOutsideClick={false}
      >
        {/* Passa initialData para o VendaForm */}
        <VendaForm
          initialData={editandoVenda || undefined}
          onSubmit={handleSubmit}
          vendedores={vendedores}
          loading={formLoading}
          error={formError}
        />
      </GenericFormModal>
    </DashboardLayout>
  );
}