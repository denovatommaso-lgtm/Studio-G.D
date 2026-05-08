'use client'
import { useEffect, useState, useMemo } from 'react'
import { getOrders, type Order } from '@/lib/supabase'

interface Client {
  name: string
  phone: string
  orders: Order[]
  lastOrder: string
}

export default function ClientsPage() {
  const [orders,   setOrders]   = useState<Order[]>([])
  const [loading,  setLoading]  = useState(true)
  const [search,   setSearch]   = useState('')
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    getOrders().then(setOrders).catch(console.error).finally(() => setLoading(false))
  }, [])

  const clients = useMemo<Client[]>(() => {
    const map = new Map<string, Client>()
    orders.forEach(order => {
      const name = (order.form_data?.nombre ?? order.form_data?.novios ?? '').trim()
      if (!name) return
      const key = name.toLowerCase()
      if (!map.has(key)) {
        map.set(key, { name, phone: order.form_data?.telefono ?? '', orders: [], lastOrder: order.created_at ?? '' })
      }
      const client = map.get(key)!
      client.orders.push(order)
      if (order.created_at && order.created_at > client.lastOrder) client.lastOrder = order.created_at
    })
    return Array.from(map.values()).sort((a, b) => b.lastOrder.localeCompare(a.lastOrder))
  }, [orders])

  const filtered = search.trim()
    ? clients.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search))
    : clients

  return (
    <div className="max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-white mb-1">Clientes</h1>
        <p className="text-sm text-gray-400">{loading ? '…' : `${clients.length} clientes únicos`}</p>
      </div>

      {/* Search */}
      <div className="relative mb-5 max-w-sm">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"
             fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        <input
          type="text"
          placeholder="Buscar por nombre o teléfono…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-[#1c2538] border border-white/15 rounded-md pl-9 pr-4 py-2.5
                     text-sm text-white placeholder:text-gray-600
                     outline-none focus:border-white/40 transition-colors"
        />
      </div>

      <div className="bg-[#1c2538] border border-white/10 rounded-lg overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-gray-500 text-sm">Cargando…</div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-gray-500 text-sm">
            {search ? `Sin resultados para "${search}"` : 'No hay clientes aún.'}
          </div>
        ) : (
          <>
            <div className="hidden md:grid grid-cols-[1fr_160px_80px_160px] gap-4 px-5 py-3
                            border-b border-white/10 bg-white/3
                            text-xs font-semibold text-gray-400 uppercase tracking-wide">
              <span>Nombre</span>
              <span>Teléfono</span>
              <span>Pedidos</span>
              <span>Último pedido</span>
            </div>

            {filtered.map(client => (
              <div key={client.name.toLowerCase()}>
                <div
                  className={`grid grid-cols-1 md:grid-cols-[1fr_160px_80px_160px] gap-3 md:gap-4
                               px-5 py-4 border-b border-white/5 cursor-pointer
                               hover:bg-white/3 transition-colors
                               ${expanded === client.name ? 'bg-white/4' : ''}`}
                  onClick={() => setExpanded(expanded === client.name ? null : client.name)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/10 border border-white/15
                                    flex items-center justify-center text-sm text-white
                                    font-semibold flex-shrink-0">
                      {client.name.charAt(0).toUpperCase()}
                    </div>
                    <p className="text-sm text-white font-medium">{client.name}</p>
                  </div>
                  <p className="text-sm text-gray-300">
                    {client.phone || <span className="text-gray-500 italic text-xs">sin teléfono</span>}
                  </p>
                  <p className="text-sm text-gray-300 font-medium">{client.orders.length}</p>
                  <p className="text-sm text-gray-400">
                    {client.lastOrder
                      ? new Date(client.lastOrder).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: '2-digit' })
                      : '—'}
                  </p>
                </div>

                {expanded === client.name && (
                  <div className="px-5 py-4 bg-[#111624] border-b border-white/10">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                      Pedidos de {client.name}
                    </p>
                    <div className="flex flex-col gap-2">
                      {client.orders.map(o => (
                        <div key={o.id} className="flex items-center justify-between
                                                    py-2.5 px-4 bg-[#1c2538] rounded-md border border-white/5">
                          <div>
                            <p className="text-sm text-white font-medium">{o.product_name}</p>
                            <p className="text-xs text-gray-400 mt-0.5">
                              {o.created_at ? new Date(o.created_at).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}
                            </p>
                          </div>
                          <span className={`text-xs px-2.5 py-1 rounded-full font-medium
                            ${o.status === 'completed' ? 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/30'
                              : o.status === 'in_progress' ? 'bg-blue-400/20 text-blue-300 border border-blue-400/30'
                              : o.status === 'cancelled' ? 'bg-red-400/20 text-red-300 border border-red-400/30'
                              : 'bg-amber-400/20 text-amber-300 border border-amber-400/30'}`}>
                            {o.status === 'completed' ? 'Completado'
                              : o.status === 'in_progress' ? 'En proceso'
                              : o.status === 'cancelled' ? 'Cancelado'
                              : 'Pendiente'}
                          </span>
                        </div>
                      ))}
                    </div>
                    {client.phone && (
                      <a
                        href={`https://wa.me/${client.phone.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 mt-4 text-sm font-medium
                                   text-emerald-400 hover:text-emerald-300 transition-colors"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.118.554 4.103 1.523 5.826L.057 23.856a.5.5 0 00.609.609l6.03-1.466A11.943 11.943 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.648-.52-5.152-1.426l-.369-.22-3.827.93.93-3.827-.22-.37A9.937 9.937 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                        </svg>
                        Contactar por WhatsApp
                      </a>
                    )}
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
