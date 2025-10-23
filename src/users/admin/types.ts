// src/users/admin/types.ts

// Interface base para a entidade Vendedor
// (Baseado na resposta de GET /api/vendedores e GET /api/vendedores/{id})
export interface Vendedor {
  id: number;
  nome: string;
  email: string;
  percentualComissao: number;
  idEmpresa: number;
  // A entidade Vendedor completa pode ter mais campos, ajuste conforme necessário
}

// DTO para a resposta de criação de Vendedor
export interface VendedorCriadoResponseDTO {
  idVendedor: number;
  idUsuario: number;
  nome: string;
  email: string;
  percentualComissao: number;
  idEmpresa: number;
  senhaTemporaria: string;
}

// DTO para a requisição de criação de Vendedor
export interface VendedorRequestDTO {
  nome: string;
  email: string;
  percentualComissao: number;
}

// DTO para a requisição de atualização de Vendedor
export interface VendedorUpdateRequestDTO {
  percentualComissao: number;
}

// Interface base para a entidade Venda
// (Baseado na resposta de GET /api/vendas e POST /api/vendas)
export interface Venda {
  id: number;
  valorVenda: number;
  dataVenda: string; // A API retorna uma data (provavelmente string ISO)
  valorComissaoCalculado: number;
  vendedor: Vendedor; // Ou apenas vendedorId, dependendo da resposta
}

// DTO para a requisição de lançamento de Venda
export interface VendaRequestDTO {
  vendedorId: number;
  valorVenda: number;
}