// src/users/superadmin/types.ts

/**
 * Define os status possíveis para um Módulo, conforme a API
 */
export type ModuloStatus = 
  | 'EM_DESENVOLVIMENTO'
  | 'EM_TESTE'
  | 'PRONTO_PARA_PRODUCAO'
  | 'ARQUIVADO';

/**
 * Interface para a entidade Módulo (Catálogo do SaaS)
 */
export interface Modulo {
  id: number;
  nome: string;
  chave: string;
  status: ModuloStatus;
  descricaoCurta?: string;
  precoMensal: number;
  isPadrao: boolean;
}

/**
 * Interface para a entidade Empresa (Tenant)
 */
export interface Empresa {
  id: number;
  nomeFantasia: string; 
  cnpj: string;         
  nome: string;
  email: string;
  // --- CORREÇÃO AQUI ---
  // Voltando para um array de Objetos Modulo, que é o que o seu erro indica ser o correto.
  modulosAtivos: Modulo[]; 
}

// DTO para POST /api/superadmin/modulos
export interface ModuloRequestDTO {
  nome: string;
  chave: string;
  status: ModuloStatus;
  descricaoCurta?: string;
  precoMensal: number;
  isPadrao: boolean;
}

// DTO para POST /api/superadmin/empresas
export interface EmpresaRequestDTO {
  nomeFantasia: string;
  cnpj: string;
  adminNome: string;
  adminEmail: string;
  adminSenha: string;
}

// DTO para PUT /api/superadmin/empresas/{id}
export interface EmpresaUpdateRequestDTO {
    nomeFantasia: string;
    cnpj: string;
}

/**
 * DTO para PUT /api/superadmin/empresas/{id}/modulos
 */
export interface AtualizarModulosEmpresaRequestDTO {
  moduloIds: number[]; // Array de IDs
}