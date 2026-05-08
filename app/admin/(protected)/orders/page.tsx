'use client'
import { useEffect, useState } from 'react'
import { getOrders, updateOrderStatus, deleteOrder, type Order } from '@/lib/supabase'

const ALL_STATUSES = ['pending', 'in_progress', 'completed', 'cancelled'] as const

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

export default function OrdersPage() {
  const [orders,   setOrders]   = useState<Order[]>([])
  const [loading,  setLoading]  = useState(true)
  const [filter,   setFilter]   = useState<string>('all')
  const [expanded, setExpanded] = useState<string | null>(null)
  const [saving,   setSaving]   = useState<string | null>(null)

  const load = () => {
    setLoading(true)
    getOrders().then(setOrders).catch(console.error).finally(() => setLoading(false))
  }

  useEffect(load, [])

  const filtered = filter === 'all'
    ? orders
    : orders.filter(o => (o.status ?? 'pending') === filter)

  const handleStatus = async (id: string, status: Order['status']) => {
    setSaving(id)
    try {
      await updateOrderStatus(id, status!)
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o))
    } catch (e) { console.error(e) }
    finally { setSaving(null) }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este pedido? Esta acción no se puede deshacer.')) return
    try {
      await deleteOrder(id)
      setOrders(prev => prev.filter(o => o.id !== id))
    } catch (e) { console.error(e) }
  }

  return (
    <div className="max-w-6xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-white mb-1">Pedidos</h1>
        <p className="text-sm text-gray-400">{orders.length} pedidos en total</p>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-5">
        {['all', ...ALL_STATUSES].map(s => {
          const count = s === 'all' ? orders.length : orders.filter(o => (o.status ?? 'pending') === s).length
          return (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`text-xs font-medium px-4 py-2 rounded-md border transition-all
                          ${filter === s
                            ? 'bg-white text-[#111624] border-white'
                            : 'border-white/15 text-gray-400 hover:text-white hover:border-white/30'
                          }`}
            >
              {s === 'all' ? 'Todos' : STATUS_LABEL[s]} ({count})
            </button>
          )
        })}
      </div>

      {/* Table */}
      <div className="bg-[#1c2538] border border-white/10 rounded-lg overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-gray-500 text-sm">Cargando…</div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-gray-500 text-sm">
            {filter === 'all' ? 'No hay pedidos aún.' : `Sin pedidos con estado "${STATUS_LABEL[filter]}".`}
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="hidden md:grid grid-cols-[1fr_1fr_140px_160px_80px] gap-4
                            px-5 py-3 border-b border-white/10
                            text-xs font-semibold text-gray-400 uppercase tracking-wide bg-white/3">
              <span>Producto</span>
              <span>Cliente</span>
              <span>Fecha</span>
              <span>Estado</span>
              <span />
            </div>

            {filtered.map(order => (
              <div key={order.id}>
                <div
                  className={`grid grid-cols-1 md:grid-cols-[1fr_1fr_140px_160px_80px] gap-3 md:gap-4
                               px-5 py-4 border-b border-white/5 cursor-pointer
                               hover:bg-white/3 transition-colors
                               ${expanded === order.id ? 'bg-white/4' : ''}`}
                  onClick={() => setExpanded(expanded === order.id ? null : order.id!)}
                >
                  <p className="text-sm text-white font-medium truncate">{order.product_name}</p>
                  <p className="text-sm text-gray-300 truncate">
                    {order.form_data?.nombre ?? order.form_data?.novios ?? '—'}
                  </p>
                  <p className="text-sm text-gray-400">
                    {order.created_at
                      ? new Date(order.created_at).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: '2-digit' })
                      : '—'}
                  </p>
                  <div onClick={e => e.stopPropagation()}>
                    <select
                      value={order.status ?? 'pending'}
                      disabled={saving === order.id}
                      onChange={e => handleStatus(order.id!, e.target.value as Order['status'])}
                      className={`text-xs px-2.5 py-1.5 rounded-md border bg-transparent
                                  outline-none cursor-pointer disabled:opacity-40
                                  ${STATUS_COLOR[order.status ?? 'pending']}`}
                    >
                      {ALL_STATUSES.map(s => (
                        <option key={s} value={s} className="bg-[#1c2538] text-white">
                          {STATUS_LABEL[s]}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center gap-3" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => setExpanded(expanded === order.id ? null : order.id!)}
                      className="text-gray-500 hover:text-white transition-colors"
                      title="Ver detalles"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(order.id!)}
                      className="text-gray-500 hover:text-red-400 transition-colors"
                      title="Eliminar"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Expanded */}
                {expanded === order.id && (
                  <div className="px-5 py-5 bg-[#111624] border-b border-white/10">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">
                      Datos del formulario
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-4">
                      {Object.entries(order.form_data ?? {}).map(([k, v]) => (
                        <div key={k}>
                          <p className="text-xs text-gray-500 uppercase tracking-wide mb-0.5">{k}</p>
                          <p className="text-sm text-gray-200">{v || '—'}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/8 flex gap-6">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-0.5">ID</p>
                        <p className="text-xs text-gray-500 font-mono">{order.id}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-0.5">Idioma</p>
                        <p className="text-xs text-gray-400 uppercase">{order.lang}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  )
}
