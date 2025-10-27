// src/users/superadmin/pages/ModulosPage.tsx

import { useEffect, useState } from 'react';
import DashboardLayout from '../../../layouts/DashboardLayout';
import type { Modulo, ModuloRequestDTO } from '../types';
import { superAdminService } from '../services/superAdminService';
import GenericFormModal from '../../../components/GenericFormModal';
import ModuloForm from '../components/ModuloForm'; // Certifique-se que este componente existe

// Helper para formatar o Status para exibição
const getStatusClass = (status: string) => {
  switch (status) {
    case 'PRONTO_PARA_PRODUCAO': return 'bg-green-100 text-green-800';
    case 'EM_DESENVOLVIMENTO': return 'bg-yellow-100 text-yellow-800';
    case 'ARQUIVADO': return 'bg-gray-100 text-gray-800';
    default: return 'bg-red-100 text-red-800';
  }
};
const getStatusText = (status: string) => status.replace('_', ' ');

export default function ModulosPage() {
  const [modulos, setModulos] = useState<Modulo[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editandoModulo, setEditandoModulo] = useState<Modulo | null>(null);
  
  const [loading, setLoading] = useState(false); // Loading da lista
  const [formLoading, setFormLoading] = useState(false); // Loading do submit do form
  const [formError, setFormError] = useState<string | null>(null);

  const fetchModulos = async () => {
    setLoading(true);
    try {
      const data = await superAdminService.listarModulos();
      setModulos(data);
    } catch (err) {
      console.error("Erro ao buscar módulos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModulos();
  }, []);

  const handleOpenModalCadastro = () => {
    setEditandoModulo(null);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenModalEdicao = (modulo: Modulo) => {
    setEditandoModulo(modulo);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditandoModulo(null);
    setFormError(null);
  };

  // Esta é a nova função de submit. Ela NÃO usa 'desativarModulo'
  const handleSubmit = async (data: ModuloRequestDTO) => {
    setFormLoading(true);
    setFormError(null);
    
    try {
      if (editandoModulo) {
        // ATUALIZAR (PUT)
        await superAdminService.atualizarModulo(editandoModulo.id, data);
      } else {
        // CADASTRAR (POST)
        await superAdminService.cadastrarModulo(data);
      }
      
      await fetchModulos(); // Recarrega a lista
      handleCloseModal(); // Fecha o modal
      
    } catch (err: any) {
      console.error('Erro ao salvar módulo:', err.response?.data || err.message);
      const msg = err.response?.data?.message || `Erro ao ${editandoModulo ? 'atualizar' : 'cadastrar'}. Verifique os dados (ex: a Chave já existe?)`;
      setFormError(msg); // Exibe o erro dentro do modal
    } finally {
      setFormLoading(false);
    }
  };
  
  // Prepara os dados iniciais para o formulário (se estiver editando)
  const getInitialFormData = (): ModuloRequestDTO | undefined => {
    if (!editandoModulo) return undefined;
    
    // Converte a entidade Modulo (com id) para o ModuloRequestDTO (sem id)
    return {
      nome: editandoModulo.nome,
      chave: editandoModulo.chave,
      status: editandoModulo.status,
      descricaoCurta: editandoModulo.descricaoCurta || '',
      precoMensal: editandoModulo.precoMensal,
      isPadrao: editandoModulo.isPadrao,
    };
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Gerenciar Catálogo de Módulos</h2>
        <button
          onClick={handleOpenModalCadastro}
          className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 transition"
        >
          + Novo Módulo
        </button>
      </div>

      {/* MODAL DE CADASTRO/EDIÇÃO */}
      <GenericFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editandoModulo ? 'Editar Módulo' : 'Cadastrar Novo Módulo'}
        closeOnOutsideClick={false}
      >
        <ModuloForm
          onSubmit={handleSubmit}
          initialData={getInitialFormData()}
          loading={formLoading}
          error={formError}
        />
      </GenericFormModal>

      {/* LISTAGEM DE MÓDULOS */}
      {loading ? (
        <p>Carregando módulos...</p>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="th-cell">Nome / Chave</th>
                <th className="th-cell">Status</th>
                <th className="th-cell">Preço</th>
                <th className="th-cell">Padrão?</th>
                <th className="th-cell">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {modulos.map((modulo) => (
                <tr key={modulo.id}>
                  <td className="td-cell">
                    <div className="font-medium text-gray-900">{modulo.nome}</div>
                    <div className="text-xs text-gray-500">{modulo.chave}</div>
                  </td>
                  <td className="td-cell">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusClass(modulo.status)}`}>
                      {getStatusText(modulo.status)}
                    </span>
                  </td>
                  <td className="td-cell">
                    R$ {modulo.precoMensal.toFixed(2).replace('.', ',')}
                  </td>
                  <td className="td-cell">
                    {modulo.isPadrao ? 'Sim' : 'Não'}
                  </td>
                  <td className="td-cell">
                    <button
                      onClick={() => handleOpenModalEdicao(modulo)}
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