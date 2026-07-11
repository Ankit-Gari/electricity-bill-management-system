"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2 } from "lucide-react"
import { apiFetch } from "@/lib/api"

interface Bill {
  bill_id: number
  c_id: number
  name: string | null
  amt_topay: string
  due_date: string
  status: "paid" | "unpaid"
}

export default function ViewBillsPage() {
  const [bills, setBills] = useState<Bill[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const loadBills = () => {
    apiFetch("/api/bills")
      .then((json) => setBills(json.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(loadBills, [])

  const handleDelete = async (billId: number) => {
    if (!confirm("Delete this bill?")) return
    try {
      await apiFetch(`/api/bills/${billId}`, { method: "DELETE" })
      setBills(bills.filter((b) => b.bill_id !== billId))
    } catch (err: any) {
      alert(err.message)
    }
  }

  const filteredBills = bills.filter((bill) => {
    const matchesSearch =
      (bill.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      `cid${bill.c_id}`.includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || bill.status === statusFilter

    return matchesSearch && matchesStatus
  })

  if (loading) return <div className="p-4">Loading...</div>
  if (error) return <div className="p-4 text-red-500">{error}</div>

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">View Bills</h2>

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

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Connection ID</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBills.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No bills found
                </TableCell>
              </TableRow>
            ) : (
              filteredBills.map((bill) => (
                <TableRow key={bill.bill_id}>
                  <TableCell className="font-medium">{bill.name || "Unknown"}</TableCell>
                  <TableCell>CID{bill.c_id}</TableCell>
                  <TableCell>₹{Number(bill.amt_topay).toFixed(2)}</TableCell>
                  <TableCell>{bill.due_date ? new Date(bill.due_date).toLocaleDateString() : "-"}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        bill.status === "paid" ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"
                      }`}
                    >
                      {bill.status === "paid" ? "Paid" : "Unpaid"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(bill.bill_id)}>
                      <Trash2 className="h-4 w-4" />
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
