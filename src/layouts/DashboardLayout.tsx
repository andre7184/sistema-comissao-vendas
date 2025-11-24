// src/layouts/DashboardLayout.tsx

import { useContext, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

// Imports de Navegação
import { useFilteredNavItems, SidebarMenu } from '../config/navigationConfig';

// Import do Modal de Senha
import AlterarSenhaModal from '../components/AlterarSenhaModal';

// NOVOS ÍCONES LUCIDE PARA O LAYOUT
import { Menu, X, User, LogOut, KeyRound, ChevronDown, Building } from 'lucide-react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { role, permissoes, userNome, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Estados
  const [sidebarOpen, setSidebarOpen] = useState(false); 
  const [isMenuOpen, setIsMenuOpen] = useState(false);   
  const [isSenhaModalOpen, setIsSenhaModalOpen] = useState(false); 

  // Lógica de Navegação
  const filteredNavItems = useFilteredNavItems({
    currentRole: role,
    currentPermissoes: permissoes,
  });

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  // Funções do Dropdown
  const toggleMenu = () => setIsMenuOpen(prev => !prev);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    // Fundo 'surface' (cinza claro) para todo o app
    <div className="flex h-screen bg-surface text-gray-800 font-sans overflow-hidden">
      
      {/* Overlay Mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm md:hidden" 
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* --- SIDEBAR PROFISSIONAL --- */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 shadow-sm transform transition-transform duration-300 ease-in-out md:static md:translate-x-0 
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Logo Area */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-100 bg-white">
          <div className="flex items-center gap-2 text-brand-700">
            <div className="p-1.5 bg-brand-50 rounded-lg">
                <Building size={24} className="text-brand-600" />
            </div>
            <span className="text-lg font-bold tracking-tight text-gray-900">Gestão<span className="text-brand-600">Pro</span></span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-gray-500 hover:text-brand-600">
            <X size={24} />
          </button>
        </div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto py-4">
            {/* Renderiza o menu usando a lógica filtrada */}
            <SidebarMenu filteredItems={filteredNavItems} currentRole={role} />
        </div>
        
        {/* Footer Sidebar */}
        <div className="p-4 border-t border-gray-100 bg-gray-50">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-xs">
                    {userNome?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="overflow-hidden">
                    <p className="text-xs font-semibold text-gray-900 truncate">{userNome || 'Usuário'}</p>
                    <p className="text-[10px] text-gray-500 truncate uppercase">{role?.replace('ROLE_', '')}</p>
                </div>
            </div>
        </div>
      </aside>

      {/* --- CONTEÚDO PRINCIPAL --- */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Header Superior */}
        <header className="bg-white h-16 border-b border-gray-200 flex justify-between items-center px-4 sm:px-6 lg:px-8 shadow-sm relative z-30">
          <button onClick={() => setSidebarOpen(true)} className="md:hidden text-gray-500 hover:text-brand-600 p-1 rounded-md hover:bg-gray-100 transition">
            <Menu size={24} />
          </button>
          
          <h1 className="text-lg font-semibold text-gray-700 invisible md:visible">
            Painel de Controle
          </h1>
          
          {/* Menu Dropdown de Usuário */}
          <div className="relative">
            <button 
              onClick={toggleMenu} 
              className="flex items-center gap-2 py-1.5 px-3 rounded-full hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all focus:outline-none"
            >
              <div className="hidden md:flex flex-col items-end mr-1">
                  <span className="text-sm font-medium text-gray-700 leading-none">{userNome?.split(' ')[0]}</span>
              </div>
              <div className="p-1 bg-brand-50 rounded-full text-brand-600">
                <User size={18} />
              </div>
              <ChevronDown size={14} className={`text-gray-400 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {/* Dropdown Content */}
            {isMenuOpen && (
              <>
                <div className="fixed inset-0 z-20" onClick={closeMenu}></div>
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl ring-1 ring-black ring-opacity-5 z-30 divide-y divide-gray-100 animate-in fade-in zoom-in-95 duration-100 origin-top-right">
                  <div className="px-4 py-3 bg-gray-50 rounded-t-lg">
                    <p className="text-xs text-gray-500">Logado como</p>
                    <p className="text-sm font-medium text-gray-900 truncate">{userNome}</p>
                  </div>
                  <div className="py-1">
                    <button 
                      onClick={() => { setIsSenhaModalOpen(true); closeMenu(); }}
                      className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-brand-50 hover:text-brand-700 transition-colors"
                    >
                      <KeyRound size={16} className="mr-3 text-gray-400 group-hover:text-brand-600" />
                      Alterar Senha
                    </button>
                  </div>
                  <div className="py-1 bg-gray-50 rounded-b-lg">
                    <button 
                      onClick={handleLogout}
                      className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={16} className="mr-3" />
                      Sair do Sistema
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </header>

        {/* Área de Conteúdo com Scroll */}
        <main className="flex-1 overflow-auto bg-surface p-4 sm:p-6 lg:p-8 relative scroll-smooth">
          <div className="max-w-7xl mx-auto">
             {children}
          </div>
        </main>
      </div>

      {/* Modal de Alterar Senha */}
      <AlterarSenhaModal
        isOpen={isSenhaModalOpen}
        onClose={() => setIsSenhaModalOpen(false)}
      />
    </div>
  );
}