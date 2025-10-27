// src/modules/comissao-core/ComissaoCoreMenu.tsx

import type { ReactNode } from 'react';
// Importa NavItem de navigationConfig
import type { NavItem } from '../../config/navigationConfig'; 
// Importa ROLES e MODULES do novo arquivo constants
import { ROLES, MODULES } from '../../config/constants'; 

// --- Definição LOCAL dos Ícones usados neste módulo ---
const IconVendedor = (): ReactNode => <span>👥</span>;
const IconVenda = (): ReactNode => <span>💰</span>;
const IconDashboard = (): ReactNode => <span>📊</span>; 
// =======================================================

/**
 * Define e exporta os itens de menu específicos do módulo COMISSAO_CORE.
 */
export const comissaoCoreNavItems: NavItem[] = [
    { 
        path: "/empresa/dashboard",        
        label: "Dashboard Gerencial",        
        icon: IconDashboard,             // Usa o ícone definido localmente
        roles: [ROLES.ADMIN],            // Usa ROLES importado de constants
        module: MODULES.COMISSOES        // Usa MODULES importado de constants
    },
    { 
        path: "/vendedores",             
        label: "Gerenciar Vendedores",   
        icon: IconVendedor,              // Usa o ícone definido localmente
        roles: [ROLES.ADMIN],            // Usa ROLES importado de constants
        module: MODULES.COMISSOES        // Usa MODULES importado de constants
    },
    { 
        path: "/vendas",                 
        label: "Gerenciar Vendas",      
        icon: IconVenda,                 // Usa o ícone definido localmente
        roles: [ROLES.ADMIN],            // Usa ROLES importado de constants
        module: MODULES.COMISSOES        // Usa MODULES importado de constants
    },
];