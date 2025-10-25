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

// NOVO: Estrutura para Vendas de Destaque (USADA NO DASHBOARD)
export interface VendaDestaque {
    idVenda: number; // <-- ID DA VENDA (campo que faltava ou estava inconsistente)
    nomeVendedor: string;
    idVendedor: number; // Para navegação
    valorVenda: number;
    dataVenda: string;
}

// NOVO: Estrutura para o Ranking de Vendedores
export interface RankingItem {
    nomeVendedor: string;
    idVendedor: number;
    valorTotal: number;
    qtdVendas: number;
}

// NOVO: Estrutura para os dados do gráfico mensal (Histórico)
export interface HistoricoVendasMensalItem {
  mesAno: string; // Ex: "2024-06"
  valorVendido: number; // Valor total vendido no mês
}

// NOVO: Estrutura completa do Dashboard Gerencial da Empresa
export interface EmpresaDashboardData {
  mediaComissaoEmpresa: any;
  // Métricas Globais
  totalVendedores: number;
  totalVendasMes: number;
  valorTotalVendidoMes: number;
  valorTotalComissaoMes: number;
  
  // Ranking (Top Vendedores)
  rankingVendedores: RankingItem[];
  
  // Vendas de Destaque (reaproveitando a interface Venda)
  maioresVendas: VendaDestaque[]; // As 3 maiores vendas do mês
  ultimasVendas: VendaDestaque[]; // As 5 últimas vendas
  
  // Dados de Gráfico (Histórico de 12 meses)
  historicoVendasMensal: HistoricoVendasMensalItem[];
}