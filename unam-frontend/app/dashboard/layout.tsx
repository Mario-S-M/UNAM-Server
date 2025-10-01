import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import AppSidebar from "@/components/SideBar-Navigation"
import { DashboardProvider } from "@/contexts/DashboardContext"

export const metadata ={
  title: "Dashboard - UNAM",
  description: "Panel de control de UNAM"
}
 
export default function SideBarLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardProvider>
      <SidebarProvider>
        <AppSidebar />
        <main className="flex-1">
          <div className="flex items-center gap-2 p-4 border-b">
            <SidebarTrigger className="h-8 w-8" />
          </div>
          <div className="p-4">
            {children}
          </div>
        </main>
      </SidebarProvider>
    </DashboardProvider>
  )
}