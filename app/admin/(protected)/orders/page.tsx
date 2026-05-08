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
  pending:     'bg-amber-400/15 text-amber-300 border-amber-400/20',
  in_progress: 'bg-blue-400/15 text-blue-300 border-blue-400/20',
  completed:   'bg-emerald-400/15 text-emerald-300 border-emerald-400/20',
  cancelled:   'bg-red-400/15 text-red-300 border-red-400/20',
}

export default function OrdersPage() {
  const [orders,    setOrders]    = useState<Order[]>([])
  const [loading,   setLoading]   = useState(true)
  const [filter,    setFilter]    = useState<string>('all')
  const [expanded,  setExpanded]  = useState<string | null>(null)
  const [saving,    setSaving]    = useState<string | null>(null)

  const load = () => {
    setLoading(true)
    getOrders()
      .then(setOrders)
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const filtered = filter === 'all'
    ? orders
    : orders.filter(o => (o.status ?? 'pending') === filter)

  const handleStatus = async (id: string, status: Order['status']) => {
    setSaving(id)
    try {
      await updateOrderStatus(id!, status!)
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o))
    } catch (e) { console.error(e) }
    finally { setSaving(null) }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este pedido?')) return
    try {
      await deleteOrder(id)
      setOrders(prev => prev.filter(o => o.id !== id))
    } catch (e) { console.error(e) }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif font-light text-3xl text-[#e8e4d8] mb-1">Pedidos</h1>
        <p className="text-[11px] text-[#b5aa96]/50 tracking-wide">{orders.length} pedidos en total</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['all', ...ALL_STATUSES].map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`text-[10px] tracking-[0.2em] uppercase px-4 py-2 rounded border transition-all duration-150
                        ${filter === s
                          ? 'bg-[#b5aa96]/15 border-[#b5aa96]/40 text-[#e8e4d8]'
                          : 'border-[#b5aa96]/10 text-[#b5aa96]/40 hover:border-[#b5aa96]/25 hover:text-[#b5aa96]/70'
                        }`}
          >
            {s === 'all' ? 'Todos' : STATUS_LABEL[s]}
            {' '}
            <span className="opacity-60">
              ({s === 'all' ? orders.length : orders.filter(o => (o.status ?? 'pending') === s).length})
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-[#1a2236] border border-[#b5aa96]/10 rounded overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-[#b5aa96]/30 text-sm">Cargando…</div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-[#b5aa96]/30 text-sm">
            No hay pedidos{filter !== 'all' ? ` con estado "${STATUS_LABEL[filter]}"` : ''}.
          </div>
        ) : (
          <div>
            {/* Header */}
            <div className="hidden md:grid grid-cols-[1fr_1fr_140px_140px_80px] gap-4
                            px-6 py-3 border-b border-[#b5aa96]/10
                            text-[9px] tracking-[0.3em] uppercase text-[#b5aa96]/35">
              <span>Producto</span>
              <span>Cliente</span>
              <span>Fecha</span>
              <span>Estado</span>
              <span />
            </div>

            {filtered.map(order => (
              <div key={order.id}>
                {/* Row */}
                <div
                  className={`grid grid-cols-1 md:grid-cols-[1fr_1fr_140px_140px_80px] gap-3 md:gap-4
                               px-6 py-4 border-b border-[#b5aa96]/6 cursor-pointer
                               hover:bg-[#b5aa96]/3 transition-colors
                               ${expanded === order.id ? 'bg-[#b5aa96]/4' : ''}`}
                  onClick={() => setExpanded(expanded === order.id ? null : order.id!)}
                >
                  <p className="text-[13px] text-[#e8e4d8]/85 truncate">{order.product_name}</p>
                  <p className="text-[13px] text-[#b5aa96]/60 truncate">
                    {order.form_data?.nombre ?? order.form_data?.novios ?? '—'}
                  </p>
                  <p className="text-[11px] text-[#b5aa96]/40">
                    {order.created_at
                      ? new Date(order.created_at).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: '2-digit' })
                      : '—'}
                  </p>
                  <div onClick={e => e.stopPropagation()}>
                    <select
                      value={order.status ?? 'pending'}
                      disabled={saving === order.id}
                      onChange={e => handleStatus(order.id!, e.target.value as Order['status'])}
                      className={`text-[10px] px-2 py-1.5 rounded border bg-transparent
                                  outline-none cursor-pointer disabled:opacity-40
                                  ${STATUS_COLOR[order.status ?? 'pending']}`}
                    >
                      {ALL_STATUSES.map(s => (
                        <option key={s} value={s} className="bg-[#1a2236] text-[#e8e4d8]">
                          {STATUS_LABEL[s]}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div
                    className="flex items-center gap-2"
                    onClick={e => e.stopPropagation()}
                  >
                    <button
                      onClick={() => setExpanded(expanded === order.id ? null : order.id!)}
                      className="text-[#b5aa96]/30 hover:text-[#b5aa96] transition-colors"
                      title="Ver detalles"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(order.id!)}
                      className="text-[#b5aa96]/30 hover:text-red-400 transition-colors"
                      title="Eliminar"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Expanded details */}
                {expanded === order.id && (
                  <div className="px-6 py-5 bg-[#141926] border-b border-[#b5aa96]/10">
                    <p className="text-[9px] tracking-[0.3em] uppercase text-[#b5aa96]/40 mb-4">
                      Detalles del formulario
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-4">
                      {Object.entries(order.form_data ?? {}).map(([k, v]) => (
                        <div key={k}>
                          <p className="text-[9px] tracking-[0.2em] uppercase text-[#b5aa96]/35 mb-0.5">{k}</p>
                          <p className="text-[12px] text-[#e8e4d8]/70">{v || '—'}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-[#b5aa96]/8 flex gap-6">
                      <div>
                        <p className="text-[9px] tracking-[0.2em] uppercase text-[#b5aa96]/35 mb-0.5">ID</p>
                        <p className="text-[11px] text-[#b5aa96]/40 font-mono">{order.id}</p>
                      </div>
                      <div>
                        <p className="text-[9px] tracking-[0.2em] uppercase text-[#b5aa96]/35 mb-0.5">Idioma</p>
                        <p className="text-[11px] text-[#b5aa96]/40 uppercase">{order.lang}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
