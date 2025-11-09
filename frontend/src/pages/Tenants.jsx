import { useState, useEffect } from 'react'
import api from '../services/api'

export default function Tenants() {
  const [tenants, setTenants] = useState([])
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
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
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Tenants</h1>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-700"
        >
          Add Tenant
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <input
          type="text"
          placeholder="Search by name, phone, unit..."
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tenants.map((tenant) => (
          <div key={tenant.id} className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 rounded-full bg-primary text-white flex items-center justify-center text-lg font-semibold">
                {tenant.initials}
              </div>
              <span className={`px-2 py-1 text-xs rounded ${tenant.is_active ? 'bg-success text-white' : 'bg-gray-300 text-gray-700'}`}>
                {tenant.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{tenant.full_name}</h3>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Unit:</span>
                <span className="font-medium">{tenant.unit_number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Phone:</span>
                <span className="font-medium">{tenant.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Rent:</span>
                <span className="font-medium">KES {tenant.expected_rent?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Lease Ends:</span>
                <span className="font-medium">{new Date(tenant.lease_end_date).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-screen overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Add New Tenant</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                className="w-full px-3 py-2 border rounded-md"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                required
              />
              <input
                type="tel"
                placeholder="Phone Number"
                className="w-full px-3 py-2 border rounded-md"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
              <input
                type="email"
                placeholder="Email (optional)"
                className="w-full px-3 py-2 border rounded-md"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <input
                type="text"
                placeholder="Unit Number"
                className="w-full px-3 py-2 border rounded-md"
                value={formData.unit_number}
                onChange={(e) => setFormData({ ...formData, unit_number: e.target.value })}
                required
              />
              <input
                type="number"
                placeholder="Expected Rent"
                className="w-full px-3 py-2 border rounded-md"
                value={formData.expected_rent}
                onChange={(e) => setFormData({ ...formData, expected_rent: e.target.value })}
                required
              />
              <input
                type="number"
                placeholder="Deposit Amount"
                className="w-full px-3 py-2 border rounded-md"
                value={formData.deposit_amount}
                onChange={(e) => setFormData({ ...formData, deposit_amount: e.target.value })}
              />
              <div>
                <label className="block text-sm font-medium mb-1">Lease Start Date</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border rounded-md"
                  value={formData.lease_start_date}
                  onChange={(e) => setFormData({ ...formData, lease_start_date: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Lease End Date</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border rounded-md"
                  value={formData.lease_end_date}
                  onChange={(e) => setFormData({ ...formData, lease_end_date: e.target.value })}
                  required
                />
              </div>
              <textarea
                placeholder="Notes (optional)"
                className="w-full px-3 py-2 border rounded-md"
                rows="3"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-700"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
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
