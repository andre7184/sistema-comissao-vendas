/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Sua cor principal (Institucional) - Substitui o blue-600/700
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb', // Cor principal de botões
          700: '#1d4ed8', // Hover
          900: '#1e3a8a', // Sidebar / Textos fortes
        },
        // Sua cor de destaque (Ações de dinheiro/sucesso) - Substitui o green-600
        accent: {
          500: '#10b981',
          600: '#059669',
        },
        // Fundo da aplicação (Evite branco puro #ffffff em tudo)
        surface: '#f8fafc', // Slate-50
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Recomendado: Fonte padrão de Dashboards
      }
    },
  },
  plugins: [],
}