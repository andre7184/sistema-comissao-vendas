// src/modules/comissao-core/ComissaoCoreMenu.tsx

// Importa NavItem de navigationConfig
import type { NavItem } from '../../config/navigationConfig'; 
// Importa ROLES e MODULES do arquivo constants
import { ROLES, MODULES } from '../../config/constants'; 

// --- Definição LOCAL dos Ícones usados neste módulo ---
const IconVendedor = () => <span>👥</span>;
const IconVenda = () => <span>🏦</span>;
const IconDashboard = () => <span>📊</span>; 
// =======================================================

// Define o título do grupo
const GROUP_LABEL = "Comissões";

/**
 * Define e exporta os itens de menu específicos do módulo COMISSAO_CORE.
 */
export const comissaoCoreNavItems: NavItem[] = [
    { 
        // ATENÇÃO: Verifique se a rota '/empresa/dashboard' está correta para o Dashboard Gerencial.
        // Se for '/admin-dashboard', corrija aqui.
        path: "/empresa/dashboard",        
        label: "Dashboard Gerencial",        
        icon: IconDashboard,             
        roles: [ROLES.ADMIN],            
        module: MODULES.COMISSOES,
        groupLabel: GROUP_LABEL // <-- ADICIONADO       
    },
    { 
        path: "/vendedores",             
        label: "Gerenciar Vendedores",   
        icon: IconVendedor,              
        roles: [ROLES.ADMIN],            
        module: MODULES.COMISSOES,
        groupLabel: GROUP_LABEL // <-- ADICIONADO       
    },
    { 
        path: "/vendas",                 
        label: "Gerenciar Vendas",      
        icon: IconVenda,                 
        roles: [ROLES.ADMIN],            
        module: MODULES.COMISSOES,
        groupLabel: GROUP_LABEL // <-- ADICIONADO        
    },
];