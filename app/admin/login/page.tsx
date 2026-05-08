'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/login', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email, password }),
      })
      if (res.ok) {
        router.push('/admin/dashboard')
        router.refresh()
      } else {
        const data = await res.json()
        setError(data.error ?? 'Error al ingresar')
      }
    } catch {
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0e1a] flex flex-col items-center justify-center px-6">

      {/* Logo — click to go back to site */}
      <a href="/" className="mb-10 flex flex-col items-center gap-4 group">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/isotipo.png"
          alt="Studio G.D."
          className="w-28 transition-opacity duration-200 group-hover:opacity-100"
          style={{ filter: 'brightness(0) invert(1) opacity(0.80)' }}
        />
        <div className="text-center">
          <p className="text-[9px] tracking-[0.45em] uppercase text-[#b5aa96]/60 mb-1
                         group-hover:text-[#b5aa96]/80 transition-colors">Studio G.D.</p>
          <p className="text-[8px] tracking-[0.3em] uppercase text-[#b5aa96]/35">Panel de administración</p>
        </div>
      </a>

      {/* Card */}
      <div className="w-full max-w-sm bg-[#141926] border border-[#b5aa96]/10 p-10">
        <h1 className="font-serif font-light text-2xl text-[#e8e4d8] mb-1">Acceso</h1>
        <p className="text-[11px] text-[#b5aa96]/50 tracking-wide mb-8">
          Ingresa con tu cuenta para continuar
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">

          {/* Email */}
          <div className="flex flex-col gap-2">
            <label className="text-[9px] tracking-[0.3em] uppercase text-[#b5aa96]/60">
              Correo electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="bg-transparent border-b border-[#b5aa96]/20 py-2.5 text-[14px]
                         text-[#e8e4d8] outline-none placeholder:text-[#b5aa96]/25
                         focus:border-[#b5aa96]/60 transition-colors duration-200"
              placeholder="mariana@studiogd.com"
              required
              autoFocus
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-2">
            <label className="text-[9px] tracking-[0.3em] uppercase text-[#b5aa96]/60">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="bg-transparent border-b border-[#b5aa96]/20 py-2.5 text-[14px]
                         text-[#e8e4d8] outline-none placeholder:text-[#b5aa96]/25
                         focus:border-[#b5aa96]/60 transition-colors duration-200"
              placeholder="••••••••••"
              required
            />
          </div>

          {error && (
            <p className="text-[11px] text-red-400/80 tracking-wide -mt-2">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 bg-[#b5aa96]/10 border border-[#b5aa96]/25 text-[#e8e4d8]
                       text-[10px] tracking-[0.3em] uppercase py-3.5
                       hover:bg-[#b5aa96]/20 hover:border-[#b5aa96]/50
                       transition-all duration-200 disabled:opacity-40"
          >
            {loading ? 'Ingresando…' : 'Ingresar'}
          </button>
        </form>
      </div>

      <p className="mt-8 text-[9px] text-[#b5aa96]/25 tracking-widest uppercase">
        Studio G.D. · Admin
      </p>
    </div>
  )
}
