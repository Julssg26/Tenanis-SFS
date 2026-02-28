import Topbar from './Topbar'
import Sidebar from './Sidebar'

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f1f3f7]">
      <Topbar />
      <Sidebar />
      <main className="ml-[152px] mt-14 p-6 min-h-[calc(100vh-56px)]">
        {children}
      </main>
    </div>
  )
}
