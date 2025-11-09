import { useState, useEffect } from 'react'
import api from '../services/api'

export default function Dashboard() {
  const [summary, setSummary] = useState(null)
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)

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
    return <div className="text-center py-8">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm font-medium text-gray-500">Total Tenants</div>
          <div className="mt-2 text-3xl font-semibold text-gray-900">
            {summary?.total_tenants || 0}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm font-medium text-gray-500">Expected Rent</div>
          <div className="mt-2 text-3xl font-semibold text-gray-900">
            KES {summary?.total_expected?.toLocaleString() || 0}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm font-medium text-gray-500">Collected</div>
          <div className="mt-2 text-3xl font-semibold text-success">
            KES {summary?.total_collected?.toLocaleString() || 0}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm font-medium text-gray-500">Outstanding</div>
          <div className="mt-2 text-3xl font-semibold text-danger">
            KES {((summary?.total_expected || 0) - (summary?.total_collected || 0)).toLocaleString()}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-success bg-opacity-10 p-4 rounded-lg border border-success">
          <div className="text-sm font-medium text-success-700">Paid</div>
          <div className="mt-2 text-2xl font-semibold text-success">{summary?.paid_count || 0}</div>
        </div>

        <div className="bg-warning bg-opacity-10 p-4 rounded-lg border border-warning">
          <div className="text-sm font-medium text-warning-700">Partial</div>
          <div className="mt-2 text-2xl font-semibold text-warning">{summary?.partial_count || 0}</div>
        </div>

        <div className="bg-danger bg-opacity-10 p-4 rounded-lg border border-danger">
          <div className="text-sm font-medium text-danger-700">Overdue</div>
          <div className="mt-2 text-2xl font-semibold text-danger">{summary?.overdue_count || 0}</div>
        </div>
      </div>

      {summary?.partial_tenants && summary.partial_tenants.length > 0 && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Partial Payments</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {summary.partial_tenants.map((tenant) => (
              <div key={tenant.tenant_id} className="px-6 py-4 flex justify-between items-center">
                <div>
                  <div className="font-medium text-gray-900">{tenant.tenant_name}</div>
                  <div className="text-sm text-gray-500">Unit {tenant.unit_number}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">
                    Paid: KES {tenant.paid_amount?.toLocaleString()}
                  </div>
                  <div className="text-sm font-medium text-warning">
                    Remaining: KES {tenant.remaining_amount?.toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {summary?.overdue_tenants && summary.overdue_tenants.length > 0 && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Overdue Payments</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {summary.overdue_tenants.map((tenant) => (
              <div key={tenant.tenant_id} className="px-6 py-4 flex justify-between items-center">
                <div>
                  <div className="font-medium text-gray-900">{tenant.tenant_name}</div>
                  <div className="text-sm text-gray-500">Unit {tenant.unit_number}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-danger">
                    Due: KES {tenant.expected_rent?.toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {alerts.length > 0 && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Alerts</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {alerts.slice(0, 5).map((alert) => (
              <div key={alert.id} className="px-6 py-4">
                <div className="text-sm text-gray-900">{alert.message}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {new Date(alert.created_at).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
