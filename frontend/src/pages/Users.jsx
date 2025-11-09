import { useState, useEffect } from 'react'
import { useTheme } from '../context/ThemeContext'

const api = {
  get: async () => {
    await new Promise(resolve => setTimeout(resolve, 300))
    return {
      data: {
        users: [
          {
            id: 1,
            username: 'admin',
            email: 'admin@sawarent.com',
            phone: '+254700000000',
            full_name: 'System Admin',
            role: 'super_admin',
            is_active: true
          },
          {
            id: 2,
            username: 'James',
            email: 'james@gmail.com',
            phone: '0799355773',
            full_name: 'James Njuguna',
            role: 'super_admin',
            is_active: true
          },
          {
            id: 3,
            username: 'John',
            email: 'johnmarkoguta@gmail.com',
            phone: '0799366734',
            full_name: 'John Mark',
            role: 'super_admin',
            is_active: true
          },
          {
            id: 4,
            username: 'Jane',
            email: 'jane@gmail.com',
            phone: '0788993345',
            full_name: 'Jane M',
            role: 'tenant',
            is_active: false
          }
        ]
      }
    }
  },
  post: async () => {
    await new Promise(resolve => setTimeout(resolve, 300))
    return { data: { success: true } }
  },
  put: async () => {
    await new Promise(resolve => setTimeout(resolve, 300))
    return { data: { success: true } }
  },
  delete: async () => {
    await new Promise(resolve => setTimeout(resolve, 300))
    return { data: { success: true } }
  }
}

export default function Users() {
  const [users, setUsers] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterRole, setFilterRole] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const currentUser = { id: 1 }
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'caretaker',
    phone: '',
    full_name: ''
  })
  const { theme } = useTheme()

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

  const filteredUsers = users.filter(user => {
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'active' && user.is_active) ||
      (filterStatus === 'inactive' && !user.is_active)
    
    const matchesRole = filterRole === 'all' || user.role === filterRole
    
    const matchesSearch = searchQuery === '' || 
      user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone?.includes(searchQuery)
    
    return matchesStatus && matchesRole && matchesSearch
  })

  const handleSubmit = async () => {
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
      alert('Failed to update user status')
    }
  }

  const handleDelete = async (userId, userName) => {
    if (!window.confirm(`Delete user "${userName}"?`)) return
    
    try {
      await api.delete(`/auth/users/${userId}`)
      fetchUsers()
    } catch (error) {
      alert('Failed to delete user')
    }
  }

  const getRoleBadge = (role) => {
    switch(role) {
      case 'super_admin':
        return { label: 'Admin', color: 'bg-red-500' }
      case 'caretaker':
        return { label: 'Caretaker', color: 'bg-blue-500' }
      case 'tenant':
        return { label: 'Tenant', color: 'bg-gray-500' }
      default:
        return { label: role, color: 'bg-gray-400' }
    }
  }

  return (
    <div className="min-h-screen p-4 sm:p-6" style={{ backgroundColor: 'var(--theme-background)' }}>
      <div className="max-w-5xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: 'var(--theme-text)' }}>
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
            className="w-full sm:w-auto theme-button px-6 py-2.5 rounded-lg font-medium transition-colors"
          >
            + Add User
          </button>
        </div>

        {/* Filters */}
        <div className="theme-card p-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
            <input
              type="text"
              placeholder="Search users..."
              className="w-full px-4 py-2.5 border-2 focus:outline-none transition-all"
              style={{
                borderColor: 'var(--theme-border)',
                borderRadius: 'var(--theme-radius)',
                color: 'var(--theme-text)',
                backgroundColor: 'var(--theme-surface)'
              }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <select
              className="w-full px-4 py-2.5 border-2 focus:outline-none transition-all"
              style={{
                borderColor: 'var(--theme-border)',
                borderRadius: 'var(--theme-radius)',
                color: 'var(--theme-text)',
                backgroundColor: 'var(--theme-surface)'
              }}
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <select
              className="w-full px-4 py-2.5 border-2 focus:outline-none transition-all"
              style={{
                borderColor: 'var(--theme-border)',
                borderRadius: 'var(--theme-radius)',
                color: 'var(--theme-text)',
                backgroundColor: 'var(--theme-surface)'
              }}
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
            >
              <option value="all">All Roles</option>
              <option value="super_admin">Admin</option>
              <option value="caretaker">Caretaker</option>
              <option value="tenant">Tenant</option>
            </select>
          </div>
          <p className="text-xs" style={{ color: 'var(--theme-text-secondary)' }}>
            Showing {filteredUsers.length} of {users.length} users
          </p>
        </div>

        {/* User Cards */}
        <div className="space-y-3">
          {filteredUsers.map((user) => {
            const roleBadge = getRoleBadge(user.role)
            return (
              <div key={user.id} className="theme-card p-4 hover:shadow-lg transition-shadow">
                {/* Header Row */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg truncate" style={{ color: 'var(--theme-text)' }}>{user.full_name}</h3>
                    <p className="text-sm" style={{ color: 'var(--theme-text-secondary)' }}>@{user.username}</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0 ml-2">
                    <span className={`px-3 py-1 text-xs font-semibold text-white rounded-full ${roleBadge.color}`}>
                      {roleBadge.label}
                    </span>
                    <span 
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        user.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {user.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex items-center gap-2" style={{ color: 'var(--theme-text)' }}>
                    <svg className="w-4 h-4" style={{ color: 'var(--theme-text-secondary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="truncate">{user.email}</span>
                  </div>
                  <div className="flex items-center gap-2" style={{ color: 'var(--theme-text)' }}>
                    <svg className="w-4 h-4" style={{ color: 'var(--theme-text-secondary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>{user.phone}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(user)}
                    className="flex items-center justify-center w-10 h-10 rounded-lg transition-colors"
                    style={{
                      backgroundColor: 'var(--theme-background)',
                      color: 'var(--theme-primary)',
                      border: '1px solid var(--theme-border)'
                    }}
                    title="Edit"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  
                  {currentUser?.id !== user.id && (
                    <>
                      <button
                        onClick={() => handleToggleActive(user.id)}
                        className={`flex items-center justify-center w-10 h-10 rounded-lg transition-colors ${
                          user.is_active 
                            ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' 
                            : 'bg-green-50 text-green-600 hover:bg-green-100'
                        }`}
                        title={user.is_active ? 'Deactivate' : 'Activate'}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v10m4.5-8.5a8.5 8.5 0 1 1-9 0" />
                        </svg>
                      </button>
                      
                      <button
                        onClick={() => handleDelete(user.id, user.full_name || user.username)}
                        className="flex items-center justify-center w-10 h-10 rounded-lg transition-colors"
                        style={{
                          backgroundColor: 'var(--theme-background)',
                          color: 'var(--theme-danger)',
                          border: '1px solid var(--theme-border)'
                        }}
                        title="Delete"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {filteredUsers.length === 0 && (
          <div className="theme-card p-12 text-center">
            <svg className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--theme-text-secondary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className="text-lg font-medium mb-1" style={{ color: 'var(--theme-text)' }}>No users found</p>
            <p className="text-sm" style={{ color: 'var(--theme-text-secondary)' }}>Try adjusting your search filters</p>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="theme-card max-w-md w-full max-h-[90vh] overflow-y-auto p-6">
              <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--theme-text)' }}>
                {editingUser ? 'Edit User' : 'Add New User'}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--theme-text)' }}>Full Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 border-2 focus:outline-none transition-all"
                    style={{
                      borderColor: 'var(--theme-border)',
                      borderRadius: 'var(--theme-radius)',
                      color: 'var(--theme-text)',
                      backgroundColor: 'var(--theme-surface)'
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
                    className="w-full px-4 py-2.5 border-2 focus:outline-none transition-all"
                    style={{
                      borderColor: 'var(--theme-border)',
                      borderRadius: 'var(--theme-radius)',
                      color: 'var(--theme-text)',
                      backgroundColor: 'var(--theme-surface)'
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
                    className="w-full px-4 py-2.5 border-2 focus:outline-none transition-all"
                    style={{
                      borderColor: 'var(--theme-border)',
                      borderRadius: 'var(--theme-radius)',
                      color: 'var(--theme-text)',
                      backgroundColor: 'var(--theme-surface)'
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
                    className="w-full px-4 py-2.5 border-2 focus:outline-none transition-all"
                    style={{
                      borderColor: 'var(--theme-border)',
                      borderRadius: 'var(--theme-radius)',
                      color: 'var(--theme-text)',
                      backgroundColor: 'var(--theme-surface)'
                    }}
                    placeholder="+254712345678"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--theme-text)' }}>Role</label>
                  <select
                    className="w-full px-4 py-2.5 border-2 focus:outline-none transition-all"
                    style={{
                      borderColor: 'var(--theme-border)',
                      borderRadius: 'var(--theme-radius)',
                      color: 'var(--theme-text)',
                      backgroundColor: 'var(--theme-surface)'
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
                    className="w-full px-4 py-2.5 border-2 focus:outline-none transition-all"
                    style={{
                      borderColor: 'var(--theme-border)',
                      borderRadius: 'var(--theme-radius)',
                      color: 'var(--theme-text)',
                      backgroundColor: 'var(--theme-surface)'
                    }}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required={!editingUser}
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleSubmit}
                    className="flex-1 theme-button py-3 rounded-lg font-medium transition-colors"
                  >
                    {editingUser ? 'Update' : 'Create'}
                  </button>
                  <button
                    onClick={() => {
                      setShowModal(false)
                      setEditingUser(null)
                    }}
                    className="flex-1 py-3 rounded-lg font-medium transition-colors"
                    style={{
                      backgroundColor: 'var(--theme-background)',
                      color: 'var(--theme-text)',
                      border: '1px solid var(--theme-border)'
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}