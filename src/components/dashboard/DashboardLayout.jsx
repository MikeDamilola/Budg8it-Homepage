import MobileDashboardNav from './MobileDashboardNav'
import Sidebar from './Sidebar'
import TopBar from './TopBar'

export default function DashboardLayout({ children, rightPanel }) {
  return (
    <div className="flex min-h-screen bg-[#F5F6FA]">
      <Sidebar />
      <TopBar />

      <main className="ml-0 mt-[64px] min-h-screen flex-1 overflow-x-hidden overflow-y-auto px-4 py-6 md:ml-[220px] md:px-6">
        <MobileDashboardNav />

        {rightPanel ? (
          <div className="flex flex-col lg:flex-row lg:items-start lg:gap-6">
            <div className="min-w-0 flex-1">{children}</div>
            <div className="mt-6 hidden w-full shrink-0 flex-col gap-6 lg:mt-0 lg:flex lg:w-[280px]">
              {rightPanel}
            </div>
          </div>
        ) : (
          <div className="min-w-0">{children}</div>
        )}
      </main>
    </div>
  )
}
