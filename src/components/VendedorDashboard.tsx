// src/components/VendedorDashboard.tsx

import { Link } from 'react-router-dom';

export default function VendedorDashboard() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-green-700">Portal do Vendedor</h2>
      <p className='mb-6'>Acesso restrito para lançar e monitorar suas vendas e comissões. </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Lançamento Rápido de Venda */}
        <Link to="/portal-vendas/lancar" className="p-6 bg-blue-100 rounded-lg shadow hover:bg-blue-200 transition">
          <h3 className="text-xl font-semibold text-blue-800">Lançar Nova Venda</h3>
          <p className="text-sm text-blue-600">Registre rapidamente uma nova venda (Status PENDENTE).</p>
        </Link>

        {/* Listagem e Histórico Principal */}
        <Link to="/portal-vendas" className="p-6 bg-green-100 rounded-lg shadow hover:bg-green-200 transition">
          <h3 className="text-xl font-semibold text-green-800">Histórico de Vendas e Comissões</h3>
          <p className="text-sm text-green-600">Visualize todas as suas vendas e o valor da comissão calculado.</p>
        </Link>

      </div>
    </div>
  );
}