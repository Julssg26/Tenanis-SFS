import type { Metadata } from 'next'
import './globals.css'
import './ol.css'
import AppShell from '@/components/shell/AppShell'

export const metadata: Metadata = {
  title:       'Tenaris Smart Fleet System',
  description: 'Industrial fleet management platform — Tenaris Tamsa',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Apply saved theme before first paint — prevents flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('tsfs-theme')||'light';document.documentElement.setAttribute('data-theme',t);}catch(e){}`,
          }}
        />
      </head>
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  )
}
