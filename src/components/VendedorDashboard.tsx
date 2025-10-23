import { Link } from 'react-router-dom';

export default function VendedorDashboard() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-green-700">Portal do Vendedor</h2>
      <p className='mb-6'>Acesso restrito aos seus próprios dados de performance.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link to="/vendedor/relatorios" className="p-6 bg-green-100 rounded-lg shadow hover:bg-green-200 transition">
          <h3 className="text-xl font-semibold text-green-800">Meus Relatórios de Vendas</h3>
          <p className="text-sm text-green-600">Acesse seus relatórios de desempenho e comissões.</p>
        </Link>
        <Link to="/vendedor/historico" className="p-6 bg-gray-100 rounded-lg shadow hover:bg-gray-200 transition">
          <h3 className="text-xl font-semibold text-gray-800">Histórico de Comissões</h3>
          <p className="text-sm text-gray-600">Detalhes de pagamentos e valores calculados.</p>
        </Link>
      </div>
    </div>
  );
}