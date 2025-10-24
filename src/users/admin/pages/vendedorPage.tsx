// gerar page de vendedor com informaçoes do vendedor (dados do vendedor, tempo de cadastro, qtd vendas, valor total vendido, etc e graficos de rendimento)
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { adminService } from '../services/adminService';
import { Vendedor } from '../types';
import VendedorForm from '../components/VendedorForm';
import { VendedorFormData } from '../components/VendedorForm';

const VendedorPage: React.FC = () => {
    const location = useLocation();
    const [vendedor, setVendedor] = useState<Vendedor | null>(null);
    const [editandoVendedor, setEditandoVendedor] = useState<Vendedor | null>(null);
    const [formError, setFormError] = useState<string | null>(null);
    const [formLoading, setFormLoading] = useState(false);

    const handleEditarVendedor = (vendedor: Vendedor) => {
        setEditandoVendedor(vendedor);
    };

    const handleSalvarVendedor = async (data: VendedorFormData) => {
        setFormLoading(true);
        setFormError(null);
        try {
            await adminService.editarVendedor(data);
            setEditandoVendedor(null);
        } catch (e: any) {
            const errorMsg = e.response?.data?.message || 'Erro ao editar vendedor.';
            setFormError(errorMsg);
        } finally {
            setFormLoading(false);
        }
    };

    useEffect(() => {
        if (location.state && location.state.vendedor) {
            setVendedor(location.state.vendedor);
            setEditandoVendedor(location.state.vendedor);
        }
    }, [location]);

    return (
        <div>
            {vendedor && (
                <VendedorForm
                    vendedor={editandoVendedor}
                    onEditarVendedor={handleEditarVendedor}
                    onSalvarVendedor={handleSalvarVendedor}
                    formError={formError}
                    formLoading={formLoading}
                />
            )}
        </div>
    );
};

export default VendedorPage;