import { Link } from 'react-router-dom';

export default function SuperAdminDashboard() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-blue-700">Painel Super Administrador</h2>
      <p className='mb-6'>Acesso a todas as funções de catálogo e gerenciamento de empresas.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link to="/empresas" className="p-6 bg-green-100 rounded-lg shadow hover:bg-green-200 transition">
          <h3 className="text-xl font-semibold text-green-800">Gerenciar Empresas-Clientes</h3>
          <p className="text-sm text-green-600">Criação e gerenciamento de Tenants, incluindo CNPJ e Admin inicial.</p>
        </Link>
        <Link to="/modulos" className="p-6 bg-blue-100 rounded-lg shadow hover:bg-blue-200 transition">
          <h3 className="text-xl font-semibold text-blue-800">Gerenciar Catálogo de Módulos</h3>
          <p className="text-sm text-blue-600">Cadastro e gestão de módulos SaaS (Chaves, Preços, Status).</p>
        </Link>
      </div>
    </div>
  );
}