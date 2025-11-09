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
    if (status === 'Full') return '#10b981' // success color
    if (status === 'Partial') return '#f59e0b' // warning color
    return '#9ca3af' // gray
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
          Payments
        </h1>
        <button
  onClick={() => setShowModal(true)}
  className="theme-button px-3 py-2 sm:px-4 sm:py-2 font-medium flex items-center space-x-2 text-sm sm:text-base"
>
  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
  <span>Log Payment</span>
</button>
      </div>

      {/* Professional Table */}
      <div className="theme-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr style={{ backgroundColor: 'var(--theme-background)' }}>
                <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--theme-text)' }}>
                  Date
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--theme-text)' }}>
                  Tenant
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--theme-text)' }}>
                  Unit
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--theme-text)' }}>
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--theme-text)' }}>
                  Method
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--theme-text)' }}>
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--theme-text)' }}>
                  Remaining
                </th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--theme-border)' }}>
              {payments.map((payment) => (
                <tr 
                  key={payment.id} 
                  style={{ 
                    backgroundColor: 'var(--theme-surface)',
                    color: 'var(--theme-text)'
                  }}
                  className="transition-colors hover:bg-opacity-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {new Date(payment.payment_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
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
                      className="px-3 py-1 text-xs font-medium text-white rounded-full"
                      style={{
                        backgroundColor: getStatusColor(payment.payment_status),
                      }}
                    >
                      {payment.payment_status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" style={{ color: 'var(--theme-warning)' }}>
                    {payment.remaining_amount > 0 ? `KES ${payment.remaining_amount?.toLocaleString()}` : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {payments.length === 0 && (
          <div className="text-center py-12">
            <svg className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--theme-text-secondary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
            <p className="text-lg font-medium mb-1" style={{ color: 'var(--theme-text)' }}>No payments found</p>
            <p className="text-sm" style={{ color: 'var(--theme-text-secondary)' }}>Get started by logging your first payment</p>
          </div>
        )}
      </div>

      {/* Clean Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
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
                    backgroundColor: 'var(--theme-surface)'
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
                    backgroundColor: 'var(--theme-surface)'
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
                    backgroundColor: 'var(--theme-surface)'
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
                    backgroundColor: 'var(--theme-surface)'
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
                    backgroundColor: 'var(--theme-surface)'
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
                    backgroundColor: 'var(--theme-background)',
                    color: 'var(--theme-text)',
                    borderRadius: 'var(--theme-radius)',
                    border: '1px solid var(--theme-border)'
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