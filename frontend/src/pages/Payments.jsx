import { useState, useEffect } from 'react'
import { useTheme } from '../context/ThemeContext'
import api from '../services/api'

export default function Payments() {
  const [payments, setPayments] = useState([])
  const [tenants, setTenants] = useState([])
  const [showModal, setShowModal] = useState(false)
  const { theme } = useTheme()
  const [formData, setFormData] = useState({
    tenant_id: '',
    amount: '',
    payment_date: new Date().toISOString().split('T')[0],
    payment_method: 'Cash',
    transaction_reference: '',
    notes: '',
    send_receipt: true
  })

  useEffect(() => {
    fetchPayments()
    fetchTenants()
  }, [])

  const fetchPayments = async () => {
    try {
      const response = await api.get('/payments')
      setPayments(response.data.payments)
    } catch (error) {
      console.error('Failed to fetch payments:', error)
    }
  }

  const fetchTenants = async () => {
    try {
      const response = await api.get('/tenants')
      setTenants(response.data.tenants)
    } catch (error) {
      console.error('Failed to fetch tenants:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post('/payments', formData)
      setShowModal(false)
      setFormData({
        tenant_id: '',
        amount: '',
        payment_date: new Date().toISOString().split('T')[0],
        payment_method: 'Cash',
        transaction_reference: '',
        notes: '',
        send_receipt: true
      })
      fetchPayments()
    } catch (error) {
      console.error('Failed to log payment:', error)
    }
  }

  const getStatusColor = (status) => {
    if (status === 'Full') return theme === 'friendly' ? '#34d399' : '#059669'
    if (status === 'Partial') return theme === 'friendly' ? '#fbbf24' : '#d97706'
    return '#9ca3af'
  }

  const getTenantName = (tenantId) => {
    const tenant = tenants.find(t => t.id === tenantId)
    return tenant ? tenant.full_name : 'Unknown'
  }

  const getTenantUnit = (tenantId) => {
    const tenant = tenants.find(t => t.id === tenantId)
    return tenant ? tenant.unit_number : '-'
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold" style={{ color: 'var(--theme-text)' }}>
          'Payments' : 'Payments'}
        </h1>
        <button
          onClick={() => setShowModal(true)}
          className="theme-button px-4 py-2 font-medium flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Log Payment</span>
        </button>
      </div>

      <div className="theme-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y" style={{ borderColor: 'var(--theme-border-light)' }}>
            <thead>
              <tr style={{ backgroundColor: theme === 'friendly' ? '#fed7aa' : '#e2e8f0' }}>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase" style={{ color: 'var(--theme-text)' }}>Date</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase" style={{ color: 'var(--theme-text)' }}>Tenant</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase" style={{ color: 'var(--theme-text)' }}>Unit</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase" style={{ color: 'var(--theme-text)' }}>Amount</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase" style={{ color: 'var(--theme-text)' }}>Method</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase" style={{ color: 'var(--theme-text)' }}>Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase" style={{ color: 'var(--theme-text)' }}>Remaining</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--theme-border-light)' }}>
              {payments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: 'var(--theme-text)' }}>
                    {new Date(payment.payment_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" style={{ color: 'var(--theme-text)' }}>
                    {getTenantName(payment.tenant_id)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: 'var(--theme-text-secondary)' }}>
                    {getTenantUnit(payment.tenant_id)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold" style={{ color: 'var(--theme-primary)' }}>
                    KES {payment.amount?.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: 'var(--theme-text-secondary)' }}>
                    {payment.payment_method}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className="px-3 py-1 text-xs font-medium text-white"
                      style={{
                        backgroundColor: getStatusColor(payment.payment_status),
                        borderRadius: theme === 'friendly' ? '1rem' : '0.375rem',
                      }}
                    >
                      {payment.payment_status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" style={{ color: theme === 'friendly' ? '#fbbf24' : '#d97706' }}>
                    {payment.remaining_amount > 0 ? `KES ${payment.remaining_amount?.toLocaleString()}` : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="theme-card max-w-md w-full max-h-screen overflow-y-auto p-6">
            <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--theme-text)' }}>
              Log Payment
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--theme-text)' }}>Tenant</label>
                <select
                  className="w-full px-4 py-3 border-2 focus:outline-none transition-all"
                  style={{
                    borderColor: 'var(--theme-border)',
                    borderRadius: 'var(--theme-radius)',
                    color: 'var(--theme-text)',
                  }}
                  value={formData.tenant_id}
                  onChange={(e) => setFormData({ ...formData, tenant_id: e.target.value })}
                  required
                >
                  <option value="">Select Tenant</option>
                  {tenants.map((tenant) => (
                    <option key={tenant.id} value={tenant.id}>
                      {tenant.full_name} - Unit {tenant.unit_number}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--theme-text)' }}>Amount (KES)</label>
                <input
                  type="number"
                  className="w-full px-4 py-3 border-2 focus:outline-none transition-all"
                  style={{
                    borderColor: 'var(--theme-border)',
                    borderRadius: 'var(--theme-radius)',
                    color: 'var(--theme-text)',
                  }}
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--theme-text)' }}>Payment Date</label>
                <input
                  type="date"
                  className="w-full px-4 py-3 border-2 focus:outline-none transition-all"
                  style={{
                    borderColor: 'var(--theme-border)',
                    borderRadius: 'var(--theme-radius)',
                    color: 'var(--theme-text)',
                  }}
                  value={formData.payment_date}
                  onChange={(e) => setFormData({ ...formData, payment_date: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--theme-text)' }}>Payment Method</label>
                <select
                  className="w-full px-4 py-3 border-2 focus:outline-none transition-all"
                  style={{
                    borderColor: 'var(--theme-border)',
                    borderRadius: 'var(--theme-radius)',
                    color: 'var(--theme-text)',
                  }}
                  value={formData.payment_method}
                  onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                >
                  <option value="Cash">Cash</option>
                  <option value="M-PESA">M-PESA</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--theme-text)' }}>Transaction Reference</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border-2 focus:outline-none transition-all"
                  style={{
                    borderColor: 'var(--theme-border)',
                    borderRadius: 'var(--theme-radius)',
                    color: 'var(--theme-text)',
                  }}
                  placeholder="Optional"
                  value={formData.transaction_reference}
                  onChange={(e) => setFormData({ ...formData, transaction_reference: e.target.value })}
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="send_receipt"
                  checked={formData.send_receipt}
                  onChange={(e) => setFormData({ ...formData, send_receipt: e.target.checked })}
                  className="h-4 w-4"
                />
                <label htmlFor="send_receipt" className="text-sm" style={{ color: 'var(--theme-text)' }}>
                  Send SMS Receipt to Tenant
                </label>
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 theme-button px-4 py-3 font-medium"
                >
                  Log Payment
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
