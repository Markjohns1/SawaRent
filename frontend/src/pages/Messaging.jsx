import { useState, useEffect } from 'react'
import { useTheme } from '../context/ThemeContext'
import api from '../services/api'

export default function Messaging() {
  const [templates, setTemplates] = useState([])
  const [tenants, setTenants] = useState([])
  const [smsLogs, setSmsLogs] = useState([])
  const [showSmsModal, setShowSmsModal] = useState(false)
  const [showTemplateModal, setShowTemplateModal] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState(null)
  const [smsFilter, setSmsFilter] = useState('all')
  const { theme } = useTheme()
  
  const [smsFormData, setSmsFormData] = useState({
    tenant_id: '',
    template_id: '',
    message: '',
    placeholders: {}
  })

  const [templateFormData, setTemplateFormData] = useState({
    name: '',
    category: 'general',
    theme: 'friendly',
    content: ''
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

  const handleSendSms = async (e) => {
    e.preventDefault()
    try {
      await api.post('/messaging/send-sms', smsFormData)
      setShowSmsModal(false)
      setSmsFormData({
        tenant_id: '',
        template_id: '',
        message: '',
        placeholders: {}
      })
      fetchSmsLogs()
      alert('SMS sent successfully!')
    } catch (error) {
      console.error('Failed to send SMS:', error)
      alert('Failed to send SMS. Check console for details.')
    }
  }

  const handleResendSms = async (log) => {
    if (confirm(`Resend SMS to ${log.recipient_name}?`)) {
      try {
        const tenant = tenants.find(t => t.phone === log.recipient_phone)
        if (!tenant) {
          alert('Tenant not found')
          return
        }
        await api.post('/messaging/send-sms', {
          tenant_id: tenant.id,
          message: log.message
        })
        fetchSmsLogs()
        alert('SMS resent successfully!')
      } catch (error) {
        console.error('Failed to resend SMS:', error)
        alert('Failed to resend SMS')
      }
    }
  }

  const handleDeleteSmsLog = async (logId) => {
    if (confirm('Delete this SMS log?')) {
      try {
        await api.delete(`/messaging/sms-logs/${logId}`)
        fetchSmsLogs()
      } catch (error) {
        console.error('Failed to delete SMS log:', error)
        alert('Failed to delete SMS log')
      }
    }
  }

  const handleClearAllLogs = async () => {
    if (confirm('Clear all SMS logs? This cannot be undone!')) {
      try {
        await api.delete('/messaging/sms-logs')
        fetchSmsLogs()
        alert('All SMS logs cleared!')
      } catch (error) {
        console.error('Failed to clear logs:', error)
        alert('Failed to clear logs')
      }
    }
  }

  const handleTemplateSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingTemplate) {
        await api.put(`/messaging/templates/${editingTemplate.id}`, templateFormData)
        alert('Template updated successfully!')
      } else {
        await api.post('/messaging/templates', templateFormData)
        alert('Template created successfully!')
      }
      setShowTemplateModal(false)
      setEditingTemplate(null)
      setTemplateFormData({
        name: '',
        category: 'general',
        theme: 'friendly',
        content: ''
      })
      fetchTemplates()
    } catch (error) {
      console.error('Failed to save template:', error)
      alert(error.response?.data?.error || 'Failed to save template')
    }
  }

  const handleEditTemplate = (template) => {
    setEditingTemplate(template)
    setTemplateFormData({
      name: template.name,
      category: template.category,
      theme: template.theme,
      content: template.content
    })
    setShowTemplateModal(true)
  }

  const handleDeleteTemplate = async (templateId) => {
    if (confirm('Delete this template?')) {
      try {
        await api.delete(`/messaging/templates/${templateId}`)
        fetchTemplates()
        alert('Template deleted successfully!')
      } catch (error) {
        console.error('Failed to delete template:', error)
        alert('Failed to delete template')
      }
    }
  }

  const getPreviewMessage = (content) => {
    return content
      .replace(/{tenant_name}/g, 'John Doe')
      .replace(/{unit_number}/g, 'A101')
      .replace(/{amount}/g, '15,000')
      .replace(/{payment_date}/g, '15/11/2025')
      .replace(/{remaining_amount}/g, '5,000')
      .replace(/{transaction_reference}/g, 'MPE12345')
  }

  const filteredLogs = smsLogs.filter(log => {
    if (smsFilter === 'all') return true
    return log.status === smsFilter
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: 'var(--theme-text)' }}>
          Messaging
        </h1>
        <button
          onClick={() => setShowSmsModal(true)}
          className="theme-button px-4 py-2 font-medium flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
          <span>Send SMS</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Templates Section */}
        <div className="theme-card p-4 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg sm:text-xl font-bold" style={{ color: 'var(--theme-text)' }}>
              Message Templates
            </h2>
            <button
              onClick={() => {
                setEditingTemplate(null)
                setTemplateFormData({
                  name: '',
                  category: 'general',
                  theme: 'friendly',
                  content: ''
                })
                setShowTemplateModal(true)
              }}
              className="theme-button px-3 py-1.5 text-sm font-medium"
            >
              New Template
            </button>
          </div>
          
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {templates.map((template) => (
              <div key={template.id} className="p-4 border-2 transition-all"
                style={{
                  borderColor: 'var(--theme-border)',
                  borderRadius: 'var(--theme-radius)',
                  backgroundColor: 'var(--theme-surface)'
                }}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-base" style={{ color: 'var(--theme-text)' }}>{template.name}</h3>
                    <div className="flex gap-2 mt-2">
                      <span className="text-xs px-2 py-1 rounded font-medium" style={{
                        backgroundColor: 'var(--theme-background)',
                        color: 'var(--theme-text)',
                        border: '1px solid var(--theme-border)'
                      }}>
                        {template.category}
                      </span>
                      <span className="text-xs px-2 py-1 rounded font-medium" style={{
                        backgroundColor: 'var(--theme-background)',
                        color: 'var(--theme-text)',
                        border: '1px solid var(--theme-border)'
                      }}>
                        {template.theme}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-1 ml-2">
                    <button
                      onClick={() => handleEditTemplate(template)}
                      className="p-1.5 rounded transition-colors"
                      style={{
                        backgroundColor: 'var(--theme-background)',
                        color: 'var(--theme-primary)',
                        border: '1px solid var(--theme-border)'
                      }}
                      title="Edit"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteTemplate(template.id)}
                      className="p-1.5 rounded transition-colors"
                      style={{
                        backgroundColor: 'var(--theme-background)',
                        color: 'var(--theme-danger)',
                        border: '1px solid var(--theme-border)'
                      }}
                      title="Delete"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
                <p className="text-sm mt-3" style={{ color: 'var(--theme-text)' }}>
                  {getPreviewMessage(template.content)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* SMS Logs Section */}
        <div className="theme-card p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
            <h2 className="text-lg sm:text-xl font-bold" style={{ color: 'var(--theme-text)' }}>
              Recent SMS
            </h2>
            <div className="flex gap-2">
              <select
                value={smsFilter}
                onChange={(e) => setSmsFilter(e.target.value)}
                className="px-3 py-1.5 text-sm border-2 rounded"
                style={{
                  borderColor: 'var(--theme-border)',
                  color: 'var(--theme-text)',
                  backgroundColor: 'var(--theme-surface)'
                }}
              >
                <option value="all">All</option>
                <option value="sent">Sent</option>
                <option value="failed">Failed</option>
              </select>
              <button
                onClick={handleClearAllLogs}
                className="px-3 py-1.5 text-sm font-medium rounded transition-opacity hover:opacity-80"
                style={{ backgroundColor: 'var(--theme-danger)', color: 'white' }}
                title="Clear all logs"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
          
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {filteredLogs.length === 0 ? (
              <div className="text-center py-8" style={{ color: 'var(--theme-text-secondary)' }}>
                <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m8-8V4a1 1 0 00-1-1h-2a1 1 0 00-1 1v1M9 7h6" />
                </svg>
                <p>No SMS logs found</p>
              </div>
            ) : (
              filteredLogs.slice(0, 50).map((log) => (
                <div key={log.id} className="p-4 border-2 transition-all"
                  style={{
                    borderColor: 'var(--theme-border)',
                    borderRadius: 'var(--theme-radius)',
                    backgroundColor: 'var(--theme-surface)'
                  }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <div className="font-semibold text-base" style={{ color: 'var(--theme-text)' }}>{log.recipient_name}</div>
                      <div className="text-sm mt-1" style={{ color: 'var(--theme-text-secondary)' }}>{log.recipient_phone}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className="text-xs px-2 py-1 font-medium text-white rounded"
                        style={{
                          backgroundColor: log.status === 'sent' ? 'var(--theme-success)' : 'var(--theme-danger)'
                        }}
                      >
                        {log.status}
                      </span>
                      {log.status === 'failed' && (
                        <button
                          onClick={() => handleResendSms(log)}
                          className="p-1.5 rounded transition-colors"
                          style={{
                            backgroundColor: 'var(--theme-background)',
                            color: 'var(--theme-primary)',
                            border: '1px solid var(--theme-border)'
                          }}
                          title="Resend"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteSmsLog(log.id)}
                        className="p-1.5 rounded transition-colors"
                        style={{
                          backgroundColor: 'var(--theme-background)',
                          color: 'var(--theme-danger)',
                          border: '1px solid var(--theme-border)'
                        }}
                        title="Delete"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <p className="text-sm mb-3" style={{ color: 'var(--theme-text)' }}>{log.message}</p>
                  <div className="text-sm" style={{ color: 'var(--theme-text-secondary)' }}>
                    {new Date(log.sent_at).toLocaleString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Send SMS Modal */}
      {showSmsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="theme-card max-w-md w-full max-h-screen overflow-y-auto p-6">
            <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--theme-text)' }}>
              Send SMS
            </h2>
            <form onSubmit={handleSendSms} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--theme-text)' }}>
                  Tenant
                </label>
                <select
                  className="w-full px-4 py-3 border-2 focus:outline-none transition-all"
                  style={{
                    borderColor: 'var(--theme-border)',
                    borderRadius: 'var(--theme-radius)',
                    color: 'var(--theme-text)',
                    backgroundColor: 'var(--theme-surface)'
                  }}
                  value={smsFormData.tenant_id}
                  onChange={(e) => setSmsFormData({ ...smsFormData, tenant_id: e.target.value })}
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
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--theme-text)' }}>
                  Template (optional)
                </label>
                <select
                  className="w-full px-4 py-3 border-2 focus:outline-none transition-all"
                  style={{
                    borderColor: 'var(--theme-border)',
                    borderRadius: 'var(--theme-radius)',
                    color: 'var(--theme-text)',
                    backgroundColor: 'var(--theme-surface)'
                  }}
                  value={smsFormData.template_id}
                  onChange={(e) => {
                    const templateId = e.target.value
                    const template = templates.find(t => t.id === parseInt(templateId))
                    setSmsFormData({ 
                      ...smsFormData, 
                      template_id: templateId,
                      message: template ? template.content : ''
                    })
                  }}
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
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--theme-text)' }}>
                  Message
                </label>
                <textarea
                  className="w-full px-4 py-3 border-2 focus:outline-none transition-all"
                  style={{
                    borderColor: 'var(--theme-border)',
                    borderRadius: 'var(--theme-radius)',
                    color: 'var(--theme-text)',
                    backgroundColor: 'var(--theme-surface)'
                  }}
                  rows="4"
                  placeholder="Type your message here..."
                  value={smsFormData.message}
                  onChange={(e) => setSmsFormData({ ...smsFormData, message: e.target.value })}
                  required={!smsFormData.template_id}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 theme-button px-4 py-3 font-medium"
                >
                  Send SMS
                </button>
                <button
                  type="button"
                  onClick={() => setShowSmsModal(false)}
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

      {/* Template Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="theme-card max-w-md w-full max-h-screen overflow-y-auto p-6">
            <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--theme-text)' }}>
              {editingTemplate ? 'Edit Template' : 'Create Template'}
            </h2>
            <form onSubmit={handleTemplateSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--theme-text)' }}>Template Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border-2 focus:outline-none transition-all"
                  style={{
                    borderColor: 'var(--theme-border)',
                    borderRadius: 'var(--theme-radius)',
                    color: 'var(--theme-text)',
                    backgroundColor: 'var(--theme-surface)'
                  }}
                  placeholder="e.g., Payment Reminder"
                  value={templateFormData.name}
                  onChange={(e) => setTemplateFormData({ ...templateFormData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--theme-text)' }}>Category</label>
                <select
                  className="w-full px-4 py-3 border-2 focus:outline-none transition-all"
                  style={{
                    borderColor: 'var(--theme-border)',
                    borderRadius: 'var(--theme-radius)',
                    color: 'var(--theme-text)',
                    backgroundColor: 'var(--theme-surface)'
                  }}
                  value={templateFormData.category}
                  onChange={(e) => setTemplateFormData({ ...templateFormData, category: e.target.value })}
                  required
                >
                  <option value="general">General</option>
                  <option value="payment">Payment</option>
                  <option value="lease">Lease</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="receipt">Receipt</option>
                  <option value="reminder">Reminder</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--theme-text)' }}>Theme</label>
                <select
                  className="w-full px-4 py-3 border-2 focus:outline-none transition-all"
                  style={{
                    borderColor: 'var(--theme-border)',
                    borderRadius: 'var(--theme-radius)',
                    color: 'var(--theme-text)',
                    backgroundColor: 'var(--theme-surface)'
                  }}
                  value={templateFormData.theme}
                  onChange={(e) => setTemplateFormData({ ...templateFormData, theme: e.target.value })}
                  required
                >
                  <option value="friendly">Friendly</option>
                  <option value="formal">Formal</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--theme-text)' }}>
                  Message Content
                </label>
                <textarea
                  className="w-full px-4 py-3 border-2 focus:outline-none transition-all font-mono text-sm"
                  style={{
                    borderColor: 'var(--theme-border)',
                    borderRadius: 'var(--theme-radius)',
                    color: 'var(--theme-text)',
                    backgroundColor: 'var(--theme-surface)'
                  }}
                  rows="5"
                  placeholder="Use placeholders: {tenant_name}, {unit_number}, {amount}, {payment_date}, {remaining_amount}, {transaction_reference}"
                  value={templateFormData.content}
                  onChange={(e) => setTemplateFormData({ ...templateFormData, content: e.target.value })}
                  required
                />
                <p className="text-xs mt-1" style={{ color: 'var(--theme-text-secondary)' }}>
                  Available placeholders: {'{tenant_name}'}, {'{unit_number}'}, {'{amount}'}, {'{payment_date}'}, {'{remaining_amount}'}, {'{transaction_reference}'}
                </p>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 theme-button px-4 py-3 font-medium"
                >
                  {editingTemplate ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowTemplateModal(false)
                    setEditingTemplate(null)
                  }}
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