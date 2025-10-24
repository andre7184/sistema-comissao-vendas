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
// AGORA INCLUI NOME E EMAIL para permitir a edição no form
export interface VendedorUpdateRequestDTO {
  nome: string; // Adicionado
  email: string; // Adicionado
  percentualComissao: number;
}

// Interface base para a entidade Venda
// (Baseado na resposta de GET /api/vendas e POST /api/vendas)
export interface Venda {
  id: number;
  valorVenda: number;
  dataVenda: string; // A API retorna uma data (provavelmente string ISO)
  valorComissaoCalculado: number;
  vendedorId: number;
  vendedor: string; // Ou apenas vendedorId, dependendo da resposta
}
// "id": 1,
// 		"valorVenda": 100.00,
// 		"valorComissaoCalculado": 10.00,
// 		"dataVenda": "2025-10-24T03:01:53.816552",
// 		"idVendedor": 2,
// 		"nomeVendedor": "maria"
// DTO para a requisição de lançamento de Venda
export interface VendaRequestDTO {
  vendedorId: number;
  valorVenda: number;
}