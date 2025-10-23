// src/utils/formatters.ts (ou adicione no EmpresasPage.tsx)

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