"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LogOut, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

interface NavItem {
  title: string
  href: string
  icon: React.ReactNode
}

interface DashboardLayoutProps {
  children: React.ReactNode
  navItems: NavItem[]
  role: "admin" | "customer"
}

export default function DashboardLayout({ children, navItems, role }: DashboardLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const handleLogout = () => {
    router.push("/login")
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col w-64 bg-white border-r">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">{role === "admin" ? "Admin Panel" : "Customer Portal"}</h2>
        </div>
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                    pathname === item.href
                      ? "bg-gray-100 text-gray-900 font-medium"
                      : "text-gray-500 hover:text-gray-900 hover:bg-gray-100",
                  )}
                >
                  {item.icon}
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t">
          <Button
            variant="ghost"
            className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild className="md:hidden">
          <Button variant="ghost" size="icon" className="absolute top-4 left-4">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="p-4 border-b">
            <h2 className="text-xl font-semibold">{role === "admin" ? "Admin Panel" : "Customer Portal"}</h2>
          </div>
          <nav className="flex-1 p-4">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                      pathname === item.href
                        ? "bg-gray-100 text-gray-900 font-medium"
                        : "text-gray-500 hover:text-gray-900 hover:bg-gray-100",
                    )}
                    onClick={() => setOpen(false)}
                  >
                    {item.icon}
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="p-4 border-t">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b bg-white flex items-center justify-end px-6">
          <div className="md:hidden w-6" /> {/* Spacer for mobile menu button */}
          <h1 className="text-xl font-semibold flex-1 text-center md:text-left">Electricity Bill Management System</h1>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
