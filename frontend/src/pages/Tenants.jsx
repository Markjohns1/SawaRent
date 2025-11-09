import { useState, useEffect } from 'react'
import { useTheme } from '../context/ThemeContext'
import api from '../services/api'

export default function Tenants() {
  const [tenants, setTenants] = useState([])
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const { theme } = useTheme()
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    email: '',
    unit_number: '',
    expected_rent: '',
    deposit_amount: '',
    lease_start_date: '',
    lease_end_date: '',
    notes: ''
  })

  useEffect(() => {
    fetchTenants()
  }, [search])

  const fetchTenants = async () => {
    try {
      const response = await api.get(`/tenants?search=${search}`)
      setTenants(response.data.tenants)
    } catch (error) {
      console.error('Failed to fetch tenants:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post('/tenants', formData)
      setShowModal(false)
      setFormData({
        full_name: '',
        phone: '',
        email: '',
        unit_number: '',
        expected_rent: '',
        deposit_amount: '',
        lease_start_date: '',
        lease_end_date: '',
        notes: ''
      })
      fetchTenants()
    } catch (error) {
      console.error('Failed to create tenant:', error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: 'var(--theme-text)' }}>
          Tenants
        </h1>
        <button
          onClick={() => setShowModal(true)}
          className="theme-button px-4 py-2 font-medium flex items-center justify-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Add Tenant</span>
        </button>
      </div>

      <div className="theme-card p-4">
        <input
          type="text"
          placeholder="Search by name, phone, unit..."
          className="w-full px-4 py-3 border-2 focus:outline-none focus:ring-0 transition-all"
          style={{
            borderColor: 'var(--theme-border)',
            borderRadius: 'var(--theme-radius)',
            color: 'var(--theme-text)',
          }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tenants.map((tenant) => (
          <div key={tenant.id} className="theme-card p-6 hover:scale-105 transition-transform duration-200">
            <div className="flex items-center justify-between mb-4">
              <div 
                className="h-14 w-14 rounded-full flex items-center justify-center text-white text-xl font-bold"
                style={{ backgroundColor: 'var(--theme-primary)' }}
              >
                {tenant.initials}
              </div>
              <span 
                className="px-3 py-1 text-xs font-medium rounded-full"
                style={{
                  backgroundColor: tenant.is_active ? (theme === 'friendly' ? '#34d399' : '#059669') : '#9ca3af',
                  color: 'white',
                  borderRadius: theme === 'friendly' ? '1rem' : '0.5rem',
                }}
              >
                {tenant.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
            <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--theme-text)' }}>
              {tenant.full_name}
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span style={{ color: 'var(--theme-text-secondary)' }}>Unit</span>
                <span className="font-semibold" style={{ color: 'var(--theme-text)' }}>
                  {tenant.unit_number}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span style={{ color: 'var(--theme-text-secondary)' }}>Phone</span>
                <span className="font-semibold" style={{ color: 'var(--theme-text)' }}>
                  {tenant.phone}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span style={{ color: 'var(--theme-text-secondary)' }}>Rent</span>
                <span className="font-bold text-lg" style={{ color: 'var(--theme-primary)' }}>
                  KES {tenant.expected_rent?.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t" style={{ borderColor: 'var(--theme-border-light)' }}>
                <span style={{ color: 'var(--theme-text-secondary)' }}>Lease Ends</span>
                <span className="font-medium" style={{ color: 'var(--theme-text)' }}>
                  {new Date(tenant.lease_end_date).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="theme-card max-w-md w-full max-h-screen overflow-y-auto p-6">
            <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--theme-text)' }}>
              Add New Tenant
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
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
              <input
                type="tel"
                placeholder="Phone Number"
                className="w-full px-4 py-3 border-2 focus:outline-none transition-all"
                style={{
                  borderColor: 'var(--theme-border)',
                  borderRadius: 'var(--theme-radius)',
                  color: 'var(--theme-text)',
                }}
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
              <input
                type="email"
                placeholder="Email (optional)"
                className="w-full px-4 py-3 border-2 focus:outline-none transition-all"
                style={{
                  borderColor: 'var(--theme-border)',
                  borderRadius: 'var(--theme-radius)',
                  color: 'var(--theme-text)',
                }}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <input
                type="text"
                placeholder="Unit Number"
                className="w-full px-4 py-3 border-2 focus:outline-none transition-all"
                style={{
                  borderColor: 'var(--theme-border)',
                  borderRadius: 'var(--theme-radius)',
                  color: 'var(--theme-text)',
                }}
                value={formData.unit_number}
                onChange={(e) => setFormData({ ...formData, unit_number: e.target.value })}
                required
              />
              <input
                type="number"
                placeholder="Expected Rent (KES)"
                className="w-full px-4 py-3 border-2 focus:outline-none transition-all"
                style={{
                  borderColor: 'var(--theme-border)',
                  borderRadius: 'var(--theme-radius)',
                  color: 'var(--theme-text)',
                }}
                value={formData.expected_rent}
                onChange={(e) => setFormData({ ...formData, expected_rent: e.target.value })}
                required
              />
              <input
                type="number"
                placeholder="Deposit Amount (KES)"
                className="w-full px-4 py-3 border-2 focus:outline-none transition-all"
                style={{
                  borderColor: 'var(--theme-border)',
                  borderRadius: 'var(--theme-radius)',
                  color: 'var(--theme-text)',
                }}
                value={formData.deposit_amount}
                onChange={(e) => setFormData({ ...formData, deposit_amount: e.target.value })}
              />
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--theme-text)' }}>Lease Start Date</label>
                <input
                  type="date"
                  className="w-full px-4 py-3 border-2 focus:outline-none transition-all"
                  style={{
                    borderColor: 'var(--theme-border)',
                    borderRadius: 'var(--theme-radius)',
                    color: 'var(--theme-text)',
                  }}
                  value={formData.lease_start_date}
                  onChange={(e) => setFormData({ ...formData, lease_start_date: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--theme-text)' }}>Lease End Date</label>
                <input
                  type="date"
                  className="w-full px-4 py-3 border-2 focus:outline-none transition-all"
                  style={{
                    borderColor: 'var(--theme-border)',
                    borderRadius: 'var(--theme-radius)',
                    color: 'var(--theme-text)',
                  }}
                  value={formData.lease_end_date}
                  onChange={(e) => setFormData({ ...formData, lease_end_date: e.target.value })}
                  required
                />
              </div>
              <textarea
                placeholder="Notes (optional)"
                className="w-full px-4 py-3 border-2 focus:outline-none transition-all"
                style={{
                  borderColor: 'var(--theme-border)',
                  borderRadius: 'var(--theme-radius)',
                  color: 'var(--theme-text)',
                }}
                rows="3"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 theme-button px-4 py-3 font-medium"
                >
                  Save Tenant
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
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
