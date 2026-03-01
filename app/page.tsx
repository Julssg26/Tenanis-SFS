'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  function handleSSO() {
    if (loading) return
    setLoading(true)
    setTimeout(() => {
      localStorage.setItem('isAuth', '1')
      router.replace('/dashboard')
    }, 3000)
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        backgroundImage: 'url(/images/login/login-fondo.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Overlay oscuro */}
      <div className="absolute inset-0 bg-black/30 pointer-events-none" />

      {/* Card */}
      <div
        className="relative z-10 w-full max-w-[380px] mx-4 rounded-2xl px-10 py-10 flex flex-col items-center"
        style={{ background: '#ffffff', boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}
      >
        {/* Bienvenido a */}
        <p className="text-[13px] text-gray-400 mb-3">Bienvenido a</p>

        {/* Isotipo */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/isotipo.png"
          alt="Isotipo"
          style={{ width: 88, height: 88, objectFit: 'contain', marginBottom: 12 }}
        />

        {/* Nombre de la app */}
        <h1 className="text-[19px] font-bold text-[#1a237e] text-center leading-snug mb-8">
          Tenaris Smart<br />Fleet System
        </h1>

        {/* Botón SSO — única forma de login */}
        <button
          onClick={handleSSO}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 rounded-lg py-3 text-[14px] font-semibold text-white"
          style={{
            background: '#1a237e',
            opacity: loading ? 0.75 : 1,
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'opacity 0.2s',
          }}
        >
          {loading ? (
            <>
              <svg
                className="animate-spin"
                width="16" height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
              >
                <path d="M21 12a9 9 0 1 1-6.219-8.56" strokeLinecap="round" />
              </svg>
              Loading…
            </>
          ) : (
            <>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="7.5" cy="15.5" r="5.5" />
                <path d="M21 2l-9.6 9.6" />
                <path d="M15.5 7.5l3 3L22 7l-3-3" />
              </svg>
              Login with your SSO Tenaris account
            </>
          )}
        </button>

        {/* Separador decorativo */}
        <div className="w-full h-px bg-gray-200 my-7" />

        {/* Logo Tenaris inferior */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/tenaris-logo.png"
          alt="Tenaris"
          style={{ width: 110, objectFit: 'contain' }}
        />
      </div>
    </div>
  )
}
