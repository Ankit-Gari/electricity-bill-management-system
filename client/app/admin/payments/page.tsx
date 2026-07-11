"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { apiFetch } from "@/lib/api"

interface Payment {
  id: number
  c_id: number
  name: string | null
  bill_amt: string
  method: string | null
  bill_paid_date: string
}

export default function ViewPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    apiFetch("/api/bills/paid")
      .then((json) => setPayments(json.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const filteredPayments = payments.filter(
    (payment) =>
      (payment.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      `cid${payment.c_id}`.includes(searchTerm.toLowerCase()),
  )

  if (loading) return <div className="p-4">Loading...</div>
  if (error) return <div className="p-4 text-red-500">{error}</div>

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">View Payments</h2>

      <Input
        placeholder="Search customer or connection ID..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-80"
      />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Connection ID</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Paid On</TableHead>
              <TableHead>Payment Method</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPayments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No payments found
                </TableCell>
              </TableRow>
            ) : (
              filteredPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">{payment.name || "Unknown"}</TableCell>
                  <TableCell>CID{payment.c_id}</TableCell>
                  <TableCell>₹{Number(payment.bill_amt).toFixed(2)}</TableCell>
                  <TableCell>{new Date(payment.bill_paid_date).toLocaleString()}</TableCell>
                  <TableCell>{payment.method || "Card"}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
