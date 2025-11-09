import { useState, useEffect } from 'react'
import { useTheme } from '../context/ThemeContext'
import api from '../services/api'

export default function Messaging() {
  const [templates, setTemplates] = useState([])
  const [tenants, setTenants] = useState([])
  const [smsLogs, setSmsLogs] = useState([])
  const [showModal, setShowModal] = useState(false)
  const { theme } = useTheme()
  const [formData, setFormData] = useState({
    tenant_id: '',
    template_id: '',
    message: '',
    placeholders: {}
  })

  useEffect(() => {
    fetchTemplates()
    fetchTenants()
    fetchSmsLogs()
  }, [])

  const fetchTemplates = async () => {
    try {
      const response = await api.get('/messaging/templates')
      setTemplates(response.data.templates)
    } catch (error) {
      console.error('Failed to fetch templates:', error)
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

  const fetchSmsLogs = async () => {
    try {
      const response = await api.get('/messaging/sms-logs')
      setSmsLogs(response.data.sms_logs)
    } catch (error) {
      console.error('Failed to fetch SMS logs:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post('/messaging/send-sms', formData)
      setShowModal(false)
      setFormData({
        tenant_id: '',
        template_id: '',
        message: '',
        placeholders: {}
      })
      fetchSmsLogs()
    } catch (error) {
      console.error('Failed to send SMS:', error)
    }
  }

  const getTenantName = (tenantId) => {
    const tenant = tenants.find(t => t.id === parseInt(tenantId))
    return tenant ? tenant.full_name : 'Unknown'
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold" style={{ color: 'var(--theme-text)' }}>
          'Messaging' : 'Messaging'}
        </h1>
        <button
          onClick={() => setShowModal(true)}
          className="theme-button px-4 py-2 font-medium flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Send SMS</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="theme-card p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center space-x-2" style={{ color: 'var(--theme-text)' }}>
            <span>{theme === 'friendly' ? '📝' : ''}</span>
            <span>Message Templates</span>
          </h2>
          <div className="space-y-3">
            {templates.map((template) => (
              <div key={template.id} className="p-4 border-2 transition-all hover:scale-102"
                style={{
                  borderColor: 'var(--theme-border)',
                  borderRadius: 'var(--theme-radius)',
                }}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold" style={{ color: 'var(--theme-text)' }}>{template.name}</h3>
                  <span
                    className="text-xs px-2 py-1 font-medium"
                    style={{
                      backgroundColor: template.theme === 'friendly' ? (theme === 'friendly' ? '#fed7aa' : '#fef3c7') : (theme === 'friendly' ? '#dbeafe' : '#e0e7ff'),
                      color: 'var(--theme-text)',
                      borderRadius: theme === 'friendly' ? '1rem' : '0.375rem',
                    }}
                  >
                    {template.theme}
                  </span>
                </div>
                <p className="text-sm" style={{ color: 'var(--theme-text-secondary)' }}>{template.content}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="theme-card p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center space-x-2" style={{ color: 'var(--theme-text)' }}>
            <span>{theme === 'friendly' ? '📨' : ''}</span>
            <span>Recent SMS</span>
          </h2>
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {smsLogs.slice(0, 20).map((log) => (
              <div key={log.id} className="p-4 border-2 transition-all"
                style={{
                  borderColor: 'var(--theme-border-light)',
                  borderRadius: 'var(--theme-radius)',
                }}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-semibold" style={{ color: 'var(--theme-text)' }}>{log.recipient_name}</div>
                    <div className="text-xs" style={{ color: 'var(--theme-text-secondary)' }}>{log.recipient_phone}</div>
                  </div>
                  <span
                    className="text-xs px-2 py-1 font-medium text-white"
                    style={{
                      backgroundColor: log.status === 'sent' ? (theme === 'friendly' ? '#34d399' : '#059669') : (theme === 'friendly' ? '#f87171' : '#dc2626'),
                      borderRadius: theme === 'friendly' ? '1rem' : '0.375rem',
                    }}
                  >
                    {log.status}
                  </span>
                </div>
                <p className="text-sm mb-2" style={{ color: 'var(--theme-text)' }}>{log.message}</p>
                <div className="text-xs" style={{ color: 'var(--theme-text-secondary)' }}>
                  {new Date(log.sent_at).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="theme-card max-w-md w-full max-h-screen overflow-y-auto p-6">
            <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--theme-text)' }}>
              {theme === 'friendly' ? 'Send SMS' : 'Send SMS'}
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
                      {tenant.full_name} - {tenant.phone}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--theme-text)' }}>Template (optional)</label>
                <select
                  className="w-full px-4 py-3 border-2 focus:outline-none transition-all"
                  style={{
                    borderColor: 'var(--theme-border)',
                    borderRadius: 'var(--theme-radius)',
                    color: 'var(--theme-text)',
                  }}
                  value={formData.template_id}
                  onChange={(e) => setFormData({ ...formData, template_id: e.target.value })}
                >
                  <option value="">Custom Message</option>
                  {templates.map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--theme-text)' }}>Message</label>
                <textarea
                  className="w-full px-4 py-3 border-2 focus:outline-none transition-all"
                  style={{
                    borderColor: 'var(--theme-border)',
                    borderRadius: 'var(--theme-radius)',
                    color: 'var(--theme-text)',
                  }}
                  rows="4"
                  placeholder="Type your message here..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required={!formData.template_id}
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 theme-button px-4 py-3 font-medium"
                >
                  Send SMS
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
