// src/config/navigationConfig.tsx

import { useMemo, useState, type ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { ROLES, MODULES, type AllowedRoleType } from './constants'; 
import { comissaoCoreNavItems } from '../modulos/comissao-core/ComissaoCoreMenu'; 
// Ícones definidos localmente
const IconHome = () => <span>🏠</span>;
const IconModulo = () => <span>📦</span>;
const IconEmpresa = () => <span>🏢</span>;
const IconVendaBase = () => <span>🛒</span>; // Renomeado para diferenciar

// --- Tipagem do Item de Navegação (com groupLabel) ---
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

// --- Lista de Itens BASE ---
const baseNavItems: NavItem[] = [
    { icon: IconHome, label: 'Dashboard', path: '/dashboard', roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.VENDEDOR] }, 
    { icon: IconEmpresa, label: 'Gerenciar Empresas', path: '/empresas', roles: [ROLES.SUPER_ADMIN] },
    { icon: IconModulo, label: 'Catálogo de Módulos', path: '/modulos', roles: [ROLES.SUPER_ADMIN] },
    { icon: IconModulo, label: 'Meus Módulos', path: '/empresa/meus-modulos', roles: [ROLES.ADMIN] }, 
    { icon: IconVendaBase, label: 'Minhas Vendas', path: '/minhas-vendas', roles: [ROLES.VENDEDOR] },
];

// --- Lista COMPLETA (Base + Módulos) ---
const allNavItems: NavItem[] = [
    ...baseNavItems,
    ...comissaoCoreNavItems, 
];

// --- Hook de Filtro para o Menu (LÓGICA REFINADA PARA ADMIN) ---
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
        // Se tem o módulo, retorna itens DO módulo + itens base SEM módulo
        return roleAllowedItems.filter(item => item.module === MODULES.COMISSOES || !item.module);
      } else {
        // Se NÃO tem o módulo, retorna APENAS itens base SEM módulo
        return roleAllowedItems.filter(item => !item.module);
      }
    } 
    // Lógica Padrão para outros Roles
    else {
      return roleAllowedItems.filter(item => {
          if (item.module) return permissoesSet.has(item.module);
          return true; 
      });
    }

  }, [currentRole, currentPermissoes]);

  return filteredItems;
}


// --- Componente de Renderização dos Links (SidebarMenu - LÓGICA DE GRUPO REVISADA) ---

interface SidebarMenuProps {
    filteredItems: NavItem[];
    currentRole: string | null;
}

export const SidebarMenu = ({ filteredItems, currentRole }: SidebarMenuProps) => {
    const activeLinkClass = "bg-blue-100 text-blue-700";
    const inactiveLinkClass = "text-gray-600 hover:bg-gray-100 hover:text-gray-900";
    // Classes base
    const baseLinkClass = "flex items-center space-x-3 p-3 rounded-lg text-base font-medium transition duration-150 ease-in-out";
    const baseGroupClass = "flex items-center space-x-3 p-3 rounded-lg text-base font-semibold transition duration-150 ease-in-out w-full justify-between"; 
    const subItemBaseClass = "flex items-center space-x-2 p-2 rounded-md text-sm font-medium transition duration-150 ease-in-out ml-4"; // Adicionado ml-4 para recuo
    
    // Estado para controlar os grupos abertos/fechados
    const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
        const initialState: Record<string, boolean> = {};
        filteredItems.forEach(item => {
            // Inicializa APENAS os grupos que existem nos itens filtrados
            if (item.groupLabel && initialState[item.groupLabel] === undefined) {
                initialState[item.groupLabel] = true; // Começa aberto
            }
        });
        return initialState;
    });

    // Agrupa os itens pelo groupLabel (GARANTIR QUE ESTÁ CORRETO)
    const groupedItems = useMemo(() => {
        const groups: Record<string, NavItem[]> = {};
        const ungrouped: NavItem[] = [];
        
        filteredItems.forEach(item => {
            // Verifica se a propriedade groupLabel existe E tem valor
            if (item.groupLabel && typeof item.groupLabel === 'string') { 
                if (!groups[item.groupLabel]) {
                    groups[item.groupLabel] = [];
                }
                groups[item.groupLabel].push(item);
            } else {
                ungrouped.push(item);
            }
        });
        // DEBUG: Verifique se os grupos estão sendo criados corretamente
        // console.log("Itens Agrupados:", groups);
        // console.log("Itens Não Agrupados:", ungrouped);
        return { groups, ungrouped };
    }, [filteredItems]);

    const toggleGroup = (label: string) => {
        setOpenGroups(prev => ({ ...prev, [label]: !prev[label] }));
    };

    return (
        <nav className="space-y-1 px-2"> 
            {/* 1. Renderiza itens NÃO agrupados */}
            {groupedItems.ungrouped.map(item => (
                <NavLink
                    key={item.path} // Usa path como chave
                    to={item.path}
                    // CORREÇÃO 'end': Aplica 'end' apenas para o dashboard principal '/' ou '/dashboard'
                    end={item.path === '/dashboard'} 
                    className={({ isActive }) => `${baseLinkClass} ${isActive ? activeLinkClass : inactiveLinkClass}`}
                >
                    {item.icon()} 
                    <span>{item.label}</span>
                </NavLink>
            ))}

            {/* 2. Renderiza itens AGRUPADOS */}
            {Object.entries(groupedItems.groups).map(([groupLabel, items]) => {
                const isOpen = openGroups[groupLabel] ?? true; 
                const GroupIcon = items[0]?.icon || (() => <span>📁</span>); 

                return (
                    <div key={groupLabel}> {/* Usa groupLabel como chave */}
                        {/* Botão do Grupo */}
                        <button
                            onClick={() => toggleGroup(groupLabel)}
                            className={`${baseGroupClass} ${inactiveLinkClass}`} 
                        >
                            <span className="flex items-center space-x-3"> <GroupIcon /> <span>{groupLabel}</span> </span> 
                            <span className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'}`}> ▼ </span> 
                        </button>
                        
                        {/* Itens dentro do Grupo */}
                        {isOpen && ( 
                            <div className="pt-1 space-y-1"> {/* Removido pl-6 daqui */}
                                {items.map(item => (
                                    <NavLink 
                                        key={item.path} // Usa path como chave
                                        to={item.path}
                                        // 'end' pode ser necessário se houver sub-rotas exatas
                                        end={item.path === '/admin-dashboard'} 
                                        className={({ isActive }) => 
                                            // Adiciona ml-4 (recuo) aqui
                                            `${subItemBaseClass} ${isActive ? activeLinkClass : inactiveLinkClass}` 
                                        }
                                    > 
                                        {/* Ícone opcional para subitens */}
                                        {/* {item.icon()} */}
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
                 <div className='p-3 text-xs text-red-600 bg-red-50 rounded-md mt-4 border border-red-200'> 
                    Módulo 'Comissões Core' não está ativo. 
                 </div> 
            )}
        </nav>
    );
};