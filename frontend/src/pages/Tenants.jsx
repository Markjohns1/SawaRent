import { useState, useEffect } from 'react'

const api = {
  get: async (url) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const isActive = url.includes('is_active=true')
    return {
      data: {
        tenants: isActive ? [
          {
            id: 1,
            full_name: 'John Kamau',
            initials: 'JK',
            phone: '+254 712 345 678',
            email: 'john@email.com',
            unit_number: 'A-101',
            expected_rent: 25000,
            deposit_amount: 50000,
            lease_start_date: '2024-01-01',
            lease_end_date: '2025-12-31',
            is_active: true,
            notes: 'Reliable tenant'
          },
          {
            id: 2,
            full_name: 'Mary Wanjiku',
            initials: 'MW',
            phone: '+254 723 456 789',
            email: 'mary@email.com',
            unit_number: 'B-205',
            expected_rent: 30000,
            deposit_amount: 60000,
            lease_start_date: '2024-03-01',
            lease_end_date: '2025-02-28',
            is_active: true,
            notes: ''
          },
          {
            id: 3,
            full_name: 'Peter Omondi',
            initials: 'PO',
            phone: '+254 734 567 890',
            email: 'peter@email.com',
            unit_number: 'C-302',
            expected_rent: 28000,
            deposit_amount: 56000,
            lease_start_date: '2024-02-15',
            lease_end_date: '2026-02-14',
            is_active: true,
            notes: 'Prefers evening calls'
          }
        ] : [
          {
            id: 4,
            full_name: 'Grace Akinyi',
            initials: 'GA',
            phone: '+254 745 678 901',
            email: 'grace@email.com',
            unit_number: 'A-103',
            expected_rent: 25000,
            deposit_amount: 50000,
            lease_start_date: '2023-01-01',
            lease_end_date: '2024-10-31',
            is_active: false,
            notes: 'Moved out on good terms'
          }
        ]
      }
    }
  },
  post: async () => {
    await new Promise(resolve => setTimeout(resolve, 300))
    return { data: { success: true } }
  },
  delete: async () => {
    await new Promise(resolve => setTimeout(resolve, 300))
    return { data: { success: true } }
  }
}

export default function Tenants() {
  const [tenants, setTenants] = useState([])
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [activeTab, setActiveTab] = useState('active')
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
  }, [search, activeTab])

  const fetchTenants = async () => {
    try {
      const isActive = activeTab === 'active'
      const response = await api.get(`/tenants?search=${search}&is_active=${isActive}`)
      setTenants(response.data.tenants)
    } catch (error) {
      console.error('Failed to fetch tenants:', error)
    }
  }

  const handleMarkMovedOut = async (tenantId) => {
    if (confirm('Mark this tenant as moved out? Their records will be archived.')) {
      try {
        await api.delete(`/tenants/${tenantId}`)
        fetchTenants()
      } catch (error) {
        console.error('Failed to mark tenant as moved out:', error)
      }
    }
  }

  const handleReactivate = async (tenantId) => {
    if (confirm('Reactivate this tenant?')) {
      try {
        await api.post(`/tenants/${tenantId}/reactivate`)
        fetchTenants()
      } catch (error) {
        console.error('Failed to reactivate tenant:', error)
      }
    }
  }

  const handleSubmit = async () => {
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
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Tenants
          </h1>
          <button
            onClick={() => setShowModal(true)}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
          >
            + Add Tenant
          </button>
        </div>

        {/* Search & Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex gap-2 mb-3">
            <button
              onClick={() => setActiveTab('active')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'active' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setActiveTab('inactive')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'inactive' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Moved Out
            </button>
          </div>
          <input
            type="text"
            placeholder="Search tenants..."
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Tenant Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tenants.map((tenant) => (
            <div key={tenant.id} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg text-gray-900 truncate">{tenant.full_name}</h3>
                  <p className="text-sm text-gray-500">Unit {tenant.unit_number}</p>
                </div>
                <span 
                  className={`px-3 py-1 text-xs font-semibold rounded-full flex-shrink-0 ml-2 ${
                    tenant.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {tenant.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>

              {/* Contact Info */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="truncate">{tenant.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="truncate">{tenant.email}</span>
                </div>
              </div>

              {/* Rent & Lease Info */}
              <div className="bg-gray-50 rounded-lg p-3 mb-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Monthly Rent</span>
                  <span className="text-base font-bold text-blue-600">
                    KES {tenant.expected_rent?.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-600">Lease Ends</span>
                  <span className="text-gray-900 font-medium">
                    {new Date(tenant.lease_end_date).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                {tenant.is_active ? (
                  <button
                    onClick={() => handleMarkMovedOut(tenant.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                    <span>Move Out</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleReactivate(tenant.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Reactivate</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {tenants.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className="text-lg font-medium text-gray-900 mb-1">No tenants found</p>
            <p className="text-sm text-gray-500">Try adjusting your search</p>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">
                Add New Tenant
              </h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  required
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
                <input
                  type="email"
                  placeholder="Email (optional)"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Unit Number"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  value={formData.unit_number}
                  onChange={(e) => setFormData({ ...formData, unit_number: e.target.value })}
                  required
                />
                <input
                  type="number"
                  placeholder="Expected Rent (KES)"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  value={formData.expected_rent}
                  onChange={(e) => setFormData({ ...formData, expected_rent: e.target.value })}
                  required
                />
                <input
                  type="number"
                  placeholder="Deposit Amount (KES)"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  value={formData.deposit_amount}
                  onChange={(e) => setFormData({ ...formData, deposit_amount: e.target.value })}
                />
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Lease Start Date</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    value={formData.lease_start_date}
                    onChange={(e) => setFormData({ ...formData, lease_start_date: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Lease End Date</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    value={formData.lease_end_date}
                    onChange={(e) => setFormData({ ...formData, lease_end_date: e.target.value })}
                    required
                  />
                </div>
                <textarea
                  placeholder="Notes (optional)"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  rows="3"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleSubmit}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors"
                  >
                    Save Tenant
                  </button>
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg font-medium transition-colors"
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