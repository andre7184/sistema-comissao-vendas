// src/utils/formatters.ts

export function formatarCnpj(valor: string): string {
    // 1. Remove qualquer caractere não numérico
    const numeros = valor.replace(/\D/g, '');

    // 2. Aplica a máscara: XX.XXX.XXX/XXXX-XX
    return numeros
        .replace(/^(\d{2})(\d)/, '$1.$2')
        .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/\.(\d{3})(\d)/, '.$1/$2')
        .replace(/(\d{4})(\d)/, '$1-$2')
        .slice(0, 18); // Limita o tamanho máximo do CNPJ formatado
}

// NOVO: Função auxiliar para formatar o valor como moeda R$
export const formatarParaMoeda = (valor: string | number | undefined): string => {
    if (valor === undefined || valor === null) return '';
    
    // Converte para string e limpa todos os caracteres exceto dígitos
    const numericValue = String(valor).replace(/\D/g, '');
    if (!numericValue) return '';

    // Converte para centavos (número inteiro)
    const intValue = parseInt(numericValue, 10);
    // Converte para reais (dividindo por 100)
    const floatValue = intValue / 100;

    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(floatValue);
};

// NOVO: Função auxiliar para remover a formatação e obter o valor numérico (float)
export const desformatarMoeda = (valorFormatado: string): number => {
    // Remove R$, pontos e substitui vírgula por ponto (para JS)
    const valor = valorFormatado
        .replace(/[R$\s.]/g, '')
        .replace(',', '.');
    return parseFloat(valor) || 0;
};