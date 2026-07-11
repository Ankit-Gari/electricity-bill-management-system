"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, Download } from "lucide-react"

// Sample data
const initialBills = [
  {
    id: 1,
    customer: "John Smith",
    connectionId: "CID10045",
    amount: 124.5,
    month: "April",
    year: 2024,
    status: "Unpaid",
    dueDate: "2024-05-15",
  },
  {
    id: 2,
    customer: "Sarah Johnson",
    connectionId: "CID10046",
    amount: 98.75,
    month: "April",
    year: 2024,
    status: "Paid",
    dueDate: "2024-05-15",
  },
  {
    id: 3,
    customer: "Michael Brown",
    connectionId: "CID10047",
    amount: 145.2,
    month: "April",
    year: 2024,
    status: "Unpaid",
    dueDate: "2024-05-20",
  },
  {
    id: 4,
    customer: "Emily Davis",
    connectionId: "CID10048",
    amount: 112.3,
    month: "April",
    year: 2024,
    status: "Unpaid",
    dueDate: "2024-05-18",
  },
  {
    id: 5,
    customer: "Robert Wilson",
    connectionId: "CID10049",
    amount: 87.6,
    month: "April",
    year: 2024,
    status: "Paid",
    dueDate: "2024-05-12",
  },
  {
    id: 6,
    customer: "Jennifer Taylor",
    connectionId: "CID10050",
    amount: 132.4,
    month: "April",
    year: 2024,
    status: "Unpaid",
    dueDate: "2024-05-22",
  },
  {
    id: 7,
    customer: "David Miller",
    connectionId: "CID10051",
    amount: 104.9,
    month: "April",
    year: 2024,
    status: "Paid",
    dueDate: "2024-05-10",
  },
  {
    id: 8,
    customer: "Lisa Anderson",
    connectionId: "CID10052",
    amount: 118.75,
    month: "April",
    year: 2024,
    status: "Unpaid",
    dueDate: "2024-05-25",
  },
]

export default function ViewBillsPage() {
  const [bills, setBills] = useState(initialBills)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredBills = bills.filter((bill) => {
    const matchesSearch =
      bill.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.connectionId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || bill.status.toLowerCase() === statusFilter.toLowerCase()

    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">View Bills</h2>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Search customer or connection ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-80"
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="unpaid">Unpaid</SelectItem>
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
              <TableHead>Month</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBills.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  No bills found
                </TableCell>
              </TableRow>
            ) : (
              filteredBills.map((bill) => (
                <TableRow key={bill.id}>
                  <TableCell className="font-medium">{bill.customer}</TableCell>
                  <TableCell>{bill.connectionId}</TableCell>
                  <TableCell>{`${bill.month} ${bill.year}`}</TableCell>
                  <TableCell>${bill.amount.toFixed(2)}</TableCell>
                  <TableCell>{bill.dueDate}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        bill.status === "Paid" ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"
                      }`}
                    >
                      {bill.status}
                    </span>
                  </TableCell>
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
