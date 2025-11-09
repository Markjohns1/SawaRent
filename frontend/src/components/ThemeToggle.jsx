import { useTheme } from '../context/ThemeContext'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex items-center h-8 w-14 rounded-full transition-colors duration-200 focus:outline-none"
      style={{
        backgroundColor: theme === 'friendly' ? '#fb923c' : '#3b82f6',
      }}
      title="Toggle theme"
      aria-label="Toggle theme"
    >
      <span
        className="inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform duration-200"
        style={{
          transform: theme === 'friendly' ? 'translateX(0.375rem)' : 'translateX(1.875rem)',
        }}
      />
    </button>
  )
}
