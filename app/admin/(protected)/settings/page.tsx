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
          <h2 className="text-sm font-semibold text-white">Contraseña</h2>
        </div>
        <div className="px-6 py-5">
          <p className="text-sm text-gray-400 mb-3">
            Las contraseñas se gestionan desde el panel de Supabase.
          </p>
          <a
            href="https://supabase.com/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-blue-400
                       hover:text-blue-300 transition-colors font-medium"
          >
            Ir a Supabase Dashboard
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  )
}
