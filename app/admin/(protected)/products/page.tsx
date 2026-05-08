'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getOrders, type Order } from '@/lib/supabase'

const CATALOG = [
  { number: '01', name: 'Tarjetas de Papelería',       en: 'Stationery Cards',           fields: ['ocasion', 'cantidad', 'texto', 'colores', 'nombre'] },
  { number: '02', name: 'Tarjetas Artesanales',         en: 'Handmade Cards',             fields: ['ocasion', 'cantidad', 'mensaje', 'elementos', 'papel'] },
  { number: '03', name: 'Paquete Familiar',             en: 'Family Stationery Package',  fields: ['familia', 'direccion', 'incluir', 'papel', 'sets'] },
  { number: '04', name: 'Paquete de Boda',              en: 'Wedding Stationery Package', fields: ['novios', 'fecha', 'invitados', 'estilo', 'elementos'] },
]

export default function ProductsPage() {
  const [orders,  setOrders]  = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getOrders().then(setOrders).catch(console.error).finally(() => setLoading(false))
  }, [])

  const total = orders.length

  return (
    <div className="max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-white mb-1">Productos</h1>
        <p className="text-sm text-gray-400">
          {CATALOG.length} productos · {loading ? '…' : total} pedidos totales
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {CATALOG.map(product => {
          const count  = orders.filter(o => o.product_name === product.name).length
          const latest = orders.find(o => o.product_name === product.name)
          const pct    = total > 0 ? Math.round((count / total) * 100) : 0

          return (
            <div key={product.number}
                 className="bg-[#1c2538] border border-white/10 rounded-lg p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Producto {product.number}
                  </span>
                  <h2 className="text-base font-semibold text-white mt-1">{product.name}</h2>
                  <p className="text-xs text-gray-500 mt-0.5">{product.en}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-4xl font-bold text-white">{loading ? '—' : count}</p>
                  <p className="text-xs text-gray-500 mt-0.5">pedidos</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mb-4">
                <div className="flex justify-between mb-1.5">
                  <span className="text-xs text-gray-500">% del total</span>
                  <span className="text-xs text-gray-400 font-medium">{pct}%</span>
                </div>
                <div className="h-2 bg-white/8 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white/35 rounded-full transition-all duration-700"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>

              {/* Fields */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {product.fields.map(f => (
                  <span key={f} className="text-xs px-2 py-0.5 bg-white/6 border border-white/10
                                           text-gray-400 rounded">
                    {f}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-white/8">
                <Link
                  href={`/admin/orders`}
                  className="text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors"
                >
                  Ver pedidos →
                </Link>
                {latest?.created_at && (
                  <p className="text-xs text-gray-500">
                    último: {new Date(latest.created_at).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })}
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
