'use client'
import { useEffect, useState, useMemo } from 'react'
import { getOrders, type Order } from '@/lib/supabase'

const PRODUCT_NAMES = [
  'Tarjetas de Papelería',
  'Tarjetas Artesanales',
  'Paquete Familiar',
  'Paquete de Boda',
]

const STATUS_LABEL: Record<string, string> = {
  pending:     'Pendiente',
  in_progress: 'En proceso',
  completed:   'Completado',
  cancelled:   'Cancelado',
}

const STATUS_COLOR: Record<string, string> = {
  pending:     'bg-amber-400/60',
  in_progress: 'bg-blue-400/60',
  completed:   'bg-emerald-400/60',
  cancelled:   'bg-red-400/50',
}

function getLast6Months() {
  const months: { key: string; label: string }[] = []
  const now = new Date()
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    months.push({
      key:   `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
      label: d.toLocaleDateString('es-MX', { month: 'short', year: '2-digit' }),
    })
  }
  return months
}

export default function AnalyticsPage() {
  const [orders,  setOrders]  = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getOrders().then(setOrders).catch(console.error).finally(() => setLoading(false))
  }, [])

  const months = getLast6Months()

  const byMonth = useMemo(() =>
    months.map(m => ({ ...m, count: orders.filter(o => o.created_at?.startsWith(m.key)).length }))
  , [orders, months])

  const byProduct = useMemo(() =>
    PRODUCT_NAMES.map(name => ({ name, count: orders.filter(o => o.product_name === name).length }))
      .sort((a, b) => b.count - a.count)
  , [orders])

  const byStatus = useMemo(() =>
    Object.entries(STATUS_LABEL).map(([key, label]) => ({
      key, label, count: orders.filter(o => (o.status ?? 'pending') === key).length,
    }))
  , [orders])

  const total      = orders.length
  const thisMonth  = byMonth[byMonth.length - 1]?.count ?? 0
  const lastMonth  = byMonth[byMonth.length - 2]?.count ?? 0
  const growth     = lastMonth === 0 ? null : Math.round(((thisMonth - lastMonth) / lastMonth) * 100)
  const completionRate = total > 0
    ? Math.round((orders.filter(o => o.status === 'completed').length / total) * 100)
    : 0

  const maxMonth   = Math.max(...byMonth.map(m => m.count), 1)
  const maxProduct = Math.max(...byProduct.map(p => p.count), 1)

  return (
    <div className="max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-white mb-1">Analíticas</h1>
        <p className="text-sm text-gray-400">{loading ? '…' : `${total} pedidos totales`}</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Este mes',         value: loading ? '—' : String(thisMonth),                           sub: 'pedidos' },
          { label: 'Mes anterior',     value: loading ? '—' : String(lastMonth),                           sub: 'pedidos' },
          { label: 'Crecimiento',      value: loading || growth === null ? '—' : `${growth > 0 ? '+' : ''}${growth}%`, sub: 'vs mes anterior' },
          { label: 'Tasa completados', value: loading ? '—' : `${completionRate}%`,                        sub: 'del total' },
        ].map(k => (
          <div key={k.label} className="bg-[#1c2538] border border-white/10 rounded-lg p-5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">{k.label}</p>
            <p className="text-3xl font-bold text-white">{k.value}</p>
            <p className="text-xs text-gray-500 mt-1">{k.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Monthly chart */}
        <div className="bg-[#1c2538] border border-white/10 rounded-lg p-6">
          <h2 className="text-sm font-semibold text-white mb-5">Pedidos — últimos 6 meses</h2>
          {loading ? (
            <div className="h-36 flex items-center justify-center text-gray-500 text-sm">Cargando…</div>
          ) : (
            <div className="flex items-end gap-3 h-36">
              {byMonth.map(m => (
                <div key={m.key} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-xs text-gray-400 font-medium">{m.count || ''}</span>
                  <div className="w-full flex items-end" style={{ height: '80px' }}>
                    <div
                      className="w-full bg-white/25 rounded-sm hover:bg-white/40 transition-colors"
                      style={{ height: `${(m.count / maxMonth) * 80}px`, minHeight: m.count > 0 ? '4px' : '0' }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 capitalize">{m.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* By product */}
        <div className="bg-[#1c2538] border border-white/10 rounded-lg p-6">
          <h2 className="text-sm font-semibold text-white mb-5">Pedidos por producto</h2>
          {loading ? (
            <div className="h-36 flex items-center justify-center text-gray-500 text-sm">Cargando…</div>
          ) : (
            <div className="flex flex-col gap-4">
              {byProduct.map(p => (
                <div key={p.name}>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-sm text-gray-200 truncate pr-4">{p.name}</span>
                    <span className="text-sm text-gray-400 font-medium flex-shrink-0">{p.count}</span>
                  </div>
                  <div className="h-2 bg-white/8 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white/40 rounded-full transition-all duration-700"
                      style={{ width: `${(p.count / maxProduct) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Status breakdown */}
      <div className="bg-[#1c2538] border border-white/10 rounded-lg p-6">
        <h2 className="text-sm font-semibold text-white mb-5">Distribución por estado</h2>
        {loading ? (
          <div className="h-8 flex items-center text-gray-500 text-sm">Cargando…</div>
        ) : total === 0 ? (
          <p className="text-gray-500 text-sm">Sin datos aún.</p>
        ) : (
          <>
            <div className="flex h-3 rounded-full overflow-hidden mb-5 gap-px">
              {byStatus.filter(s => s.count > 0).map(s => (
                <div
                  key={s.key}
                  className={`${STATUS_COLOR[s.key]} transition-all duration-700`}
                  style={{ width: `${(s.count / total) * 100}%` }}
                  title={`${s.label}: ${s.count}`}
                />
              ))}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {byStatus.map(s => (
                <div key={s.key} className="flex items-center gap-2.5">
                  <div className={`w-3 h-3 rounded-sm flex-shrink-0 ${STATUS_COLOR[s.key]}`} />
                  <div>
                    <p className="text-sm text-gray-200 font-medium">{s.label}</p>
                    <p className="text-xs text-gray-500">
                      {s.count} · {total > 0 ? Math.round((s.count / total) * 100) : 0}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
