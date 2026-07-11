"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, Eye } from "lucide-react"

// Sample data
const initialPayments = [
  {
    id: 1,
    customer: "Sarah Johnson",
    connectionId: "CID10046",
    amount: 98.75,
    billMonth: "April 2024",
    paidOn: "2024-04-10",
    method: "Credit Card",
  },
  {
    id: 2,
    customer: "Robert Wilson",
    connectionId: "CID10049",
    amount: 87.6,
    billMonth: "April 2024",
    paidOn: "2024-04-08",
    method: "Bank Transfer",
  },
  {
    id: 3,
    customer: "David Miller",
    connectionId: "CID10051",
    amount: 104.9,
    billMonth: "April 2024",
    paidOn: "2024-04-05",
    method: "Credit Card",
  },
  {
    id: 4,
    customer: "Jennifer Taylor",
    connectionId: "CID10050",
    amount: 132.4,
    billMonth: "March 2024",
    paidOn: "2024-03-18",
    method: "Credit Card",
  },
  {
    id: 5,
    customer: "Michael Brown",
    connectionId: "CID10047",
    amount: 145.2,
    billMonth: "March 2024",
    paidOn: "2024-03-15",
    method: "Bank Transfer",
  },
  {
    id: 6,
    customer: "Emily Davis",
    connectionId: "CID10048",
    amount: 112.3,
    billMonth: "March 2024",
    paidOn: "2024-03-12",
    method: "Credit Card",
  },
  {
    id: 7,
    customer: "John Smith",
    connectionId: "CID10045",
    amount: 124.5,
    billMonth: "March 2024",
    paidOn: "2024-03-10",
    method: "Bank Transfer",
  },
  {
    id: 8,
    customer: "Lisa Anderson",
    connectionId: "CID10052",
    amount: 118.75,
    billMonth: "March 2024",
    paidOn: "2024-03-05",
    method: "Credit Card",
  },
]

export default function ViewPaymentsPage() {
  const [payments, setPayments] = useState(initialPayments)
  const [searchTerm, setSearchTerm] = useState("")
  const [monthFilter, setMonthFilter] = useState("all")

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.connectionId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesMonth = monthFilter === "all" || payment.billMonth.includes(monthFilter)

    return matchesSearch && matchesMonth
  })

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">View Payments</h2>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Search customer or connection ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-80"
          />
          <Select value={monthFilter} onValueChange={setMonthFilter}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Filter by month" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Months</SelectItem>
              <SelectItem value="April 2024">April 2024</SelectItem>
              <SelectItem value="March 2024">March 2024</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Connection ID</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Bill Month</TableHead>
              <TableHead>Paid On</TableHead>
              <TableHead>Payment Method</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPayments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  No payments found
                </TableCell>
              </TableRow>
            ) : (
              filteredPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">{payment.customer}</TableCell>
                  <TableCell>{payment.connectionId}</TableCell>
                  <TableCell>${payment.amount.toFixed(2)}</TableCell>
                  <TableCell>{payment.billMonth}</TableCell>
                  <TableCell>{payment.paidOn}</TableCell>
                  <TableCell>{payment.method}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
