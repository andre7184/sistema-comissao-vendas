// src/pages/Dashboard.tsx

import { useContext } from 'react'; 
import { AuthContext } from '../contexts/AuthContext'; 
import DashboardLayout from '../layouts/DashboardLayout'; // Importa o layout

// Importa os componentes específicos de Role
import SuperAdminDashboard from '../components/SuperAdminDashboard';
import AdminDashboard from '../components/AdminDashboard';
import VendedorDashboard from '../components/VendedorDashboard';

export default function Dashboard() { 
  const { role } = useContext(AuthContext); 

  const renderContent = () => {
    switch (role) {
      case 'ROLE_SUPER_ADMIN':
        return <SuperAdminDashboard />;
      case 'ROLE_ADMIN':
        return <AdminDashboard />;
      case 'ROLE_VENDEDOR':
        return <VendedorDashboard />;
      default:
        // Caso o Role ainda não tenha sido carregado ou seja inválido
        return <div className="p-6 text-center text-red-500">Aguardando papel de usuário (Role) ou Papel não reconhecido.</div>;
    }
  };

  // Pode-se usar o 'role === null' (mas token existe) como um estado de 'carregando role'
  if (!role) {
      return (
        <DashboardLayout>
           <div className="flex justify-center items-center h-full">Carregando Dashboard...</div>
        </DashboardLayout>
      );
  }

  return (
    <DashboardLayout>
      {renderContent()} {/* <-- Renderiza o conteúdo específico dentro do layout */}
    </DashboardLayout>
  );
}