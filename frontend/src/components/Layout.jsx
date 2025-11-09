import { Link, useLocation } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'
import { useTheme } from '../context/ThemeContext'
import { useState, useEffect } from 'react'

const formatRole = (role) => {
  const roleMap = {
    'super_admin': 'Super Admin',
    'caretaker': 'Caretaker', 
    'tenant': 'Tenant'
  }
  return roleMap[role] || role
}

// Professional Theme Toggle Component
const ProfessionalThemeToggle = () => {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className={`relative inline-flex h-7 w-14 items-center rounded-full transition-all duration-300 ease-in-out ${
        theme === 'dark' 
          ? 'bg-gradient-to-r from-blue-500 to-purple-600' 
          : 'bg-gradient-to-r from-gray-300 to-gray-400'
      } shadow-lg hover:shadow-xl transform hover:scale-105`}
    >
      {/* Track */}
      <span className="sr-only">Toggle theme</span>
      
      {/* Thumb with icons */}
      <span
        className={`inline-flex h-6 w-6 transform rounded-full bg-white shadow-lg transition-all duration-300 ease-in-out flex items-center justify-center ${
          theme === 'dark' ? 'translate-x-7' : 'translate-x-1'
        }`}
      >
        {theme === 'dark' ? (
          // Moon icon for dark mode
          <svg className="w-3 h-3 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        ) : (
          // Sun icon for light mode
          <svg className="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
          </svg>
        )}
      </span>
    </button>
  )
}

// Enhanced icon mapping with better SVG paths
const getNavIcon = (iconName, isActive, theme) => {
  const baseClasses = `w-5 h-5 transition-colors duration-200 ${
    isActive 
      ? theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
      : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
  }`

  const icons = {
    dashboard: (
      <svg className={baseClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10" />
      </svg>
    ),
    tenants: (
      <svg className={baseClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    payments: (
      <svg className={baseClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    messaging: (
      <svg className={baseClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    users: (
      <svg className={baseClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    )
  }

  return icons[iconName] || icons.dashboard
}

export default function Layout({ user, onLogout, children }) {
  const location = useLocation()
  const { theme } = useTheme()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location.pathname])

  const isActive = (path) => location.pathname === path

  const navItems = [
    { 
      path: '/', 
      label: 'Dashboard', 
      icon: 'dashboard'
    },
    { 
      path: '/tenants', 
      label: 'Tenants', 
      icon: 'tenants'
    },
    { 
      path: '/payments', 
      label: 'Payments', 
      icon: 'payments'
    },
    { 
      path: '/messaging', 
      label: 'Messaging', 
      icon: 'messaging'
    },
  ]

  if (user.role === 'super_admin') {
    navItems.push({ 
      path: '/users', 
      label: 'Users', 
      icon: 'users'
    })
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <nav className={`sticky top-0 z-50 transition-colors duration-300 ${
        theme === 'dark' 
          ? 'bg-gray-800 border-b border-gray-700' 
          : 'bg-white border-b border-gray-200 shadow-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            
            {/* Left Side - Logo & Navigation */}
            <div className="flex items-center space-x-8">
              <Link to="/" className="flex items-center space-x-3 group">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${
                  theme === 'dark' 
                    ? 'bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg' 
                    : 'bg-gradient-to-br from-blue-600 to-blue-700 shadow-md'
                }`}>
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <span className={`text-xl font-bold bg-gradient-to-r ${
                  theme === 'dark' 
                    ? 'from-blue-400 to-purple-400' 
                    : 'from-blue-600 to-purple-600'
                } bg-clip-text text-transparent`}>
                  RentFlow
                </span>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center space-x-1">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-2.5 px-4 py-2.5 transition-all duration-200 font-medium rounded-lg mx-1 relative group ${
                      isActive(item.path)
                        ? theme === 'dark'
                          ? 'bg-gray-700 text-blue-400 shadow-md' 
                          : 'bg-blue-50 text-blue-600 shadow-sm'
                        : theme === 'dark'
                          ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    {getNavIcon(item.icon, isActive(item.path), theme)}
                    <span className="font-semibold">{item.label}</span>
                    
                    {/* Active indicator */}
                    {isActive(item.path) && (
                      <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full ${
                        theme === 'dark' ? 'bg-blue-400' : 'bg-blue-600'
                      }`}></div>
                    )}
                  </Link>
                ))}
              </div>
            </div>

            {/* Right Side - Desktop */}
            <div className="hidden lg:flex items-center space-x-6">
              <ProfessionalThemeToggle />
              
              {/* User Profile */}
              <div className="flex items-center space-x-4 pl-4 border-l border-gray-300 dark:border-gray-600">
                <div className="flex items-center space-x-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm transition-all duration-300 hover:scale-105 ${
                    theme === 'dark' 
                      ? 'bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg' 
                      : 'bg-gradient-to-br from-blue-600 to-blue-700 shadow-md'
                  }`}>
                    {(user.full_name || user.username).charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className={`text-sm font-semibold ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {user.full_name || user.username}
                    </span>
                    <span className={`text-xs font-medium ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {formatRole(user.role)}
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={onLogout}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex items-center space-x-2 ${
                    theme === 'dark'
                      ? 'text-gray-300 hover:text-white hover:bg-gray-700 border border-gray-600 hover:border-gray-500'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Logout</span>
                </button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex lg:hidden items-center space-x-4">
              <ProfessionalThemeToggle />
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`p-2.5 rounded-xl transition-all duration-200 ${
                  theme === 'dark' 
                    ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className={`lg:hidden border-t ${
              theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <div className="px-4 py-4 space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                      isActive(item.path)
                        ? theme === 'dark'
                          ? 'bg-gray-700 text-blue-400' 
                          : 'bg-blue-50 text-blue-600'
                        : theme === 'dark'
                          ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {getNavIcon(item.icon, isActive(item.path), theme)}
                    <span className="font-semibold">{item.label}</span>
                  </Link>
                ))}
                
                {/* Mobile User Info */}
                <div className={`pt-4 mt-4 border-t ${
                  theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                }`}>
                  <div className="flex items-center space-x-3 p-3">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold ${
                      theme === 'dark' 
                        ? 'bg-gradient-to-br from-blue-500 to-purple-600' 
                        : 'bg-gradient-to-br from-blue-600 to-blue-700'
                    }`}>
                      {(user.full_name || user.username).charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {user.full_name || user.username}
                      </p>
                      <p className={`text-xs font-medium ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {formatRole(user.role)}
                      </p>
                    </div>
                    <button
                      onClick={onLogout}
                      className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex items-center space-x-2 ${
                        theme === 'dark'
                          ? 'text-gray-300 hover:text-white hover:bg-gray-700 border border-gray-600'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-gray-300'
                      }`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}