// src/users/admin/components/VendaForm.tsx

import type { Vendedor, VendaRequestDTO } from '../types';
import { useForm, type SubmitHandler, Controller } from 'react-hook-form'; 
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useState, useMemo, useEffect } from 'react';
import { formatarParaMoeda, desformatarMoeda } from '../../../utils/formatters';


// DTO para o formulário
type VendaFormData = VendaRequestDTO;

// Schema de validação
const schema = yup.object().shape({
  vendedorId: yup.number()
    .required('Você deve selecionar um vendedor')
    .min(1, 'Seleção de vendedor inválida')
    .typeError('Você deve selecionar um vendedor'),
  valorVenda: yup.number()
    .required('O valor da venda é obrigatório')
    .min(0, 'O valor da venda não pode ser negativo') // PERMITE O ZERO
    .typeError('O valor deve ser um número (use . para decimais)'),
});

interface VendaFormProps {
  vendedores: Vendedor[];
  onSubmit: (data: VendaRequestDTO) => Promise<void>; 
  loading: boolean;
  error?: string | null;
}

export default function VendaForm({ vendedores, onSubmit, loading, error }: VendaFormProps) {
  
  const defaultValues: VendaFormData = {
    vendedorId: 0,
    valorVenda: 0.0,
  };

  const { register, handleSubmit, setValue, watch, control, formState: { errors } } = useForm<VendaFormData>({
    resolver: yupResolver(schema),
    defaultValues: defaultValues,
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [vendedorSelecionadoNome, setVendedorSelecionadoNome] = useState(''); 

  const vendedorId = watch('vendedorId');
  
  // Efeito para sincronizar o nome no campo de busca quando o ID muda
  useEffect(() => {
    if (vendedorId > 0 && vendedores.length > 0) {
      const vendedor = vendedores.find(v => v.id === vendedorId);
      if (vendedor) {
        const fullText = `${vendedor.nome} (Comissão: ${vendedor.percentualComissao}%)`;
        setVendedorSelecionadoNome(fullText);
        setSearchTerm(fullText);
      }
    } else if (vendedorId === 0) {
        setVendedorSelecionadoNome('');
        setSearchTerm('');
    }
  }, [vendedorId, vendedores]);


  const filteredVendedores = useMemo(() => {
    const vendedoresValidos = vendedores.filter(v => typeof v.id === 'number' && v.id > 0);

    if (!searchTerm || vendedorId > 0) return vendedoresValidos;
    
    return vendedoresValidos.filter(vendedor => 
      vendedor.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendedor.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [vendedores, searchTerm, vendedorId]);


  const handleSelectVendedor = (vendedor: Vendedor) => {
    if (typeof vendedor.id !== 'number' || vendedor.id <= 0) {
        console.error("[VendaForm] Erro: Tentativa de selecionar vendedor com ID inválido.", vendedor);
        return;
    }
    
    const fullText = `${vendedor.nome} (Comissão: ${vendedor.percentualComissao}%)`;
    
    setValue('vendedorId', vendedor.id, { shouldValidate: true });
    setVendedorSelecionadoNome(fullText);
    setSearchTerm(fullText);
    setIsDropdownOpen(false);
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setIsDropdownOpen(true);

    if (vendedorId > 0 && !vendedorSelecionadoNome.toLowerCase().includes(value.toLowerCase())) {
        setValue('vendedorId', 0, { shouldValidate: true }); 
    }
    setVendedorSelecionadoNome(value); 
  };
  
  const handleFormSubmit: SubmitHandler<VendaRequestDTO> = (data) => {
    onSubmit(data);
  };


  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-100 text-red-700 border border-red-400 rounded">
          {error}
        </div>
      )}

      {/* Seleção de Vendedor com Busca (inalterado) */}
      <div>
        <label htmlFor="vendedorId" className="block text-sm font-medium text-gray-700">Vendedor</label>
        
        <div className="relative">
          <input
            id="vendedorSearch"
            type="text"
            placeholder="Digite o nome ou email do vendedor..."
            value={searchTerm}
            onChange={handleSearchChange}
            onFocus={() => setIsDropdownOpen(true)}
            onBlur={() => {
                if(vendedorId === 0) {
                    setSearchTerm('');
                    setVendedorSelecionadoNome('');
                }
                setTimeout(() => setIsDropdownOpen(false), 200);
            }}
            className={`input-form ${errors.vendedorId ? 'border-red-500' : 'border-gray-300'}`}
          />
          <input type="hidden" {...register('vendedorId', { valueAsNumber: true })} /> 

          {isDropdownOpen && filteredVendedores.length > 0 && (
            <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded mt-1 max-h-48 overflow-y-auto shadow-lg">
              {filteredVendedores.map(v => (
                <li
                  key={v.id}
                  onMouseDown={() => handleSelectVendedor(v)} 
                  className={`p-2 cursor-pointer hover:bg-blue-100 ${v.id === vendedorId ? 'bg-blue-50 font-semibold' : ''}`}
                >
                  {v.nome} <span className="text-gray-500 text-sm">(Comissão: {v.percentualComissao}%)</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        
        {errors.vendedorId && <p className="text-xs text-red-500 mt-1">{errors.vendedorId.message}</p>}
        {vendedorId > 0 && !isDropdownOpen && searchTerm && (
            <p className="text-xs text-green-600 mt-1">Vendedor selecionado e válido: {vendedorSelecionadoNome}</p>
        )}
      </div>

      {/* Valor da Venda - COM CONTROLLER PARA FORMATO DE MOEDA */}
      <div>
        <label htmlFor="valorVenda" className="block text-sm font-medium text-gray-700">Valor da Venda (R$)</label>
        <Controller
            name="valorVenda"
            control={control}
            render={({ field }) => (
                <input
                    id="valorVenda"
                    type="text" // Tipo precisa ser text para aceitar a máscara
                    value={formatarParaMoeda(field.value)} // Formata o valor do RHF
                    onChange={(e) => {
                        // Usa a função desformatarMoeda para obter o float real (reais/centavos)
                        const numericValue = desformatarMoeda(e.target.value);
                        field.onChange(numericValue); // Define o valor numérico (float) para o RHF/Yup
                    }}
                    className={`input-form ${errors.valorVenda ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="R$ 0,00"
                />
            )}
        />
        {errors.valorVenda && <p className="text-xs text-red-500 mt-1">{errors.valorVenda.message}</p>}
      </div>

      <div className="pt-4 text-right">
        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-2 rounded shadow hover:bg-blue-600 transition disabled:bg-gray-400"
          disabled={loading}
        >
          {loading ? 'Lançando...' : 'Lançar Venda'}
        </button>
      </div>
    </form>
  );
}