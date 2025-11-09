import { useState } from 'react'
import { useTheme } from '../context/ThemeContext'
import api from '../services/api'

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { theme } = useTheme()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await api.post('/auth/login', { username, password })
      onLogin(response.data.user)
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300"
      style={{ backgroundColor: 'var(--theme-background)' }}
    >
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div 
              className="h-20 w-20 flex items-center justify-center text-white text-3xl font-bold"
              style={{
                backgroundColor: 'var(--theme-primary)',
                borderRadius: 'var(--theme-radius)',
              }}
            >
              PM
            </div>
          </div>
          <h2 className="text-4xl font-extrabold" style={{ color: 'var(--theme-text)' }}>
            {theme === 'friendly' ? 'Welcome Back!' : 'Property Management'}
          </h2>
          <p className="mt-3 text-lg" style={{ color: 'var(--theme-text-secondary)' }}>
            {theme === 'friendly' ? 'Sign in to manage your properties' : 'Sign in to your account'}
          </p>
        </div>
        <form className="mt-8 space-y-6 theme-card p-8" onSubmit={handleSubmit}>
          {error && (
            <div 
              className="px-4 py-3 border-2"
              style={{
                backgroundColor: theme === 'friendly' ? '#fef2f2' : '#fee2e2',
                borderColor: theme === 'friendly' ? '#f87171' : '#dc2626',
                color: theme === 'friendly' ? '#991b1b' : '#7f1d1d',
                borderRadius: 'var(--theme-radius)',
              }}
            >
              {error}
            </div>
          )}
          <div className="space-y-5">
            <div>
              <label htmlFor="username" className="block text-sm font-medium mb-2" style={{ color: 'var(--theme-text)' }}>
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none relative block w-full px-4 py-3 border-2 focus:outline-none focus:ring-0 transition-all"
                style={{
                  borderColor: 'var(--theme-border)',
                  borderRadius: 'var(--theme-radius)',
                  color: 'var(--theme-text)',
                }}
                placeholder={theme === 'friendly' ? 'Enter your username' : 'Enter your username'}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2" style={{ color: 'var(--theme-text)' }}>
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none relative block w-full px-4 py-3 border-2 focus:outline-none focus:ring-0 transition-all"
                style={{
                  borderColor: 'var(--theme-border)',
                  borderRadius: 'var(--theme-radius)',
                  color: 'var(--theme-text)',
                }}
                placeholder={theme === 'friendly' ? 'Enter your password' : 'Enter your password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="theme-button w-full py-4 font-semibold text-lg disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </div>
        </form>
        <div className="text-center mt-6">
          <p className="text-sm" style={{ color: 'var(--theme-text-secondary)' }}>
            {theme === 'friendly' ? 'Demo: admin/admin123 or caretaker/care123' : 'Demo: admin/admin123 or caretaker/care123'}
          </p>
        </div>
      </div>
    </div>
  )
}
