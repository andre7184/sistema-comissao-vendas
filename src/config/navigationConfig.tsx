// src/config/navigationConfig.tsx

import { useMemo, type ReactNode } from 'react';
import { NavLink } from 'react-router-dom';

// Importa ROLES e MODULES do arquivo constants
import { ROLES, MODULES, type AllowedRoleType } from './constants'; 
// Importa os itens de menu do módulo
import { comissaoCoreNavItems } from '../modulos/comissao-core/ComissaoCoreMenu'; 
// Ícones definidos localmente
const IconHome = () => <span>🏠</span>;
const IconModulo = () => <span>📦</span>;
const IconEmpresa = () => <span>🏢</span>;
const IconVenda = () => <span>💰</span>; 

// --- Tipagem do Item de Navegação ---
export interface NavItem {
  icon: () => ReactNode;
  label: string;
  path: string;
  roles: AllowedRoleType[]; 
  module?: typeof MODULES[keyof typeof MODULES];
}

// --- Interface para as Props do Hook de Filtro ---
interface FilterProps {
    currentRole: string | null; // Propriedade necessária
    currentPermissoes: string[] | null; // Propriedade necessária
}

// --- Lista de Itens BASE ---
const baseNavItems: NavItem[] = [
    { icon: IconHome, label: 'Dashboard', path: '/dashboard', roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.VENDEDOR] },
    { icon: IconEmpresa, label: 'Gerenciar Empresas', path: '/empresas', roles: [ROLES.SUPER_ADMIN] },
    { icon: IconModulo, label: 'Catálogo de Módulos', path: '/modulos', roles: [ROLES.SUPER_ADMIN] },
    { icon: IconModulo, label: 'Meus Módulos', path: '/empresa/meus-modulos', roles: [ROLES.ADMIN] }, 
    { icon: IconVenda, label: 'Minhas Vendas', path: '/minhas-vendas', roles: [ROLES.VENDEDOR] },
];

// --- Lista COMPLETA (Base + Módulos) ---
const allNavItems: NavItem[] = [
    ...baseNavItems,
    ...comissaoCoreNavItems, 
];

// --- Hook de Filtro para o Menu ---
export function useFilteredNavItems({ currentRole, currentPermissoes }: FilterProps): NavItem[] { // Usa FilterProps
  
  const filteredItems = useMemo(() => {
    if (!currentRole) return [];
    
    const roleAsLiteral = currentRole as AllowedRoleType; 
    const permissoesSet = new Set(currentPermissoes || []);
    const hasComissaoModule = permissoesSet.has(MODULES.COMISSOES);

    const roleAllowedItems = allNavItems.filter(item => item.roles.includes(roleAsLiteral));

    if (roleAsLiteral === ROLES.ADMIN) {
      if (hasComissaoModule) {
        return roleAllowedItems.filter(item => item.module === MODULES.COMISSOES || !item.module);
      } else {
        return roleAllowedItems.filter(item => !item.module);
      }
    } else {
      return roleAllowedItems.filter(item => {
          if (item.module) return permissoesSet.has(item.module);
          return true; 
      });
    }
  }, [currentRole, currentPermissoes]);

  return filteredItems;
}

// --- Componente de Renderização dos Links ---
export const SidebarMenu = ({ filteredItems, currentRole }: { filteredItems: NavItem[]; currentRole: string | null }) => {
    const activeLinkClass = "bg-blue-100 text-blue-700";
    const inactiveLinkClass = "text-gray-600 hover:bg-gray-100 hover:text-gray-900";
    const baseLinkClass = "flex items-center space-x-3 p-3 rounded-lg text-base font-medium transition duration-150 ease-in-out";
    const hasComissaoLinks = filteredItems.some(i => i.module === MODULES.COMISSOES);

    return (
        <nav className="space-y-1">
            {filteredItems.map(item => (
                <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === "/dashboard" || item.path === "/admin-dashboard"} 
                    className={({ isActive }) => `${baseLinkClass} ${isActive ? activeLinkClass : inactiveLinkClass}`}
                >
                    {item.icon()} 
                    <span>{item.label}</span>
                </NavLink>
            ))}
            
            {currentRole === ROLES.ADMIN && !hasComissaoLinks && (
                 <div className='p-3 text-xs text-red-600 bg-red-50 rounded-md mt-4 border border-red-200'>
                    Módulo 'Comissões Core' não está ativo. Funcionalidades limitadas.
                 </div>
            )}
        </nav>
    );
};