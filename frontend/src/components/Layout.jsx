import { Link, useLocation } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'
import { useTheme } from '../context/ThemeContext'

export default function Layout({ user, onLogout, children }) {
  const location = useLocation()
  const { theme } = useTheme()

  const isActive = (path) => location.pathname === path

  return (
    <div className="min-h-screen transition-colors duration-300" style={{ backgroundColor: 'var(--theme-background)' }}>
      <nav className="theme-card mb-0" style={{ borderRadius: '0', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex space-x-1 md:space-x-4">
              <Link
                to="/"
                className={`inline-flex items-center px-3 py-2 text-sm font-medium transition-all duration-200 ${
                  isActive('/')
                    ? theme === 'friendly'
                      ? 'text-friendly-primary border-b-4 border-friendly-primary'
                      : 'text-formal-primary border-b-4 border-formal-primary'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span className="hidden md:inline">Dashboard</span>
              </Link>
              <Link
                to="/tenants"
                className={`inline-flex items-center px-3 py-2 text-sm font-medium transition-all duration-200 ${
                  isActive('/tenants')
                    ? theme === 'friendly'
                      ? 'text-friendly-primary border-b-4 border-friendly-primary'
                      : 'text-formal-primary border-b-4 border-formal-primary'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="hidden md:inline">Tenants</span>
              </Link>
              <Link
                to="/payments"
                className={`inline-flex items-center px-3 py-2 text-sm font-medium transition-all duration-200 ${
                  isActive('/payments')
                    ? theme === 'friendly'
                      ? 'text-friendly-primary border-b-4 border-friendly-primary'
                      : 'text-formal-primary border-b-4 border-formal-primary'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="hidden md:inline">Payments</span>
              </Link>
              <Link
                to="/messaging"
                className={`inline-flex items-center px-3 py-2 text-sm font-medium transition-all duration-200 ${
                  isActive('/messaging')
                    ? theme === 'friendly'
                      ? 'text-friendly-primary border-b-4 border-friendly-primary'
                      : 'text-formal-primary border-b-4 border-formal-primary'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                <span className="hidden md:inline">Messaging</span>
              </Link>
            </div>
            <div className="flex items-center space-x-3">
              <ThemeToggle />
              <div className="hidden md:flex items-center space-x-3 border-l pl-3" style={{ borderColor: 'var(--theme-text-secondary)' }}>
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-full flex items-center justify-center text-white font-semibold" style={{ backgroundColor: 'var(--theme-primary)' }}>
                    {(user.full_name || user.username).charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium" style={{ color: 'var(--theme-text)' }}>{user.full_name || user.username}</span>
                    <span className="text-xs" style={{ color: 'var(--theme-text-secondary)' }}>{user.role}</span>
                  </div>
                </div>
                <button
                  onClick={onLogout}
                  className="text-sm px-3 py-1.5 rounded transition-colors duration-200"
                  style={{
                    backgroundColor: theme === 'friendly' ? '#fed7aa' : '#e2e8f0',
                    color: 'var(--theme-text)',
                    borderRadius: 'var(--theme-radius)',
                  }}
                >
                  Logout
                </button>
              </div>
              <button
                onClick={onLogout}
                className="md:hidden text-sm px-2 py-1 rounded"
                style={{
                  backgroundColor: theme === 'friendly' ? '#fed7aa' : '#e2e8f0',
                  color: 'var(--theme-text)',
                }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}
