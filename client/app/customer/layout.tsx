import type React from "react"
import DashboardLayout from "@/components/dashboard-layout"
import { customerNavItems } from "@/components/customer-nav"

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <DashboardLayout navItems={customerNavItems} role="customer">
      {children}
    </DashboardLayout>
  )
}
