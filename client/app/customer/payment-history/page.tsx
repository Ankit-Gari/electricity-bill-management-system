"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { apiFetch } from "@/lib/api"

interface Payment {
  id: number
  bill_amt: string
  method: string | null
  bill_paid_date: string
}

export default function PaymentHistoryPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    apiFetch("/api/bills/paid/user")
      .then((json) => setPayments(json.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="p-4">Loading...</div>
  if (error) return <div className="p-4 text-red-500">{error}</div>

  const totalPaid = payments.reduce((sum, p) => sum + Number(p.bill_amt), 0)
  const averageBill = payments.length ? totalPaid / payments.length : 0

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Payment History</h2>

      <Card>
        <CardHeader>
          <CardTitle>Recent Payments</CardTitle>
          <CardDescription>View all your past payments</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Payment ID</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Paid On</TableHead>
                <TableHead>Payment Method</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    No payments yet
                  </TableCell>
                </TableRow>
              ) : (
                payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">PAY-{payment.id}</TableCell>
                    <TableCell>₹{Number(payment.bill_amt).toFixed(2)}</TableCell>
                    <TableCell>{new Date(payment.bill_paid_date).toLocaleString()}</TableCell>
                    <TableCell>{payment.method || "Card"}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment Summary</CardTitle>
          <CardDescription>Your payment statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Total Paid</p>
              <p className="text-2xl font-bold">₹{totalPaid.toFixed(2)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Average Payment</p>
              <p className="text-2xl font-bold">₹{averageBill.toFixed(2)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Payments Made</p>
              <p className="text-2xl font-bold">{payments.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
