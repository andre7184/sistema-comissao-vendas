// src/layouts/DashboardLayout.tsx

import { useContext, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

// --- 1. SEUS IMPORTS DE NAVEGAÇÃO (Mantidos) ---
import { useFilteredNavItems, SidebarMenu } from '../config/navigationConfig';

// --- 2. NOVO IMPORT: Modal de Alterar Senha ---
import AlterarSenhaModal from '../components/AlterarSenhaModal';

// Ícones
const IconMenu = () => <span className="text-2xl">☰</span>;
const IconClose = () => <span className="text-2xl">X</span>;
const IconUser = () => <span>👤</span>; // Ícone para o menu de usuário

export default function DashboardLayout({ children }: { children: ReactNode }) {
  // --- 3. CONTEXTO ATUALIZADO (Incluindo userNome) ---
  const { role, permissoes, userNome, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // --- 4. ESTADOS ---
  const [sidebarOpen, setSidebarOpen] = useState(false); // Menu Lateral (Mobile)
  const [isMenuOpen, setIsMenuOpen] = useState(false);   // Menu Dropdown do Usuário
  const [isSenhaModalOpen, setIsSenhaModalOpen] = useState(false); // Modal de Senha

  // --- 5. SUA LÓGICA DE NAVEGAÇÃO (Mantida) ---
  const filteredNavItems = useFilteredNavItems({
    currentRole: role,
    currentPermissoes: permissoes,
  });

  const renderNavLinks = () => (
      <SidebarMenu filteredItems={filteredNavItems} currentRole={role} />
  );

  // --- 6. HANDLERS DO MENU DE USUÁRIO ---
  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  const toggleMenu = () => setIsMenuOpen(prev => !prev);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Overlay (Mobile) */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black opacity-50 md:hidden" 
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar (Sua implementação original) */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-xl p-4 md:static md:translate-x-0 
        transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg text-blue-600 font-bold px-2">Gerenciamento</h2>
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
          
          <h1 className="text-xl font-bold text-gray-800 invisible md:visible">
            <span className="text-red-500 mr-2">💰</span>
            Sistema de Comissões
          </h1>
          
          {/* --- 7. NOVO MENU DROPDOWN DE USUÁRIO --- */}
          <div className="relative">
            <button 
              onClick={toggleMenu} 
              className="flex items-center space-x-2 text-sm text-gray-700 hover:text-blue-600 focus:outline-none"
            >
              <div className="p-1 bg-gray-100 rounded-full"><IconUser /></div>
              <div className="flex flex-col items-start">
                  <span className="hidden sm:inline font-medium leading-tight">{userNome || 'Usuário'}</span>
                  <span className="hidden sm:inline text-[10px] text-gray-500 leading-tight">
                    {role?.replace('ROLE_', '')}
                  </span>
              </div>
              <span className="text-xs ml-1">▼</span>
            </button>
            
            {/* Dropdown Content */}
            {isMenuOpen && (
              <div 
                className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 py-1 border border-gray-200"
                onMouseLeave={closeMenu}
              >
                <div className="px-4 py-2 text-sm text-gray-900 font-semibold border-b bg-gray-50">
                   Olá, {userNome?.split(' ')[0]}
                </div>
                <button 
                  onClick={() => { setIsSenhaModalOpen(true); closeMenu(); }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                >
                  Alterar Senha
                </button>
                <button 
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  Sair
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4 md:p-6">
          {children}
        </main>
        
        <footer className="h-10 bg-white border-t flex items-center justify-center text-xs text-gray-500">
            &copy; {new Date().getFullYear()} Sistema de Vendas e Comissões.
        </footer>
      </div>

      {/* --- 8. MODAL RENDERIZADO AQUI --- */}
      <AlterarSenhaModal
        isOpen={isSenhaModalOpen}
        onClose={() => setIsSenhaModalOpen(false)}
      />
    </div>
  );
}