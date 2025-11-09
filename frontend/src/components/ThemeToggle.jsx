import { useTheme } from '../context/ThemeContext'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  const getThemeIcon = () => {
    switch(theme) {
      case 'dark':
        return <i className="fas fa-moon"></i>
      case 'friendly':
        return <i className="fas fa-sun"></i>
      default:
        return <i className="fas fa-circle-half-stroke"></i>
    }
  }

  const getThemeColor = () => {
    switch(theme) {
      case 'dark':
        return '#1e293b'
      case 'friendly':
        return '#f97316'
      default:
        return '#3b82f6'
    }
  }

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center justify-center h-10 w-10 rounded-lg transition-all duration-200 focus:outline-none hover:opacity-80"
      style={{
        backgroundColor: getThemeColor(),
        color: 'white',
      }}
      title={`Current theme: ${theme}`}
      aria-label="Toggle theme"
    >
      {getThemeIcon()}
    </button>
  )
}
