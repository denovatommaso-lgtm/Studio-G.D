'use client'
import { useState, useEffect } from 'react'

export default function SettingsPage() {
  const [displayName, setDisplayName] = useState('')
  const [saved,       setSaved]       = useState(false)
  const [email,       setEmail]       = useState('')

  useEffect(() => {
    setDisplayName(localStorage.getItem('admin_display_name') ?? '')
    fetch('/api/admin/me')
      .then(r => r.json())
      .then(d => setEmail(d.email ?? ''))
      .catch(() => {})
  }, [])

  const save = (e: React.FormEvent) => {
    e.preventDefault()
    localStorage.setItem('admin_display_name', displayName.trim())
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-white mb-1">Configuración</h1>
        <p className="text-sm text-gray-400">Ajusta las preferencias de tu cuenta admin.</p>
      </div>

      {/* Account info */}
      <div className="bg-[#1c2538] border border-white/10 rounded-lg mb-6">
        <div className="px-6 py-4 border-b border-white/10">
          <h2 className="text-sm font-semibold text-white">Cuenta</h2>
        </div>
        <div className="px-6 py-5">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-white/10 border border-white/15
                            flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
              {displayName ? displayName.charAt(0).toUpperCase() : email.charAt(0).toUpperCase() || '?'}
            </div>
            <div>
              <p className="text-sm font-medium text-white">
                {displayName || <span className="text-gray-400 italic">Sin nombre de pantalla</span>}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">{email || 'Cargando…'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Display name */}
      <div className="bg-[#1c2538] border border-white/10 rounded-lg mb-6">
        <div className="px-6 py-4 border-b border-white/10">
          <h2 className="text-sm font-semibold text-white">Nombre de pantalla</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Aparece en el saludo del dashboard. Solo visible para ti.
          </p>
        </div>
        <form onSubmit={save} className="px-6 py-5">
          <div className="flex gap-3">
            <input
              type="text"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              placeholder="Ej: Mariana"
              maxLength={40}
              className="flex-1 bg-[#111624] border border-white/15 rounded-md px-4 py-2.5
                         text-sm text-white placeholder:text-gray-600
                         outline-none focus:border-white/40 transition-colors"
            />
            <button
              type="submit"
              className="px-5 py-2.5 bg-white text-[#111624] text-sm font-semibold
                         rounded-md hover:bg-gray-200 transition-colors"
            >
              {saved ? '¡Guardado!' : 'Guardar'}
            </button>
          </div>
          {saved && (
            <p className="text-xs text-emerald-400 mt-2 font-medium">
              Nombre guardado correctamente.
            </p>
          )}
        </form>
      </div>

      {/* Password note */}
      <div className="bg-[#1c2538] border border-white/10 rounded-lg">
        <div className="px-6 py-4 border-b border-white/10">
          <h2 className="text-sm font-semibold text-white">Cambiar contraseña</h2>
        </div>
        <div className="px-6 py-5 flex items-start gap-3">
          <div className="mt-0.5 flex-shrink-0">
            <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
            </svg>
          </div>
          <p className="text-sm text-gray-300 leading-relaxed">
            Para cambiar la contraseña de admin, contacta al administrador al{' '}
            <a
              href="https://wa.me/529997003170"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
            >
              +52 999 700 3170
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
