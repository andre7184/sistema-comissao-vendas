/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // COR PRIMÁRIA (Laranja - Baseado em #F97316)
        // Usado para: Botões principais, Menu Ativo, Destaques
        primary: {
          50: '#fff7ed',  // Fundo muito claro
          100: '#ffedd5', // Fundo claro
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316', // <--- SUA COR BASE
          600: '#ea580c', // Hover
          700: '#c2410c', // Active
          800: '#9a3412',
          900: '#7c2d12',
        },
        
        // COR SECUNDÁRIA (Azul - Baseado em #0a58ca)
        // Usado para: Links, Informações, Botões secundários
        secondary: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#0a58ca', // <--- SUA COR BASE (Ajustada para ser o tom forte)
          800: '#1e40af',
          900: '#1e3a8a',
        },

        // COR NEUTRA (Cinza - Baseado em #606060)
        // Usado para: Textos, Bordas, Fundos da página
        neutral: {
          50: '#f8fafc', // Fundo da página (Surface)
          100: '#f1f5f9',
          200: '#e2e8f0', // Bordas
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#606060', // <--- SUA COR BASE (Texto padrão)
          700: '#475569', // Títulos
          800: '#334155',
          900: '#0f172a',
        },
        
        // Alias para facilitar o uso semântico
        surface: '#f8fafc', // Cor de fundo geral do sistema
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}