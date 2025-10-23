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

export const adminService = {
  
  // --- GERENCIAMENTO DE VENDEDORES ---

  /**
   * Lista todos os vendedores da empresa logada
   * GET /api/vendedores
   */
  listarVendedores: async (): Promise<Vendedor[]> => {
    const response = await api.get<Vendedor[]>('/api/vendedores');
    return response.data;
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
    const response = await api.get<Venda[]>('/api/vendas');
    return response.data;
  },

  /**
   * Lança uma nova venda para um vendedor
   * POST /api/vendas
   */
  lancarVenda: async (dados: VendaRequestDTO): Promise<Venda> => {
    const response = await api.post<Venda>('/api/vendas', dados);
    return response.data;
  }
};