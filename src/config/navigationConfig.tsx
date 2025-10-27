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

interface FilterProps {
    currentRole: string | null;
    currentPermissoes: string[] | null;
}

// --- Lista de Itens BASE ---
const baseNavItems: NavItem[] = [
    // Dashboard Genérico (se aplicável a todos os roles)
    { icon: IconHome, label: 'Home', path: '/empresa/home', roles: [ROLES.ADMIN] },
    // Super Admin
    { icon: IconEmpresa, label: 'Gerenciar Empresas', path: '/empresas', roles: [ROLES.SUPER_ADMIN] },
    { icon: IconModulo, label: 'Catálogo de Módulos', path: '/modulos', roles: [ROLES.SUPER_ADMIN] },
    // Vendedor
    { icon: IconVenda, label: 'Minhas Vendas', path: '/minhas-vendas', roles: [ROLES.VENDEDOR] },
];

// --- Lista COMPLETA (Base + Módulos) ---
const allNavItems: NavItem[] = [
    ...baseNavItems,
    ...comissaoCoreNavItems, 
];

// --- Hook de Filtro para o Menu (LÓGICA AJUSTADA) ---
export function useFilteredNavItems({ currentRole, currentPermissoes }: FilterProps): NavItem[] {
  
  const filteredItems = useMemo(() => {
    if (!currentRole) return [];
    
    const roleAsLiteral = currentRole as AllowedRoleType; 
    const permissoesSet = new Set(currentPermissoes || []);
    const hasComissaoModule = permissoesSet.has(MODULES.COMISSOES); // Verifica se tem o módulo

    // Filtra todos os itens que o Role PODE ver
    const roleAllowedItems = allNavItems.filter(item => item.roles.includes(roleAsLiteral));

    // Lógica Específica para ADMIN
    if (roleAsLiteral === ROLES.ADMIN) {
      if (hasComissaoModule) {
        // Se tem o módulo, retorna itens DO módulo + itens base SEM módulo (como Meus Módulos)
        return roleAllowedItems.filter(item => item.module === MODULES.COMISSOES || !item.module);
      } else {
        // Se NÃO tem o módulo, retorna APENAS itens base SEM módulo
        return roleAllowedItems.filter(item => !item.module);
      }
    } 
    // Lógica Padrão para outros Roles (SUPER_ADMIN, VENDEDOR)
    else {
      // Filtra com base no role e verifica o módulo APENAS se o item o exigir
      return roleAllowedItems.filter(item => {
          if (item.module) {
              return permissoesSet.has(item.module);
          }
          return true; // Se não exige módulo, permite
      });
    }

  }, [currentRole, currentPermissoes]);

  return filteredItems;
}

// --- Componente de Renderização dos Links ---
// (SidebarMenu permanece igual)
export const SidebarMenu = ({ filteredItems, currentRole }: { filteredItems: NavItem[]; currentRole: string | null }) => {
    // ... (JSX inalterado) ...
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
                    // Ajuste no 'end' para funcionar com múltiplos dashboards
                    end={item.path === "/empresa/home"} 
                    className={({ isActive }) => `${baseLinkClass} ${isActive ? activeLinkClass : inactiveLinkClass}`}
                >
                    {item.icon()} 
                    <span>{item.label}</span>
                </NavLink>
            ))}
            
            {/* Mensagem se o Admin não tiver o módulo */}
            {currentRole === ROLES.ADMIN && !hasComissaoLinks && (
                 <div className='p-3 text-xs text-red-600 bg-red-50 rounded-md mt-4 border border-red-200'>
                    Módulo 'Comissões Core' não está ativo. Funcionalidades limitadas.
                 </div>
            )}
        </nav>
    );
};