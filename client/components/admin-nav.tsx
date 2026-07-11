import { BarChart, Users, FileText, DollarSign, Inbox, AlertCircle } from "lucide-react"

export const adminNavItems = [
  {
    title: "Overview",
    href: "/admin/dashboard",
    icon: <BarChart className="h-4 w-4" />,
  },
  {
    title: "Manage Customers",
    href: "/admin/customers",
    icon: <Users className="h-4 w-4" />,
  },
  {
    title: "Generate Bill",
    href: "/admin/generate-bill",
    icon: <FileText className="h-4 w-4" />,
  },
  {
    title: "View Bills",
    href: "/admin/bills",
    icon: <FileText className="h-4 w-4" />,
  },
  {
    title: "View Payments",
    href: "/admin/payments",
    icon: <DollarSign className="h-4 w-4" />,
  },
  {
    title: "Inbox",
    href: "/admin/inbox",
    icon: <Inbox className="h-4 w-4" />,
  },
  {
    title: "Complaints",
    href: "/admin/complaints",
    icon: <AlertCircle className="h-4 w-4" />,
  },
]
