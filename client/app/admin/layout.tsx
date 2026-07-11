import type React from "react"
import DashboardLayout from "@/components/dashboard-layout"
import { adminNavItems } from "@/components/admin-nav"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <DashboardLayout navItems={adminNavItems} role="admin">
      {children}
    </DashboardLayout>
  )
}
