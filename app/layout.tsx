import type { Metadata } from 'next'
import './globals.css'
import './ol.css'
import AppShell from '@/components/shell/AppShell'
import ChatBot from '@/components/ui/ChatBot'

export const metadata: Metadata = {
  title: 'Tenaris Smart Fleet System',
  description: 'Real-time fleet management and intelligence platform',
  icons: {
    icon: 'app/favicon.ico',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppShell>
          {children}
        </AppShell>
        <ChatBot />
      </body>
    </html>
  )
}