export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        friendly: {
          primary: '#f97316',
          secondary: '#fb923c',
          accent: '#fbbf24',
          success: '#34d399',
          warning: '#fbbf24',
          danger: '#f87171',
          background: '#fff7ed',
          surface: '#ffffff',
          text: '#78350f',
          textSecondary: '#9a3412',
        },
        formal: {
          primary: '#1e40af',
          secondary: '#3b82f6',
          accent: '#60a5fa',
          success: '#059669',
          warning: '#d97706',
          danger: '#dc2626',
          background: '#f8fafc',
          surface: '#ffffff',
          text: '#1e293b',
          textSecondary: '#475569',
        }
      },
      borderRadius: {
        'friendly': '1.5rem',
        'formal': '0.375rem',
      },
      fontFamily: {
        'friendly': ['Quicksand', 'Rounded', 'sans-serif'],
        'formal': ['Inter', 'Helvetica', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        'friendly': '0 10px 25px -5px rgba(249, 115, 22, 0.15), 0 8px 10px -6px rgba(251, 146, 60, 0.1)',
        'formal': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
      }
    },
  },
  plugins: [],
}
