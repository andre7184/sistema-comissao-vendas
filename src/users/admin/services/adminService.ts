// src/users/admin/services/adminService.ts

import api from '../../../services/api'; // Importa a instância global do Axios
import type {
  Vendedor,
  VendedorCriadoResponseDTO,
  VendedorRequestDTO,
  VendedorUpdateRequestDTO,
  Venda,
  VendaRequestDTO,
  VendedorNested
} from '../types';

// DTO interno para o que a API REALMENTE retorna de VENDEDOR (para listarVendedores)
interface VendedorAPIDTO {
    idVendedor: number;
    percentualComissao: number;
    idUsuario: number;
    nome: string;
    email: string;
    [key: string]: any; 
}

// DTO interno para o que a API REALMENTE retorna de VENDA (para listarVendas)
interface VendaAPIDTO {
    id: number;
    valorVenda: number;
    dataVenda: string;
    valorComissaoCalculado: number;
    vendedor: VendedorNested; // O objeto aninhado que a API agora retorna
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
      idEmpresa: item.idEmpresa || 0, // Ajuste se idEmpresa não vier na resposta
    }));
  },

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
  listarVendas: async (): Promise<Venda[]> => {
    // Usa VendaAPIDTO para garantir que o mapeamento é correto
    const response = await api.get<VendaAPIDTO[]>('/api/vendas'); 
    
    // Mapeamento: Transforma o DTO da API para o tipo Venda esperado
    return response.data.map(item => ({
      id: item.id,
      valorVenda: item.valorVenda,
      dataVenda: item.dataVenda,
      valorComissaoCalculado: item.valorComissaoCalculado,
      vendedor: item.vendedor, // Objeto Vendedor aninhado
    })) as Venda[]; // Fazemos um cast para Venda[]
  },

  /**
   * Lança uma nova venda para um vendedor
   * POST /api/vendas
   */
  lancarVenda: async (dados: VendaRequestDTO): Promise<Venda> => {
    const response = await api.post<Venda>(`/api/vendas`, dados);
    return response.data;
  }
};