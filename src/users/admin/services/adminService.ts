// src/users/admin/services/adminService.ts

import api from '../../../services/api'; // Importa a instância global do Axios
import type {
  Vendedor,
  VendedorCriadoResponseDTO,
  VendedorRequestDTO,
  VendedorUpdateRequestDTO,
  Venda,
  VendaRequestDTO
} from '../types';

// DTO interno para o que a API REALMENTE retorna
interface VendedorAPIDTO {
    idVendedor: number;
    percentualComissao: number;
    idUsuario: number;
    nome: string;
    email: string;
    // ... e outros campos que a API retorna, como qtdVendas
    [key: string]: any; 
}

// DTO interno para o que a API REALMENTE retorna
interface VendaAPIDTO {
    id: number;
    valorVenda: number;
    dataVenda: string;
    valorComissaoCalculado: number;
    idVendedor: number;
    nomeVendedor: string;
    // ... e outros campos que a API retorna, como qtdVendas
    [key: string]: any; 
} 

export const adminService = {
  
  // --- GERENCIAMENTO DE VENDEDORES ---

  /**
   * Lista todos os vendedores da empresa logada
   * GET /api/vendedores
   */
  listarVendedores: async (): Promise<Vendedor[]> => {
    // A API retorna VendedorAPIDTO[], mas o frontend espera Vendedor[]
    const response = await api.get<VendedorAPIDTO[]>('/api/vendedores');
    
    // Mapeamento: Transforma idVendedor em id para a interface do frontend
    return response.data.map(item => ({
      id: item.idVendedor, // CORREÇÃO AQUI: Mapeia o ID correto
      nome: item.nome,
      email: item.email,
      percentualComissao: item.percentualComissao,
      idEmpresa: item.idEmpresa || 0, // Adiciona o campo que falta na resposta para o tipo Vendedor
      // O campo idEmpresa provavelmente não está no seu DTO de resposta, mas está na interface Vendedor
    }));
  },
  listarVendas: async (): Promise<Venda[]> => {
    const response = await api.get<VendaAPIDTO[]>('/api/vendas');
    return response.data.map(item => ({
      id: item.id,
      valorVenda: item.valorVenda,
      dataVenda: item.dataVenda,
      valorComissaoCalculado: item.valorComissaoCalculado,
      vendedorId: item.idVendedor,
      vendedor: item.nomeVendedor || '', // Mantém o objeto vendedor conforme retornado pela API
    }));
  },
// ... (Restante do código inalterado) ...
  /**
   * Cria um novo vendedor para a empresa logada
   * POST /api/vendedores
   */
  cadastrarVendedor: async (dados: VendedorRequestDTO): Promise<VendedorCriadoResponseDTO> => {
    const response = await api.post<VendedorCriadoResponseDTO>('/api/vendedores', dados);
    return response.data;
  },

  /**
   * Atualiza o percentual de comissão de um vendedor
   * PUT /api/vendedores/{id}
   */
  atualizarComissaoVendedor: async (idVendedor: number, dados: VendedorUpdateRequestDTO): Promise<Vendedor> => {
    const response = await api.put<Vendedor>(`/api/vendedores/${idVendedor}`, dados);
    return response.data;
  },

  // --- GERENCIAMENTO DE VENDAS ---

  /**
   * Lista todas as vendas da empresa logada
   * GET /api/vendas
   */

  /**
   * Lança uma nova venda para um vendedor
   * POST /api/vendas
   */
  lancarVenda: async (dados: VendaRequestDTO): Promise<Venda> => {
    const response = await api.post<Venda>('/api/vendas', dados);
    return response.data;
  }
};