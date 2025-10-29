// src/config/navigationConfig.tsx

import { useMemo, useState, type ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { ROLES, MODULES, type AllowedRoleType } from './constants';
import { comissaoCoreNavItems } from '../modulos/comissao-core/ComissaoCoreMenu';
// Ícones definidos localmente (ajuste conforme necessário)
const IconUsersAdmin = () => <span>👨‍💼</span>;
const IconHome = () => <span>🏠</span>;
const IconModulo = () => <span>📦</span>;
const IconEmpresa = () => <span>🏢</span>;
const IconVenda = () => <span>💰</span>; // Ícone para "Minhas Vendas" do Vendedor

// --- Tipagem do Item de Navegação (com groupLabel opcional) ---
export interface NavItem {
  icon: () => ReactNode;
  label: string;
  path: string;
  roles: AllowedRoleType[];
  module?: typeof MODULES[keyof typeof MODULES];
  groupLabel?: string;
}

interface FilterProps {
    currentRole: string | null;
    currentPermissoes: string[] | null;
}

// --- Lista de Itens BASE (CONFORME SUA SOLICITAÇÃO) ---
const baseNavItems: NavItem[] = [
    // Home do Admin
    { icon: IconHome, label: 'Home', path: '/empresa/home', roles: [ROLES.ADMIN] },
    { icon: IconUsersAdmin, label: 'Gerenciar Admins', path: '/empresa/admins', roles: [ROLES.ADMIN] },
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

// --- Hook de Filtro para o Menu (LÓGICA ANTERIOR MANTIDA) ---
export function useFilteredNavItems({ currentRole, currentPermissoes }: FilterProps): NavItem[] {

  const filteredItems = useMemo(() => {
    if (!currentRole) return [];

    const roleAsLiteral = currentRole as AllowedRoleType;
    const permissoesSet = new Set(currentPermissoes || []);
    const hasComissaoModule = permissoesSet.has(MODULES.COMISSOES);

    // Filtra todos os itens que o Role PODE ver
    const roleAllowedItems = allNavItems.filter(item => item.roles.includes(roleAsLiteral));

    // Lógica Específica para ADMIN
    if (roleAsLiteral === ROLES.ADMIN) {
      if (hasComissaoModule) {
        // Se tem o módulo, retorna itens DO módulo + itens base SEM módulo (agora só '/empresa/home')
        return roleAllowedItems.filter(item => item.module === MODULES.COMISSOES || !item.module);
      } else {
        // Se NÃO tem o módulo, retorna APENAS itens base SEM módulo (agora só '/empresa/home')
        return roleAllowedItems.filter(item => !item.module);
      }
    }
    // Lógica Padrão para outros Roles
    else {
      // Filtra com base no role e verifica o módulo APENAS se o item o exigir
      return roleAllowedItems.filter(item => {
          if (item.module) return permissoesSet.has(item.module);
          return true;
      });
    }

  }, [currentRole, currentPermissoes]);

  return filteredItems;
}


// --- Componente de Renderização dos Links (SidebarMenu - LÓGICA DE GRUPO MANTIDA) ---

interface SidebarMenuProps {
    filteredItems: NavItem[];
    currentRole: string | null;
}

export const SidebarMenu = ({ filteredItems, currentRole }: SidebarMenuProps) => {
    const activeLinkClass = "bg-blue-100 text-blue-700";
    const inactiveLinkClass = "text-gray-600 hover:bg-gray-100 hover:text-gray-900";
    // Classes base
    const baseLinkClass = "flex items-center space-x-3 p-3 rounded-lg text-base font-medium transition duration-150 ease-in-out";
    const baseGroupClass = "flex items-center space-x-3 p-3 rounded-lg text-base font-semibold transition duration-150 ease-in-out w-full justify-between cursor-pointer";
    // Classes para subitens (com recuo)
    const subItemBaseClass = "flex items-center space-x-2 p-2 rounded-md text-sm font-medium transition duration-150 ease-in-out ml-4";

    const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
        const initialState: Record<string, boolean> = {};
        filteredItems.forEach(item => { if (item.groupLabel && initialState[item.groupLabel] === undefined) { initialState[item.groupLabel] = true; } });
        return initialState;
    });

    const groupedItems = useMemo(() => {
        const groups: Record<string, NavItem[]> = {}; const ungrouped: NavItem[] = [];
        filteredItems.forEach(item => { if (item.groupLabel) { if (!groups[item.groupLabel]) groups[item.groupLabel] = []; groups[item.groupLabel].push(item); } else { ungrouped.push(item); } });
        return { groups, ungrouped };
    }, [filteredItems]);

    const toggleGroup = (label: string) => { setOpenGroups(prev => ({ ...prev, [label]: !prev[label] })); };

    return (
        <nav className="space-y-1 px-1">
            {/* 1. Renderiza itens NÃO agrupados */}
            {groupedItems.ungrouped.map(item => (
                <NavLink
                    key={item.path}
                    to={item.path}
                    // 'end' é importante para a rota exata da home do admin
                    end={item.path === '/empresa/home'}
                    className={({ isActive }) => `${baseLinkClass} ${isActive ? activeLinkClass : inactiveLinkClass}`}
                >
                    {item.icon()}
                    <span>{item.label}</span>
                </NavLink>
            ))}

            {/* 2. Renderiza itens AGRUPADOS */}
            {Object.entries(groupedItems.groups).map(([groupLabel, items]) => {
                const isOpen = openGroups[groupLabel] ?? true;
                const GroupIcon = (() => <span>📁</span>);
                return (
                    <div key={groupLabel}>
                        <button onClick={() => toggleGroup(groupLabel)} className={`${baseGroupClass} ${inactiveLinkClass}`} >
                             <span className="flex items-center space-x-2"> <GroupIcon /> <span>{groupLabel}</span> </span>
                             <span className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'}`}> ▼ </span>
                        </button>
                        {isOpen && (
                            <div className="pt-1 space-y-1">
                                {items.map(item => ( 
                                    <NavLink key={item.path} 
                                        to={item.path} 
                                        end={item.path === '/empresa/dashboard'} 
                                        className={({ isActive }) => `${subItemBaseClass} ${isActive ? activeLinkClass : inactiveLinkClass}`}>
                                        {item.icon()} 
                                        <span>{item.label}</span> 
                                    </NavLink> 
                                ))}
                            </div>
                        )}
                    </div>
                );
            })}

            {/* Mensagem de Módulo Inativo */}
            {currentRole === ROLES.ADMIN && !filteredItems.some(i => i.module === MODULES.COMISSOES) && (
                 <div className='p-3 text-xs text-red-600 bg-red-50 rounded-md mt-4 border border-red-200'> Módulo 'Comissões Core' não está ativo. </div>
            )}
        </nav>
    );
};