// src/layouts/DashboardLayout.tsx

import { useContext, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
// Importa o hook e o componente de menu, movendo toda a lógica para lá.
import { useFilteredNavItems, SidebarMenu } from '../config/navigationConfig'; 

// Ícones que controlam a estrutura (permanecem aqui)
const IconMenu = () => <span className="text-2xl">☰</span>;
const IconClose = () => <span className="text-2xl">X</span>;

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { role, permissoes, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false); // Estado para o hambúrguer

  // Usa o hook para obter os itens de menu filtrados
  const filteredNavItems = useFilteredNavItems({
    currentRole: role,
    currentPermissoes: permissoes,
  });

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Renderiza o menu usando o componente externo SidebarMenu
  const renderNavLinks = () => (
      // SidebarMenu usa os itens filtrados e o role para renderização condicional/estilização
      <SidebarMenu filteredItems={filteredNavItems} currentRole={role} />
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Overlay (Mobile) */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black opacity-50 md:hidden" 
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-xl p-4 md:static md:translate-x-0 
        transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-blue-600">Comissões</h2>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden p-1 text-gray-600 hover:text-gray-900">
            <IconClose />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
            {renderNavLinks()}
        </div>
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

        {/* Content Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4 md:p-6">
          {children}
        </main>
        
        {/* Footer (Opcional) */}
        <footer className="h-10 bg-white border-t flex items-center justify-center text-xs text-gray-500">
            &copy; {new Date().getFullYear()} Meu Sistema de Comissões.
        </footer>
      </div>
    </div>
  );
}