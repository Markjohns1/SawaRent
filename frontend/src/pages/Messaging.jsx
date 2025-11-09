import { useState, useEffect } from 'react'
import api from '../services/api'

export default function Messaging() {
  const [templates, setTemplates] = useState([])
  const [tenants, setTenants] = useState([])
  const [smsLogs, setSmsLogs] = useState([])
  const [showModal, setShowModal] = useState(false)
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
        <h1 className="text-2xl font-bold text-gray-900">Messaging</h1>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-700"
        >
          Send SMS
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Message Templates</h2>
          <div className="space-y-3">
            {templates.map((template) => (
              <div key={template.id} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">{template.name}</h3>
                  <span className="text-xs px-2 py-1 bg-gray-100 rounded">{template.theme}</span>
                </div>
                <p className="text-sm text-gray-600">{template.content}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Recent SMS</h2>
          <div className="space-y-3">
            {smsLogs.slice(0, 10).map((log) => (
              <div key={log.id} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-medium">{log.recipient_name}</div>
                    <div className="text-xs text-gray-500">{log.recipient_phone}</div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${
                    log.status === 'sent' ? 'bg-success text-white' : 'bg-danger text-white'
                  }`}>
                    {log.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{log.message}</p>
                <div className="text-xs text-gray-400 mt-2">
                  {new Date(log.sent_at).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Send SMS</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Tenant</label>
                <select
                  className="w-full px-3 py-2 border rounded-md"
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
                <label className="block text-sm font-medium mb-1">Template (optional)</label>
                <select
                  className="w-full px-3 py-2 border rounded-md"
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
              <textarea
                placeholder="Message"
                className="w-full px-3 py-2 border rounded-md"
                rows="4"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required={!formData.template_id}
              />
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-700"
                >
                  Send
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
