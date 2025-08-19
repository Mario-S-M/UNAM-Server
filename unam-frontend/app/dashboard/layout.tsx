import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import AppSidebar from "@/components/SideBar-Navigation"
import { AuthProvider } from "@/contexts/AuthContext"

export const metadata ={
  title: "Dashboard - UNAM",
  description: "Panel de control de UNAM"
}
 
export default function SideBarLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <SidebarProvider>
        <AppSidebar />
        <main className="flex-1">
          <div className="flex items-center gap-2 p-4 border-b">
            <SidebarTrigger className="h-8 w-8" />
            <h1 className="text-lg font-semibold">Dashboard</h1>
          </div>
          <div className="p-4">
            {children}
          </div>
        </main>
      </SidebarProvider>
    </AuthProvider>
  )
}