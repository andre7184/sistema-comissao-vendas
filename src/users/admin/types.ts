// src/users/admin/types.ts

// Interface base para a entidade Vendedor (usada em listarVendedores e VendaForm)
export interface Vendedor {
  id: number;
  nome: string;
  email: string;
  percentualComissao: number;
  idEmpresa: number;
  // A entidade Vendedor completa pode ter mais campos, ajuste conforme necessário
}

export interface VendedorDetalhado extends Vendedor {
  dataCadastro: string; // Ex: '2023-01-15T10:00:00Z'
  qtdVendas: number;
  valorTotalVendas: number;
  mediaComissao: number;
  
  // Estrutura para dados de gráfico
  historicoRendimentos?: Array<{
    mesAno: string; // Ex: "2024-06"
    valorVendido: number;
    valorComissao: number;
  }>;
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
  nome: string;
  email: string;
  percentualComissao: number;
}

// NOVO: Interface para o objeto Vendedor aninhado dentro da Venda
export interface VendedorNested {
  idVendedor: number; // A API retorna o ID com este nome
  nome: string;
  email: string;
  percentualComissao: number;
}


// Interface base para a entidade Venda
// (ATUALIZADO para incluir o objeto vendedor aninhado)
export interface Venda {
  id: number;
  valorVenda: number;
  dataVenda: string; // A API retorna uma data (provavelmente string ISO)
  valorComissaoCalculado: number;
  
  // ATUALIZADO: Adicionado o objeto completo do vendedor
  vendedor: VendedorNested; 
}

// DTO para a requisição de Lançamento de Venda
export interface VendaRequestDTO {
  vendedorId: number;
  valorVenda: number;
}