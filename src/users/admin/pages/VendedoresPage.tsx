// src/users/admin/pages/VendedoresPage.tsx

import { useEffect, useState } from 'react';
import DashboardLayout from '../../../layouts/DashboardLayout';
import type { Vendedor, VendedorRequestDTO, VendedorUpdateRequestDTO } from '../types';
import { adminService } from '../services/adminService';
import GenericFormModal from '../../../components/GenericFormModal';
import VendedorForm from '../components/VendedorForm';
import { useNavigationUtils } from '../hooks/useNavigationUtils';

// Tipagem para os dados do VendedorForm
interface VendedorFormData {
  nome: string;
  email: string;
  percentualComissao: number;
}

export default function VendedoresPage() {
  const [vendedores, setVendedores] = useState<Vendedor[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editandoVendedor, setEditandoVendedor] = useState<Vendedor | null>(null);

  // Estado para o modal da senha temporária 
  const [senhaGerada, setSenhaGerada] = useState<{nome: string, senha: string} | null>(null);
  
  const [loading, setLoading] = useState(false); // Loading da lista
  const [formLoading, setFormLoading] = useState(false); // Loading do submit do form
  const [formError, setFormError] = useState<string | null>(null);

    const { handleAbrirVendedor } = useNavigationUtils();

  const fetchVendedores = async () => {
    setLoading(true);
    try {
      const data = await adminService.listarVendedores(); //
      setVendedores(data);
    } catch (err) {
      console.error("Erro ao buscar vendedores:", err);
      // Aqui você pode setar um erro de página inteira se desejar
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendedores();
  }, []);

  const handleOpenModalCadastro = () => {
    setEditandoVendedor(null);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenModalEdicao = (vendedor: Vendedor) => {
    setEditandoVendedor(vendedor);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditandoVendedor(null);
    setFormError(null);
  };

  // Função chamada pelo VendedorForm no submit
  const handleSubmit = async (data: VendedorFormData) => {
    setFormLoading(true);
    setFormError(null);
    
    try {
      if (editandoVendedor) {
        // ATUALIZAR (PUT)
        const updateData: VendedorUpdateRequestDTO = {
          nome: data.nome, // Agora enviamos o nome na edição
          email: data.email, // Agora enviamos o email na edição
          percentualComissao: data.percentualComissao 
        };
        // A chamada ao serviço usa o DTO completo VendedorUpdateRequestDTO
        await adminService.atualizarComissaoVendedor(editandoVendedor.id, updateData); //
      
      } else {
        // CADASTRAR (POST)
        const createData: VendedorRequestDTO = {
          nome: data.nome,
          email: data.email,
          percentualComissao: data.percentualComissao //
        };
        const response = await adminService.cadastrarVendedor(createData); //
        
        // Mostrar a senha temporária 
        setSenhaGerada({nome: response.nome, senha: response.senhaTemporaria});
      }
      
      await fetchVendedores(); // Recarrega a lista
      handleCloseModal(); // Fecha o modal do formulário
      
    } catch (err: any) {
      console.error('Erro ao salvar vendedor:', err.response?.data || err.message);
      const msg = err.response?.data?.message || `Erro ao ${editandoVendedor ? 'atualizar' : 'cadastrar'}. Verifique os dados (ex: o Email já existe?)`;
      setFormError(msg); // Exibe o erro dentro do modal
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Gerenciar Vendedores</h2>
        <button
          onClick={handleOpenModalCadastro}
          className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 transition"
        >
          + Novo Vendedor
        </button>
      </div>

      {/* MODAL DE CADASTRO/EDIÇÃO */}
      <GenericFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editandoVendedor ? 'Editar Vendedor' : 'Cadastrar Novo Vendedor'}
        closeOnOutsideClick={false}
      >
        <VendedorForm
          onSubmit={handleSubmit}
          initialData={editandoVendedor || undefined}
          loading={formLoading}
          error={formError}
        />
      </GenericFormModal>

      {/* MODAL PARA EXIBIR SENHA TEMPORÁRIA */}
      <GenericFormModal
        isOpen={!!senhaGerada}
        onClose={() => setSenhaGerada(null)}
        title="Vendedor Cadastrado com Sucesso!"
      >
        <div>
          <p className="mb-2">O vendedor <strong>{senhaGerada?.nome}</strong> foi criado.</p>
          <p className="mb-4">Por favor, anote a senha temporária e a envie para o vendedor:</p>
          <div className="bg-gray-100 p-3 rounded text-center">
            <strong className="text-lg text-blue-600">{senhaGerada?.senha}</strong>
          </div>
          <div className="text-right mt-6">
            <button
              onClick={() => setSenhaGerada(null)}
              className="bg-blue-500 text-white px-6 py-2 rounded shadow hover:bg-blue-600 transition"
            >
              OK
            </button>
          </div>
        </div>
      </GenericFormModal>

      {/* LISTAGEM DE VENDEDORES */}
      {loading ? (
        <p>Carregando vendedores...</p>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="th-cell">Nome</th>
                <th className="th-cell">Comissão (%)</th>
                <th className="th-cell">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {vendedores.map((vendedor) => (
                <tr key={vendedor.id}>
                  <td className="td-cell">
                    
                    <div className="font-medium text-gray-900">
                      <a
                        onClick={() => handleAbrirVendedor(vendedor.id)}
                        className="text-indigo-600 hover:text-indigo-800 font-medium cursor-pointer"
                        title="Abrir página de edição do vendedor"
                      >
                        <span className="text-sm">{vendedor.nome}</span>
                    </a>
                    <p className="text-xs text-gray-500">({vendedor.email})</p>
                    </div>
                  </td>
                  <td className="td-cell">
                    {vendedor.percentualComissao.toFixed(2)}%
                  </td>
                  <td className="td-cell">
                    <button
                      onClick={() => handleOpenModalEdicao(vendedor)}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Editar
                    </button>
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