// src/layouts/DashboardLayout.tsx

import { useContext, useState, type ReactNode } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

// Ícones simples para o menu (pode substituir por react-icons)
const IconHome = () => <span>🏠</span>;
const IconModulo = () => <span>📦</span>;
const IconEmpresa = () => <span>🏢</span>;
const IconVendedor = () => <span>👥</span>;
const IconVenda = () => <span>💰</span>;
const IconMenu = () => <span>☰</span>;
const IconClose = () => <span>X</span>;

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { role, permissoes, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false); // Estado para o hambúrguer

  // Verifica a permissão do módulo COMISSOES_CORE [cite: 141, 189]
  const temComissoesCore = permissoes?.includes('COMISSAO_CORE');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const activeLinkClass = "bg-blue-100 text-blue-700";
  const inactiveLinkClass = "text-gray-600 hover:bg-gray-100 hover:text-gray-900";

  const renderNavLinks = () => (
    <nav className="flex-1 flex flex-col gap-2 px-2">
      <NavLink
        to="/dashboard"
        end // 'end' garante que só fica ativo na rota exata /dashboard
        className={({ isActive }) =>
          `flex items-center gap-3 p-2 rounded-md font-medium ${isActive ? activeLinkClass : inactiveLinkClass}`
        }
      >
        <IconHome /> Dashboard
      </NavLink>

      {/* Links exclusivos do Super Admin [cite: 9] */}
      {role === 'ROLE_SUPER_ADMIN' && (
        <>
          <NavLink
            to="/modulos"
            className={({ isActive }) =>
              `flex items-center gap-3 p-2 rounded-md font-medium ${isActive ? activeLinkClass : inactiveLinkClass}`
            }
          >
            <IconModulo /> Módulos SaaS
          </NavLink>
          <NavLink
            to="/empresas"
            className={({ isActive }) =>
              `flex items-center gap-3 p-2 rounded-md font-medium ${isActive ? activeLinkClass : inactiveLinkClass}`
            }
          >
            <IconEmpresa /> Empresas
          </NavLink>
        </>
      )}

      {/* Links para Admin (requer módulo COMISSOES_CORE) [cite: 141, 189] */}
      {role === 'ROLE_ADMIN' && (
        <>
          {temComissoesCore ? (
            <>
              <NavLink
                to="/vendedores"
                className={({ isActive }) =>
                  `flex items-center gap-3 p-2 rounded-md font-medium ${isActive ? activeLinkClass : inactiveLinkClass}`
                }
              >
                <IconVendedor /> Vendedores
              </NavLink>
              <NavLink
                to="/vendas"
                className={({ isActive }) =>
                  `flex items-center gap-3 p-2 rounded-md font-medium ${isActive ? activeLinkClass : inactiveLinkClass}`
                }
              >
                <IconVenda /> Vendas
              </NavLink>
            </>
          ) : (
            <div className='p-2 text-xs text-gray-500'>
              Módulo 'Comissões Core' não está ativo.
            </div>
          )}
        </>
      )}

      {/* Links para Vendedor [cite: 11] */}
      {role === 'ROLE_VENDEDOR' && (
        <>
          <NavLink
            to="/minhas-vendas"
            className={({ isActive }) =>
              `flex items-center gap-3 p-2 rounded-md font-medium ${isActive ? activeLinkClass : inactiveLinkClass}`
            }
          >
            <IconVenda /> Minhas Vendas
          </NavLink>
        </>
      )}
    </nav>
  );

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex md:flex-col w-64 bg-white shadow-md">
        <div className="h-16 flex items-center justify-center p-4 border-b">
          <h2 className="text-xl font-bold text-blue-600">Comissões</h2>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          {renderNavLinks()}
        </div>
      </aside>

      {/* Sidebar (Mobile) - Controlada pelo 'sidebarOpen' */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-30 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)}></div>
      )}
      <aside
        className={`fixed md:hidden z-40 inset-y-0 left-0 w-64 bg-white shadow-md p-4 transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-blue-600">Comissões</h2>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden p-1 text-gray-600 hover:text-gray-900">
            <IconClose />
          </button>
        </div>
        {renderNavLinks()}
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow h-16 flex justify-between items-center px-4 md:px-6">
          {/* Botão Hambúrguer (Mobile) */}
          <button onClick={() => setSidebarOpen(true)} className="md:hidden p-1 text-gray-600 hover:text-gray-900">
            <IconMenu />
          </button>
          
          <h1 className="text-lg font-semibold text-gray-800 invisible md:visible">
            Painel de Controle
          </h1>
          
          <button onClick={handleLogout} className="text-sm text-red-500 hover:underline">
            Sair ({role?.replace('ROLE_', '')})
          </button>
        </header>

        {/* Page content (scrollable) */}
        <main className="p-4 md:p-6 flex-1 overflow-y-auto">
          {children} {/* <-- AQUI É ONDE AS PÁGINAS SÃO RENDERIZADAS */}
        </main>
      </div>
    </div>
  );
}