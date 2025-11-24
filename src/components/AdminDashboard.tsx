// src/components/AdminDashboard.tsx

import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Lock, Users, BadgeDollarSign, LayoutDashboard, ArrowRight } from 'lucide-react';

export default function AdminDashboard() {
  const { permissoes, userNome } = useContext(AuthContext);

  // Verifica permissão (Singular, conforme correção anterior)
  const temComissoesCore = permissoes?.includes('COMISSAO_CORE'); 

  return (
    <div>
      <header className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Olá, {userNome?.split(' ')[0]} 👋</h2>
        <p className='text-gray-500 mt-1'>Bem-vindo ao painel de gestão da sua empresa.</p>
      </header>

      {temComissoesCore ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1: Dashboard Analítico */}
            <Link to="/empresa/dashboard" className="group block bg-white border border-gray-200 rounded-xl p-6 hover:border-brand-300 hover:shadow-md transition-all">
                <div className="flex justify-between items-start">
                    <div className="p-3 bg-brand-50 text-brand-600 rounded-lg group-hover:bg-brand-100 transition-colors">
                        <LayoutDashboard size={24} />
                    </div>
                    <ArrowRight className="text-gray-300 group-hover:text-brand-500" size={20} />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-800">Dashboard Gerencial</h3>
                <p className="mt-1 text-sm text-gray-500">KPIs, gráficos e ranking de vendas.</p>
            </Link>

            {/* Card 2: Vendas */}
            <Link to="/vendas" className="group block bg-white border border-gray-200 rounded-xl p-6 hover:border-green-300 hover:shadow-md transition-all">
                <div className="flex justify-between items-start">
                    <div className="p-3 bg-green-50 text-green-600 rounded-lg group-hover:bg-green-100 transition-colors">
                        <BadgeDollarSign size={24} />
                    </div>
                    <ArrowRight className="text-gray-300 group-hover:text-green-500" size={20} />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-800">Gestão de Vendas</h3>
                <p className="mt-1 text-sm text-gray-500">Aprovar pendências e lançar novas vendas.</p>
            </Link>

            {/* Card 3: Vendedores */}
            <Link to="/vendedores" className="group block bg-white border border-gray-200 rounded-xl p-6 hover:border-indigo-300 hover:shadow-md transition-all">
                <div className="flex justify-between items-start">
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg group-hover:bg-indigo-100 transition-colors">
                        <Users size={24} />
                    </div>
                    <ArrowRight className="text-gray-300 group-hover:text-indigo-500" size={20} />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-800">Equipe de Vendas</h3>
                <p className="mt-1 text-sm text-gray-500">Gerenciar comissões e cadastros.</p>
            </Link>

          </div>
      ) : (
           // Estado de Bloqueio (Sem Módulo)
           <div className="p-8 bg-white border border-red-100 rounded-xl shadow-sm text-center max-w-2xl mx-auto mt-10">
              <div className="inline-flex p-4 bg-red-50 text-red-500 rounded-full mb-4">
                  <Lock size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Módulo de Comissões Inativo</h3>
              <p className="text-gray-500 mb-6">
                  Sua empresa ainda não possui o módulo <strong>COMISSAO_CORE</strong> ativo. 
                  O gerenciamento de Vendas e Vendedores está temporariamente bloqueado.
              </p>
              <button className="px-6 py-2 bg-gray-100 text-gray-600 rounded-lg cursor-not-allowed font-medium text-sm">
                  Contatar Suporte
              </button>
          </div>
      )}
    </div>
  );
}