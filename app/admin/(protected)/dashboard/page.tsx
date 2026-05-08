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
  pending:     'bg-amber-400/15 text-amber-300',
  in_progress: 'bg-blue-400/15 text-blue-300',
  completed:   'bg-emerald-400/15 text-emerald-300',
  cancelled:   'bg-red-400/15 text-red-300',
}

export default function Dashboard() {
  const [orders,  setOrders]  = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getOrders()
      .then(setOrders)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const total       = orders.length
  const pending     = orders.filter(o => o.status === 'pending' || !o.status).length
  const inProgress  = orders.filter(o => o.status === 'in_progress').length
  const completed   = orders.filter(o => o.status === 'completed').length

  const recent = orders.slice(0, 8)

  const productCounts = orders.reduce<Record<string, number>>((acc, o) => {
    acc[o.product_name] = (acc[o.product_name] ?? 0) + 1
    return acc
  }, {})
  const topProduct = Object.entries(productCounts).sort((a, b) => b[1] - a[1])[0]

  const stats = [
    { label: 'Total pedidos',  value: total,      sub: 'histórico',    color: 'text-[#b5aa96]' },
    { label: 'Pendientes',     value: pending,    sub: 'por atender',  color: 'text-amber-300' },
    { label: 'En proceso',     value: inProgress, sub: 'en curso',     color: 'text-blue-300'  },
    { label: 'Completados',    value: completed,  sub: 'entregados',   color: 'text-emerald-300'},
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif font-light text-3xl text-[#e8e4d8] mb-1">Dashboard</h1>
        <p className="text-[11px] text-[#b5aa96]/50 tracking-wide">Vista general de Studio G.D.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(s => (
          <div key={s.label} className="bg-[#1a2236] border border-[#b5aa96]/10 p-5 rounded">
            <p className="text-[9px] tracking-[0.3em] uppercase text-[#b5aa96]/45 mb-3">{s.label}</p>
            <p className={`text-4xl font-serif font-light ${s.color}`}>
              {loading ? '—' : s.value}
            </p>
            <p className="text-[10px] text-[#b5aa96]/30 mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent orders */}
        <div className="lg:col-span-2 bg-[#1a2236] border border-[#b5aa96]/10 rounded">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#b5aa96]/10">
            <h2 className="text-[11px] tracking-[0.25em] uppercase text-[#b5aa96]/70">Pedidos recientes</h2>
            <Link href="/admin/orders" className="text-[10px] text-[#b5aa96]/40 hover:text-[#b5aa96] transition-colors">
              Ver todos →
            </Link>
          </div>

          {loading ? (
            <div className="px-6 py-12 text-center text-[#b5aa96]/30 text-sm">Cargando…</div>
          ) : recent.length === 0 ? (
            <div className="px-6 py-12 text-center text-[#b5aa96]/30 text-sm">
              No hay pedidos aún.{' '}
              <span className="block text-[10px] mt-1 text-[#b5aa96]/20">
                Conecta Supabase para empezar a ver datos.
              </span>
            </div>
          ) : (
            <div className="divide-y divide-[#b5aa96]/6">
              {recent.map(order => (
                <div key={order.id} className="flex items-center gap-4 px-6 py-3.5 hover:bg-[#b5aa96]/3 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] text-[#e8e4d8]/80 truncate">{order.product_name}</p>
                    <p className="text-[10px] text-[#b5aa96]/40 mt-0.5">
                      {order.form_data?.nombre ?? '—'} ·{' '}
                      {order.created_at ? new Date(order.created_at).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' }) : ''}
                    </p>
                  </div>
                  <span className={`text-[9px] tracking-wide px-2 py-1 rounded-full ${STATUS_COLOR[order.status ?? 'pending']}`}>
                    {STATUS_LABEL[order.status ?? 'pending']}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick info */}
        <div className="flex flex-col gap-4">
          {/* Top product */}
          <div className="bg-[#1a2236] border border-[#b5aa96]/10 rounded p-6">
            <p className="text-[9px] tracking-[0.3em] uppercase text-[#b5aa96]/45 mb-3">Producto más solicitado</p>
            {topProduct ? (
              <>
                <p className="font-serif font-light text-xl text-[#e8e4d8] leading-snug">{topProduct[0]}</p>
                <p className="text-[11px] text-[#b5aa96]/40 mt-2">{topProduct[1]} {topProduct[1] === 1 ? 'pedido' : 'pedidos'}</p>
              </>
            ) : (
              <p className="text-[#b5aa96]/30 text-sm">Sin datos</p>
            )}
          </div>

          {/* Quick links */}
          <div className="bg-[#1a2236] border border-[#b5aa96]/10 rounded p-6">
            <p className="text-[9px] tracking-[0.3em] uppercase text-[#b5aa96]/45 mb-4">Acceso rápido</p>
            <div className="flex flex-col gap-2">
              {[
                { label: 'Gestionar pedidos', href: '/admin/orders' },
                { label: 'Ver clientes',      href: '/admin/clients' },
                { label: 'Analíticas',        href: '/admin/analytics' },
                { label: 'Productos',         href: '/admin/products' },
              ].map(l => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-[12px] text-[#b5aa96]/55 hover:text-[#e8e4d8] transition-colors
                             flex items-center gap-2 py-1"
                >
                  <span className="w-1 h-1 rounded-full bg-[#b5aa96]/30 flex-shrink-0" />
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
