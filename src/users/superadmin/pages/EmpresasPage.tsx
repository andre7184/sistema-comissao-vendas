// src/users/superadmin/pages/EmpresasPage.tsx

import { useEffect, useState } from 'react';
import DashboardLayout from '../../../layouts/DashboardLayout'; 
import type { Empresa, EmpresaRequestDTO, EmpresaUpdateRequestDTO } from '../types'; 
import { superAdminService } from '../services/superAdminService';
import { formatarCnpj } from '../../../utils/formatters';
import GenericFormModal from '../../../components/GenericFormModal'; 
import GerenciarModulosEmpresaModal from '../components/GerenciarModulosEmpresaModal';

interface EmpresaFormState {
    nomeFantasia: string;
    cnpj: string;
    adminNome: string; 
    adminEmail: string;
    adminSenha: string;
}
const initialForm: EmpresaFormState = {
    nomeFantasia: '',
    cnpj: '',
    adminNome: '',
    adminEmail: '',
    adminSenha: '',
};

export default function EmpresasPage() {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [formState, setFormState] = useState<EmpresaFormState>(initialForm);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [empresaParaModulos, setEmpresaParaModulos] = useState<Empresa | null>(null);


  const fetchEmpresas = async () => {
    setLoading(true);
    try {
        const data = await superAdminService.listarEmpresas();
        setEmpresas(data);
        setError(null);
    } catch (err: any) {
        console.error('Erro ao listar empresas:', err.response?.data || err.message);
        setError('Não foi possível carregar as empresas.');
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmpresas();
  }, []);

  // --- Funções do Modal de Formulário (Cadastro/Edição) ---
  const handleOpenModalCadastro = () => {
    setFormState(initialForm);
    setEditandoId(null);
    setError(null);
    setIsFormModalOpen(true);
  };

  const handleOpenModalEdicao = (empresa: Empresa) => {
    setFormState({
        nomeFantasia: empresa.nome, 
        cnpj: empresa.cnpj,
        adminNome: '', 
        adminEmail: empresa.email,
        adminSenha: '',
    });
    setEditandoId(empresa.id);
    setError(null);
    setIsFormModalOpen(true);
  };
  
  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
    setFormState(initialForm);
    setEditandoId(null);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
        if (editandoId) {
            const updateData: EmpresaUpdateRequestDTO = { 
                nomeFantasia: formState.nomeFantasia, 
                cnpj: formState.cnpj 
            };
            // Lembre-se, este endpoint estava dando 403 (Forbidden) no seu backend.
            await superAdminService.atualizarEmpresa(editandoId, updateData);
        } else {
            const createData: EmpresaRequestDTO = {
                nomeFantasia: formState.nomeFantasia,
                cnpj: formState.cnpj,
                adminNome: formState.adminNome,
                adminEmail: formState.adminEmail,
                adminSenha: formState.adminSenha,
            };
            await superAdminService.cadastrarEmpresa(createData);
        }
        
        await fetchEmpresas(); 
        handleCloseFormModal();
    } catch (err: any) {
        console.error('Erro na operação:', err.response?.data || err.message);
        // O erro 403 (Forbidden) do backend aparecerá aqui
        const msg = err.response?.data?.message || `Erro ao ${editandoId ? 'atualizar' : 'cadastrar'}. Verifique os dados ou as permissões do backend.`;
        setError(msg);
    } finally {
        setLoading(false);
    }
  };

  const handleCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const valorFormatado = formatarCnpj(e.target.value);
      setFormState({ ...formState, cnpj: valorFormatado });
  };

  const isFormIncomplete = editandoId ? 
    !formState.nomeFantasia || !formState.cnpj : 
    !formState.nomeFantasia || !formState.cnpj || !formState.adminNome || !formState.adminEmail || !formState.adminSenha;


  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Gerenciamento de Empresas-Clientes</h2>
        <button
          onClick={handleOpenModalCadastro}
          className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 transition"
        >
          + Cadastrar Empresa
        </button>
      </div>

      {/* MODAL DE CADASTRO/EDIÇÃO (Formulário) */}
      <GenericFormModal
        isOpen={isFormModalOpen}
        onClose={handleCloseFormModal}
        title={editandoId ? 'Atualizar Empresa' : 'Cadastrar Nova Empresa'}
      >
        <form onSubmit={handleSubmit}>
           {error && <div className="p-3 mb-4 bg-red-100 text-red-700 border border-red-400 rounded">{error}</div>}
          
          <div className="flex flex-col gap-4 mb-4">
              <input
                  type="text"
                  placeholder="Nome Fantasia"
                  value={formState.nomeFantasia}
                  onChange={(e) => setFormState({ ...formState, nomeFantasia: e.target.value })}
                  className="input-form w-full"
              />
              <input
                  type="text"
                  placeholder="CNPJ (Ex: 00.000.000/0000-00)"
                  value={formState.cnpj}
                  onChange={handleCnpjChange}
                  maxLength={18} 
                  className="input-form w-full"
              />
          </div>

          {!editandoId && (
              <>
                  <h4 className="text-md font-medium mt-6 mb-2 border-t pt-4">Dados do Primeiro Administrador (Onboarding)</h4>
                  <div className="flex flex-col gap-4">
                      <input
                          type="text"
                          placeholder="Nome do Admin"
                          value={formState.adminNome}
                          onChange={(e) => setFormState({ ...formState, adminNome: e.target.value })}
                          className="input-form w-full"
                      />
                      <input
                          type="email"
                          placeholder="Email do Admin"
                          value={formState.adminEmail}
                          onChange={(e) => setFormState({ ...formState, adminEmail: e.target.value })}
                          className="input-form w-full"
                      />
                      <input
                          type="password"
                          placeholder="Senha Inicial"
                          value={formState.adminSenha}
                          onChange={(e) => setFormState({ ...formState, adminSenha: e.target.value })}
                          className="input-form w-full"
                      />
                  </div>
              </>
          )}
          
          <div className='mt-6 flex justify-end gap-3'>
              <button
                  type="button"
                  onClick={handleCloseFormModal}
                  className="bg-gray-300 text-gray-800 px-6 py-2 rounded hover:bg-gray-400 transition"
                  disabled={loading}
              >
                  Cancelar
              </button>
              <button
                  type="submit"
                  className={`text-white px-6 py-2 rounded transition ${loading || isFormIncomplete ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
                  disabled={loading || isFormIncomplete}
              >
                  {loading ? 'Processando...' : editandoId ? 'Atualizar' : 'Cadastrar'}
              </button>
          </div>
        </form>
      </GenericFormModal>
      
      {/* Renderize o novo Modal */}
      <GerenciarModulosEmpresaModal
        empresa={empresaParaModulos}
        onClose={() => setEmpresaParaModulos(null)}
        onSuccess={fetchEmpresas} // Recarrega a lista de empresas após o sucesso
      />


      {/* LISTAGEM DE EMPRESAS */}
      <h3 className="text-xl font-semibold mb-3 mt-6">Empresas Cadastradas</h3>
      {loading && empresas.length === 0 ? (
          <p>Carregando lista de empresas...</p>
      ) : (
          <div className="space-y-2">
            {empresas.map((empresa) => (
              <li key={empresa.id} className="p-4 bg-white rounded shadow border-l-4 border-blue-500">
                <div className="flex justify-between items-center">
                  <div>
                    <strong>{empresa.nome}</strong> 
                    <span className="text-sm text-gray-600 ml-3"> | CNPJ: {empresa.cnpj} | Admin: {empresa.email}</span>
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={() => handleOpenModalEdicao(empresa)}
                      className="text-sm text-blue-500 hover:underline"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => setEmpresaParaModulos(empresa)}
                      className="text-sm text-green-600 hover:underline"
                    >
                      Gerenciar Módulos
                    </button>
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t">
                  <span className="text-xs font-medium text-gray-700">Módulos Ativos: </span>
                  <span className="text-xs text-gray-600">
                    {empresa.modulosAtivos && empresa.modulosAtivos.length > 0
                      ? empresa.modulosAtivos
                          // Garante que 'm' é um objeto e tem 'nome' antes de usar
                          .filter(m => typeof m === 'object' && m !== null && typeof m.nome === 'string') 
                          .map(m => m.nome) // Extrai o nome
                          .join(', ') // Junta os nomes com vírgula
                      : 'Nenhum'}
                  </span>
                </div>
              </li>
            ))}
          </div>
      )}
    </DashboardLayout>
  );
}