import { BarChart, FileText, CreditCard, History, AlertCircle, Inbox, Lock } from "lucide-react"

export const customerNavItems = [
  {
    title: "Dashboard",
    href: "/customer/dashboard",
    icon: <BarChart className="h-4 w-4" />,
  },
  {
    title: "View Bill",
    href: "/customer/bill",
    icon: <FileText className="h-4 w-4" />,
  },
  {
    title: "Pay Bill",
    href: "/customer/pay-bill",
    icon: <CreditCard className="h-4 w-4" />,
  },
  {
    title: "Payment History",
    href: "/customer/payment-history",
    icon: <History className="h-4 w-4" />,
  },
  {
    title: "Submit Complaint",
    href: "/customer/submit-complaint",
    icon: <AlertCircle className="h-4 w-4" />,
  },
  {
    title: "Inbox",
    href: "/customer/inbox",
    icon: <Inbox className="h-4 w-4" />,
  },
  {
    title: "Change Password",
    href: "/customer/change-password",
    icon: <Lock className="h-4 w-4" />,
  },
]
