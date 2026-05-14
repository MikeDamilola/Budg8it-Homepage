import QuickActions from './QuickActions'
import RecentTransactions from './RecentTransactions'
import Sidebar from './Sidebar'
import StoreLinkCard from './StoreLinkCard'
import TopBar from './TopBar'

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#F5F6FA]">
      <Sidebar />
      <TopBar />

      <main className="ml-0 mt-[64px] min-h-screen flex-1 overflow-y-auto px-4 py-6 md:ml-[220px] md:px-6 lg:mr-[280px]">
        {children}
      </main>

      <aside className="fixed right-0 top-[64px] bottom-0 z-30 hidden w-[280px] flex-col gap-6 overflow-y-auto border-l border-gray-100 bg-white px-5 py-6 lg:flex">
        <QuickActions />
        <StoreLinkCard />
        <RecentTransactions />
      </aside>
    </div>
  )
}
