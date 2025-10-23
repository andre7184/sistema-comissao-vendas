// src/users/admin/components/VendaForm.tsx

import type { Vendedor, VendaRequestDTO } from '../types';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// Schema de validação
const schema = yup.object().shape({
  vendedorId: yup.number()
    .required('Você deve selecionar um vendedor')
    .min(1, 'Seleção de vendedor inválida')
    .typeError('Você deve selecionar um vendedor'),
  valorVenda: yup.number()
    .required('O valor da venda é obrigatório')
    .moreThan(0, 'O valor da venda deve ser maior que zero')
    .typeError('O valor deve ser um número (use . para decimais)'),
});

interface VendaFormProps {
  // O formulário precisa da lista de vendedores para popular o dropdown
  vendedores: Vendedor[];
  onSubmit: (data: VendaRequestDTO) => Promise<void>; 
  loading: boolean;
  error?: string | null;
}

export default function VendaForm({ vendedores, onSubmit, loading, error }: VendaFormProps) {
  
  const defaultValues: VendaRequestDTO = {
    vendedorId: 0, // 0 ou um valor default
    valorVenda: 0.0,
  };

  const { register, handleSubmit, control, formState: { errors } } = useForm<VendaRequestDTO>({
    resolver: yupResolver(schema),
    defaultValues: defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-100 text-red-700 border border-red-400 rounded">
          {error}
        </div>
      )}

      {/* Seleção de Vendedor */}
      <div>
        <label htmlFor="vendedorId" className="block text-sm font-medium text-gray-700">Vendedor</label>
        <Controller
          name="vendedorId"
          control={control}
          render={({ field }) => (
            <select
              id="vendedorId"
              {...field}
              // Converte o valor do campo (string) para número
              onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
              className={`input-form ${errors.vendedorId ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="0" disabled>Selecione um vendedor...</option>
              {vendedores.map(v => (
                <option key={v.id} value={v.id}>
                  {v.nome} (Comissão: {v.percentualComissao}%)
                </option>
              ))}
            </select>
          )}
        />
        {errors.vendedorId && <p className="text-xs text-red-500 mt-1">{errors.vendedorId.message}</p>}
      </div>

      {/* Valor da Venda */}
      <div>
        <label htmlFor="valorVenda" className="block text-sm font-medium text-gray-700">Valor da Venda (R$)</label>
        <input
          id="valorVenda"
          type="number"
          step="0.01"
          {...register('valorVenda')}
          className={`input-form ${errors.valorVenda ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="Ex: 1500.75"
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