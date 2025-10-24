// src/App.tsx

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import EmpresasPage from './users/superadmin/pages/EmpresasPage';
import ModulosPage from './users/superadmin/pages/ModulosPage';
import VendedoresPage from './users/admin/pages/VendedoresPage';
import VendasPage from './users/admin/pages/VendasPage'; // <-- 1. IMPORTE A PÁGINA
import VendedorDetailPage from './users/admin/pages/VendedorDetailPage'; // <-- IMPORTAÇÃO DA NOVA PÁGINA
import MeusModulosPage from './pages/Modulos';

// Define os papéis para uso nas rotas
const ROLES = {
    SUPER_ADMIN: 'ROLE_SUPER_ADMIN', 
    ADMIN: 'ROLE_ADMIN', 
    VENDEDOR: 'ROLE_VENDEDOR', 
}

// Define as chaves dos módulos
const MODULES = {
  COMISSOES: 'COMISSAO_CORE',
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* ... (Rotas Públicas, Super Admin, Admin /vendedores) ... */}
          <Route path="/" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.VENDEDOR]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/empresas"
            element={
              <ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN]}>
                <EmpresasPage /> 
              </ProtectedRoute>
            }
          />
          <Route
            path="/modulos"
            element={
              <ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN]}>
                <ModulosPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/empresa/meus-modulos"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <MeusModulosPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vendedores"
            element={
              <ProtectedRoute 
                allowedRoles={[ROLES.ADMIN]} 
                requiredModule={MODULES.COMISSOES}
              >
                <VendedoresPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/vendedor/:id" // <-- Rota dinâmica com o ID
            element={
              <ProtectedRoute 
                allowedRoles={[ROLES.ADMIN]} // Acesso restrito ao Admin
                requiredModule={MODULES.COMISSOES}
              >
                <VendedorDetailPage /> 
              </ProtectedRoute>
            }
          />
          
          {/* --- 2. DESCOMENTE E ATIVE A ROTA --- */}
          <Route
            path="/vendas"
            element={
              <ProtectedRoute 
                allowedRoles={[ROLES.ADMIN]} 
                requiredModule={MODULES.COMISSOES} // <-- Segurança de Módulo aplicada
              >
                <VendasPage />
              </ProtectedRoute>
            }
          />
          
          <Route path="*" element={<h1>404 | Página Não Encontrada</h1>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;