'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getOrders, type Order } from '@/lib/supabase'

const CATALOG = [
  {
    number: '01',
    name: 'Tarjetas de Papelería',
    en: 'Stationery Cards',
    desc: 'Tarjetas elegantes para toda ocasión, personalizadas con mensaje, nombre o logo.',
    fields: ['ocasion', 'cantidad', 'texto', 'colores', 'nombre'],
  },
  {
    number: '02',
    name: 'Tarjetas Artesanales',
    en: 'Handmade Cards',
    desc: 'Elaboradas a mano con papeles texturizados, sellos de cera, listones y más.',
    fields: ['ocasion', 'cantidad', 'mensaje', 'elementos', 'papel'],
  },
  {
    number: '03',
    name: 'Paquete Familiar',
    en: 'Family Stationery Package',
    desc: 'Conjunto completo con el nombre de tu familia: tarjetas, sobres y etiquetas.',
    fields: ['familia', 'direccion', 'incluir', 'papel', 'sets'],
  },
  {
    number: '04',
    name: 'Paquete de Boda',
    en: 'Wedding Stationery Package',
    desc: 'Papelería completa para tu gran día: invitaciones, RSVPs, menús, programas y más.',
    fields: ['novios', 'fecha', 'invitados', 'estilo', 'elementos'],
  },
]

export default function ProductsPage() {
  const [orders,  setOrders]  = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getOrders().then(setOrders).catch(console.error).finally(() => setLoading(false))
  }, [])

  const countFor = (name: string) => orders.filter(o => o.product_name === name).length
  const latestFor = (name: string) => {
    const o = orders.find(o => o.product_name === name)
    if (!o?.created_at) return null
    return new Date(o.created_at).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: '2-digit' })
  }

  const totalOrders = orders.length

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif font-light text-3xl text-[#e8e4d8] mb-1">Productos</h1>
        <p className="text-[11px] text-[#b5aa96]/50 tracking-wide">
          {CATALOG.length} productos · {loading ? '…' : totalOrders} pedidos totales
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {CATALOG.map(product => {
          const count  = loading ? null : countFor(product.name)
          const latest = loading ? null : latestFor(product.name)
          const pct    = totalOrders > 0 && count !== null ? Math.round((count / totalOrders) * 100) : 0

          return (
            <div key={product.number} className="bg-[#1a2236] border border-[#b5aa96]/10 rounded p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <span className="text-[9px] tracking-[0.35em] uppercase text-[#b5aa96]/35">
                    Producto {product.number}
                  </span>
                  <h2 className="font-serif font-light text-xl text-[#e8e4d8] mt-1 leading-tight">
                    {product.name}
                  </h2>
                  <p className="text-[10px] text-[#b5aa96]/35 mt-0.5">{product.en}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-3xl font-serif font-light text-[#b5aa96]">
                    {count ?? '—'}
                  </p>
                  <p className="text-[9px] text-[#b5aa96]/35 mt-0.5">pedidos</p>
                </div>
              </div>

              <p className="text-[12px] text-[#b5aa96]/45 leading-relaxed mb-5">{product.desc}</p>

              {/* Progress bar */}
              <div className="mb-4">
                <div className="flex justify-between mb-1.5">
                  <span className="text-[9px] text-[#b5aa96]/35 tracking-wide">% del total</span>
                  <span className="text-[9px] text-[#b5aa96]/50">{pct}%</span>
                </div>
                <div className="h-1 bg-[#b5aa96]/8 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#b5aa96]/40 rounded-full transition-all duration-700"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1.5">
                  {product.fields.slice(0, 4).map(f => (
                    <span key={f} className="text-[8px] tracking-wide px-2 py-0.5
                                             bg-[#b5aa96]/6 border border-[#b5aa96]/10
                                             text-[#b5aa96]/40 rounded-full">
                      {f}
                    </span>
                  ))}
                </div>
                {latest && (
                  <p className="text-[9px] text-[#b5aa96]/30">último: {latest}</p>
                )}
              </div>

              <div className="mt-5 pt-4 border-t border-[#b5aa96]/8">
                <Link
                  href={`/admin/orders?product=${encodeURIComponent(product.name)}`}
                  className="text-[10px] tracking-[0.2em] uppercase text-[#b5aa96]/40
                             hover:text-[#b5aa96]/70 transition-colors"
                >
                  Ver pedidos de este producto →
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
