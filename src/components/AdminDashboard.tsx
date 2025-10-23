// src/components/AdminDashboard.tsx
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export default function AdminDashboard() {
  const { permissoes } = useContext(AuthContext);

  // --- CORREÇÃO AQUI ---
  // Mude de 'COMISSOES_CORE' para 'COMISSAO_CORE' (singular)
  const temComissoesCore = permissoes?.includes('COMISSAO_CORE'); 

  return (
    <div>
      {/* ... (resto do componente) ... */}

      {temComissoesCore ? ( // A verificação agora deve funcionar
          <>
            <Link to="/vendedores" /* ... */ >
              {/* ... */}
            </Link>
            <Link to="/vendas" /* ... */ >
              {/* ... */}
            </Link>
          </>
      ) : (
           <div className="md:col-span-2 p-6 bg-red-100 border-l-4 border-red-500 rounded-lg shadow">
              <h3 className="text-xl font-semibold text-red-800">Módulo Core Inativo</h3>
              {/* --- CORREÇÃO AQUI TAMBÉM (Opcional, mas bom para consistência) --- */}
              <p className="text-base text-red-600">O gerenciamento de Vendas e Vendedores está bloqueado. Contrate o **COMISSAO_CORE** para habilitar.</p>
          </div>
      )}
      {/* ... (resto do componente) ... */}
    </div>
  );
}