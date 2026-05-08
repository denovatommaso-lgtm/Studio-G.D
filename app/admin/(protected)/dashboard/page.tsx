'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getOrders, type Order } from '@/lib/supabase'

const STATUS_LABEL: Record<string, string> = {
  pending:     'Pendiente',
  in_progress: 'En proceso',
  completed:   'Completado',
  cancelled:   'Cancelado',
}

const STATUS_COLOR: Record<string, string> = {
  pending:     'bg-amber-400/20 text-amber-300 border border-amber-400/30',
  in_progress: 'bg-blue-400/20 text-blue-300 border border-blue-400/30',
  completed:   'bg-emerald-400/20 text-emerald-300 border border-emerald-400/30',
  cancelled:   'bg-red-400/20 text-red-300 border border-red-400/30',
}

function getGreeting(hour: number) {
  if (hour < 12) return 'Buenos días'
  if (hour < 18) return 'Buenas tardes'
  return 'Buenas noches'
}

export default function Dashboard() {
  const [orders,      setOrders]      = useState<Order[]>([])
  const [loading,     setLoading]     = useState(true)
  const [displayName, setDisplayName] = useState('')
  const [time,        setTime]        = useState('')
  const [dateStr,     setDateStr]     = useState('')
  const [greeting,    setGreeting]    = useState('')

  // Live clock
  useEffect(() => {
    const tick = () => {
      const now = new Date()
      setTime(now.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
      setDateStr(now.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }))
      setGreeting(getGreeting(now.getHours()))
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  // Display name from settings
  useEffect(() => {
    setDisplayName(localStorage.getItem('admin_display_name') ?? '')
  }, [])

  // Orders data
  useEffect(() => {
    getOrders()
      .then(setOrders)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const total      = orders.length
  const pending    = orders.filter(o => o.status === 'pending' || !o.status).length
  const inProgress = orders.filter(o => o.status === 'in_progress').length
  const completed  = orders.filter(o => o.status === 'completed').length
  const recent     = orders.slice(0, 8)

  const productCounts = orders.reduce<Record<string, number>>((acc, o) => {
    acc[o.product_name] = (acc[o.product_name] ?? 0) + 1
    return acc
  }, {})
  const topProduct = Object.entries(productCounts).sort((a, b) => b[1] - a[1])[0]

  const stats = [
    { label: 'Total pedidos',  value: total,      color: 'text-white',          sub: 'todos los tiempos' },
    { label: 'Pendientes',     value: pending,    color: 'text-amber-400',      sub: 'por atender' },
    { label: 'En proceso',     value: inProgress, color: 'text-blue-400',       sub: 'en curso' },
    { label: 'Completados',    value: completed,  color: 'text-emerald-400',    sub: 'entregados' },
  ]

  return (
    <div className="max-w-5xl mx-auto">

      {/* Greeting header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div>
          <p className="text-sm text-gray-500 mb-1">{greeting},</p>
          <h1 className="text-3xl font-semibold text-white">
            {displayName
              ? displayName
              : <span className="text-gray-500 font-normal italic text-xl">
                  sin nombre —{' '}
                  <Link href="/admin/settings" className="underline hover:text-gray-300 transition-colors">
                    configúralo aquí
                  </Link>
                </span>
            }
          </h1>
        </div>
        <div className="sm:text-right pb-0.5">
          <p className="text-2xl font-mono font-light text-white tabular-nums">{time}</p>
          <p className="text-xs text-gray-500 mt-1 capitalize">{dateStr}</p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(s => (
          <div key={s.label} className="bg-[#1c2538] border border-white/10 rounded-lg p-5">
            <p className="text-xs text-gray-400 mb-3 font-medium uppercase tracking-wide">{s.label}</p>
            <p className={`text-4xl font-bold ${s.color}`}>
              {loading ? '—' : s.value}
            </p>
            <p className="text-xs text-gray-500 mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent orders */}
        <div className="lg:col-span-2 bg-[#1c2538] border border-white/10 rounded-lg overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
            <h2 className="text-sm font-semibold text-white">Pedidos recientes</h2>
            <Link href="/admin/orders"
                  className="text-xs text-blue-400 hover:text-blue-300 transition-colors font-medium">
              Ver todos →
            </Link>
          </div>

          {loading ? (
            <div className="px-5 py-12 text-center text-gray-500 text-sm">Cargando…</div>
          ) : recent.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <p className="text-gray-400 text-sm">No hay pedidos aún.</p>
              <p className="text-gray-600 text-xs mt-1">Conecta Supabase para ver datos.</p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {recent.map(order => (
                <div key={order.id}
                     className="flex items-center gap-4 px-5 py-3 hover:bg-white/3 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-medium truncate">{order.product_name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {order.form_data?.nombre ?? '—'} ·{' '}
                      {order.created_at
                        ? new Date(order.created_at).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })
                        : ''}
                    </p>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium
                                    ${STATUS_COLOR[order.status ?? 'pending']}`}>
                    {STATUS_LABEL[order.status ?? 'pending']}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-4">
          {/* Top product */}
          <div className="bg-[#1c2538] border border-white/10 rounded-lg p-5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
              Producto más solicitado
            </p>
            {topProduct ? (
              <>
                <p className="text-base font-semibold text-white leading-snug">{topProduct[0]}</p>
                <p className="text-sm text-gray-400 mt-1">
                  {topProduct[1]} {topProduct[1] === 1 ? 'pedido' : 'pedidos'}
                </p>
              </>
            ) : (
              <p className="text-gray-500 text-sm">Sin datos aún</p>
            )}
          </div>

          {/* Quick links */}
          <div className="bg-[#1c2538] border border-white/10 rounded-lg p-5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
              Acceso rápido
            </p>
            <div className="flex flex-col gap-1">
              {[
                { label: 'Gestionar pedidos', href: '/admin/orders' },
                { label: 'Ver clientes',      href: '/admin/clients' },
                { label: 'Analíticas',        href: '/admin/analytics' },
                { label: 'Configuración',     href: '/admin/settings' },
              ].map(l => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-sm text-gray-300 hover:text-white transition-colors
                             flex items-center gap-2 py-1.5 px-2 rounded hover:bg-white/5"
                >
                  <span className="w-1 h-1 rounded-full bg-gray-500 flex-shrink-0" />
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
