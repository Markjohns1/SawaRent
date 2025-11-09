import { useState, useEffect } from 'react'
import { useTheme } from '../context/ThemeContext'
import api from '../services/api'

export default function Users({ currentUser }) {
  const [users, setUsers] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const { theme } = useTheme()
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'caretaker',
    phone: '',
    full_name: ''
  })

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await api.get('/auth/users')
      setUsers(response.data.users)
    } catch (error) {
      console.error('Failed to fetch users:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingUser) {
        await api.put(`/auth/users/${editingUser.id}`, formData)
      } else {
        await api.post('/auth/register', formData)
      }
      setShowModal(false)
      setEditingUser(null)
      setFormData({
        username: '',
        email: '',
        password: '',
        role: 'caretaker',
        phone: '',
        full_name: ''
      })
      fetchUsers()
    } catch (error) {
      console.error('Failed to save user:', error)
      alert(error.response?.data?.error || 'Failed to save user')
    }
  }

  const handleEdit = (user) => {
    setEditingUser(user)
    setFormData({
      username: user.username,
      email: user.email,
      password: '',
      role: user.role,
      phone: user.phone || '',
      full_name: user.full_name || ''
    })
    setShowModal(true)
  }

  const handleToggleActive = async (userId) => {
    try {
      await api.post(`/auth/users/${userId}/toggle-active`)
      fetchUsers()
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to update user status')
    }
  }

  const getRoleBadgeColor = (role) => {
    switch(role) {
      case 'super_admin':
        return { bg: '#dc2626', label: 'Admin' }
      case 'caretaker':
        return { bg: '#3b82f6', label: 'Caretaker' }
      case 'tenant':
        return { bg: '#6b7280', label: 'Tenant' }
      default:
        return { bg: '#9ca3af', label: role }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold" style={{ color: 'var(--theme-text)' }}>
          <i className="fas fa-users mr-3"></i>
          User Management
        </h1>
        <button
          onClick={() => {
            setEditingUser(null)
            setFormData({
              username: '',
              email: '',
              password: '',
              role: 'caretaker',
              phone: '',
              full_name: ''
            })
            setShowModal(true)
          }}
          className="theme-button px-4 py-2 font-medium flex items-center space-x-2"
        >
          <i className="fas fa-plus"></i>
          <span>Add User</span>
        </button>
      </div>

      <div className="theme-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y" style={{ borderColor: 'var(--theme-border-light)' }}>
            <thead>
              <tr style={{ backgroundColor: theme === 'friendly' ? '#fed7aa' : '#e2e8f0' }}>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase" style={{ color: 'var(--theme-text)' }}>User</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase" style={{ color: 'var(--theme-text)' }}>Contact</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase" style={{ color: 'var(--theme-text)' }}>Role</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase" style={{ color: 'var(--theme-text)' }}>Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase" style={{ color: 'var(--theme-text)' }}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--theme-border-light)' }}>
              {users.map((user) => {
                const roleBadge = getRoleBadgeColor(user.role)
                return (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-full flex items-center justify-center text-white font-semibold" style={{ backgroundColor: 'var(--theme-primary)' }}>
                          {user.full_name ? user.full_name.charAt(0).toUpperCase() : user.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold" style={{ color: 'var(--theme-text)' }}>{user.full_name || user.username}</div>
                          <div className="text-sm" style={{ color: 'var(--theme-text-secondary)' }}>@{user.username}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm" style={{ color: 'var(--theme-text)' }}>{user.email}</div>
                      <div className="text-sm" style={{ color: 'var(--theme-text-secondary)' }}>{user.phone || '-'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 text-xs font-semibold text-white rounded-full" style={{ backgroundColor: roleBadge.bg }}>
                        {roleBadge.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span 
                        className="px-3 py-1 text-xs font-semibold text-white rounded-full"
                        style={{ backgroundColor: user.is_active ? '#10b981' : '#9ca3af' }}
                      >
                        {user.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(user)}
                          className="text-sm px-3 py-1 rounded hover:opacity-80 transition-opacity"
                          style={{ backgroundColor: 'var(--theme-primary)', color: 'white' }}
                        >
                          <i className="fas fa-edit mr-1"></i>
                          Edit
                        </button>
                        {currentUser?.id !== user.id && (
                          <button
                            onClick={() => handleToggleActive(user.id)}
                            className="text-sm px-3 py-1 rounded hover:opacity-80 transition-opacity"
                            style={{ backgroundColor: user.is_active ? '#6b7280' : '#10b981', color: 'white' }}
                          >
                            <i className={`fas fa-${user.is_active ? 'ban' : 'check'} mr-1`}></i>
                            {user.is_active ? 'Deactivate' : 'Activate'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="theme-card max-w-md w-full max-h-screen overflow-y-auto p-6">
            <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--theme-text)' }}>
              {editingUser ? 'Edit User' : 'Add New User'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--theme-text)' }}>Full Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border-2 focus:outline-none transition-all"
                  style={{
                    borderColor: 'var(--theme-border)',
                    borderRadius: 'var(--theme-radius)',
                    color: 'var(--theme-text)',
                  }}
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--theme-text)' }}>Username</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border-2 focus:outline-none transition-all"
                  style={{
                    borderColor: 'var(--theme-border)',
                    borderRadius: 'var(--theme-radius)',
                    color: 'var(--theme-text)',
                  }}
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--theme-text)' }}>Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-3 border-2 focus:outline-none transition-all"
                  style={{
                    borderColor: 'var(--theme-border)',
                    borderRadius: 'var(--theme-radius)',
                    color: 'var(--theme-text)',
                  }}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--theme-text)' }}>Phone</label>
                <input
                  type="tel"
                  className="w-full px-4 py-3 border-2 focus:outline-none transition-all"
                  style={{
                    borderColor: 'var(--theme-border)',
                    borderRadius: 'var(--theme-radius)',
                    color: 'var(--theme-text)',
                  }}
                  placeholder="+254712345678"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--theme-text)' }}>Role</label>
                <select
                  className="w-full px-4 py-3 border-2 focus:outline-none transition-all"
                  style={{
                    borderColor: 'var(--theme-border)',
                    borderRadius: 'var(--theme-radius)',
                    color: 'var(--theme-text)',
                  }}
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  required
                >
                  <option value="caretaker">Caretaker</option>
                  <option value="tenant">Tenant</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--theme-text)' }}>
                  Password {editingUser && '(leave blank to keep current)'}
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-3 border-2 focus:outline-none transition-all"
                  style={{
                    borderColor: 'var(--theme-border)',
                    borderRadius: 'var(--theme-radius)',
                    color: 'var(--theme-text)',
                  }}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required={!editingUser}
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 theme-button px-4 py-3 font-medium"
                >
                  <i className="fas fa-save mr-2"></i>
                  {editingUser ? 'Update User' : 'Create User'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    setEditingUser(null)
                  }}
                  className="flex-1 px-4 py-3 font-medium transition-all"
                  style={{
                    backgroundColor: '#e5e7eb',
                    color: '#374151',
                    borderRadius: 'var(--theme-radius)',
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

