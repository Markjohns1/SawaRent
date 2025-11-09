import { useState, useEffect } from 'react'
import { useTheme } from '../context/ThemeContext'
import api from '../services/api'

export default function Dashboard() {
  const [summary, setSummary] = useState(null)
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)
  const { theme } = useTheme()

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [summaryRes, alertsRes] = await Promise.all([
        api.get('/dashboard/summary'),
        api.get('/dashboard/alerts?unread_only=true'),
      ])
      setSummary(summaryRes.data)
      setAlerts(alertsRes.data.alerts)
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: 'var(--theme-primary)' }}></div>
      </div>
    )
  }

  const StatCard = ({ title, value, color }) => (
    <div className="theme-card p-6 hover:scale-105 transition-transform duration-200">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-medium" style={{ color: 'var(--theme-text-secondary)' }}>{title}</div>
          <div className="mt-2 text-3xl font-bold" style={{ color: color || 'var(--theme-text)' }}>
            {value}
          </div>
        </div>
      </div>
    </div>
  )

  const StatusCard = ({ title, count, bgColor, textColor }) => (
    <div 
      className="p-6 border-2 transition-all duration-200 hover:scale-105"
      style={{ 
        backgroundColor: `${bgColor}15`,
        borderColor: bgColor,
        borderRadius: 'var(--theme-radius)'
      }}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-medium" style={{ color: textColor }}>{title}</div>
          <div className="mt-2 text-3xl font-bold" style={{ color: textColor }}>{count}</div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold" style={{ color: 'var(--theme-text)' }}>
          Property Dashboard
        </h1>
        <div className="text-sm" style={{ color: 'var(--theme-text-secondary)' }}>
          {new Date().toLocaleDateString('en-KE', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Tenants"
          value={summary?.total_tenants || 0}
        />
        <StatCard
          title="Expected Rent"
          value={`KES ${(summary?.total_expected || 0).toLocaleString()}`}
        />
        <StatCard
          title="Collected"
          value={`KES ${(summary?.total_collected || 0).toLocaleString()}`}
          color={theme === 'friendly' ? '#34d399' : '#059669'}
        />
        <StatCard
          title="Outstanding"
          value={`KES ${((summary?.total_expected || 0) - (summary?.total_collected || 0)).toLocaleString()}`}
          color={theme === 'friendly' ? '#f87171' : '#dc2626'}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatusCard
          title="Paid"
          count={summary?.paid_count || 0}
          bgColor={theme === 'friendly' ? '#34d399' : '#059669'}
          textColor={theme === 'friendly' ? '#065f46' : '#064e3b'}
        />
        <StatusCard
          title="Partial"
          count={summary?.partial_count || 0}
          bgColor={theme === 'friendly' ? '#fbbf24' : '#d97706'}
          textColor={theme === 'friendly' ? '#92400e' : '#78350f'}
        />
        <StatusCard
          title="Overdue"
          count={summary?.overdue_count || 0}
          bgColor={theme === 'friendly' ? '#f87171' : '#dc2626'}
          textColor={theme === 'friendly' ? '#991b1b' : '#7f1d1d'}
        />
      </div>

      {summary?.partial_tenants && summary.partial_tenants.length > 0 && (
        <div className="theme-card">
          <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--theme-border-light)' }}>
            <h2 className="text-lg font-semibold" style={{ color: 'var(--theme-text)' }}>
              Partial Payments
            </h2>
          </div>
          <div className="divide-y" style={{ borderColor: 'var(--theme-border-light)' }}>
            {summary.partial_tenants.map((tenant) => (
              <div key={tenant.tenant_id} className="px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
                <div>
                  <div className="font-medium" style={{ color: 'var(--theme-text)' }}>{tenant.tenant_name}</div>
                  <div className="text-sm" style={{ color: 'var(--theme-text-secondary)' }}>Unit {tenant.unit_number}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm" style={{ color: 'var(--theme-text-secondary)' }}>
                    Paid: KES {tenant.paid_amount?.toLocaleString()}
                  </div>
                  <div className="text-sm font-semibold" style={{ color: theme === 'friendly' ? '#fbbf24' : '#d97706' }}>
                    Remaining: KES {tenant.remaining_amount?.toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {summary?.overdue_tenants && summary.overdue_tenants.length > 0 && (
        <div className="theme-card">
          <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--theme-border-light)' }}>
            <h2 className="text-lg font-semibold" style={{ color: 'var(--theme-text)' }}>
              Overdue Payments
            </h2>
          </div>
          <div className="divide-y" style={{ borderColor: 'var(--theme-border-light)' }}>
            {summary.overdue_tenants.map((tenant) => (
              <div key={tenant.tenant_id} className="px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
                <div>
                  <div className="font-medium" style={{ color: 'var(--theme-text)' }}>{tenant.tenant_name}</div>
                  <div className="text-sm" style={{ color: 'var(--theme-text-secondary)' }}>Unit {tenant.unit_number}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold" style={{ color: theme === 'friendly' ? '#f87171' : '#dc2626' }}>
                    Due: KES {tenant.expected_rent?.toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {alerts.length > 0 && (
        <div className="theme-card">
          <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--theme-border-light)' }}>
            <h2 className="text-lg font-semibold" style={{ color: 'var(--theme-text)' }}>
              Recent Alerts
            </h2>
          </div>
          <div className="divide-y" style={{ borderColor: 'var(--theme-border-light)' }}>
            {alerts.slice(0, 5).map((alert) => (
              <div key={alert.id} className="px-6 py-3 hover:bg-gray-50 transition-colors">
                <div className="flex items-start space-x-3">
                  <div className="flex-1">
                    <div className="text-sm" style={{ color: 'var(--theme-text)' }}>{alert.message}</div>
                    <div className="text-xs mt-1" style={{ color: 'var(--theme-text-secondary)' }}>
                      {new Date(alert.created_at).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
