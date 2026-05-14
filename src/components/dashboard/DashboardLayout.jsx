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

      <main className="ml-0 mt-[64px] min-h-screen flex-1 overflow-y-auto px-4 py-6 md:ml-[220px] md:px-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:gap-6">
          <div className="min-w-0 flex-1">{children}</div>

          <div className="mt-6 hidden w-full shrink-0 flex-col gap-6 lg:mt-0 lg:flex lg:w-[280px]">
            <QuickActions />
            <div className="mt-2 flex flex-col gap-6">
              <StoreLinkCard />
              <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <RecentTransactions />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
