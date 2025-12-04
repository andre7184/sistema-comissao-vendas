/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // 1. LARANJA (Sua cor Principal / Brand)
        // Usada para: Botões, Sidebar ativa, Ícones, Links
        primary: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316', // Laranja vibrante
          600: '#ea580c', // Hover
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        
        // 2. AZUL (Apenas para detalhes sutis)
        // Usada para: Bordas finas, linhas de separação, focos de input
        secondary: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#0a58ca',
          800: '#1e40af',
          900: '#1e3a8a',
        },

        // 3. CINZA (Textos)
        neutral: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0', // Bom para bordas claras
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b', // Texto secundário
          600: '#475569', // Texto padrão (ajustado para ser legível)
          700: '#334155', // Títulos
          800: '#1e293b',
          900: '#0f172a', // Fundo Dark profundo
        },
        
        // --- TRUQUE DE COMPATIBILIDADE ---
        // Agora 'brand' aponta para o LARANJA.
        // Onde estiver escrito 'bg-brand-600' no seu código antigo, ficará LARANJA.
        brand: {
          50: '#fff7ed',  // primary-50
          100: '#ffedd5', // primary-100
          500: '#f97316', // primary-500
          600: '#ea580c', // primary-600 (Cor principal antiga vira Laranja escuro)
          700: '#c2410c', // primary-700
          900: '#7c2d12', // primary-900
        },

        // Cores específicas para Dark Mode
        dark: {
            bg: '#0f172a',      // Fundo Slate 900
            surface: '#1e293b', // Cards Slate 800
            border: '#334155',  // Bordas Slate 700
            text: '#f1f5f9'     // Texto quase branco
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}