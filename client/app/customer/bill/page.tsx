"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CreditCard } from "lucide-react"
import Link from "next/link"
import { apiFetch } from "@/lib/api"

interface Bill {
  bill_id: number
  c_id: number
  amt_topay: string
  due_date: string
  status: "paid" | "unpaid"
}

export default function ViewBillPage() {
  const [bills, setBills] = useState<Bill[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    apiFetch("/api/bills/user")
      .then((json) => setBills(json.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="p-4">Loading...</div>
  if (error) return <div className="p-4 text-red-500">{error}</div>

  const currentBill = bills.find((b) => b.status === "unpaid")

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">My Bills</h2>

      {currentBill ? (
        <Card>
          <CardHeader>
            <CardTitle>Current Bill</CardTitle>
            <CardDescription>Bill ID: BILL-{currentBill.bill_id}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Amount Due</p>
                <p className="text-2xl font-bold">₹{Number(currentBill.amt_topay).toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Due Date</p>
                <p className="text-2xl font-bold">{new Date(currentBill.due_date).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="text-2xl font-bold text-orange-500">Unpaid</p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/customer/pay-bill">
                <CreditCard className="mr-2 h-4 w-4" />
                Pay Now
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            You have no unpaid bills. 🎉
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All Bills</CardTitle>
          <CardDescription>Your complete billing history</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bill ID</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bills.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    No bills found
                  </TableCell>
                </TableRow>
              ) : (
                bills.map((bill) => (
                  <TableRow key={bill.bill_id}>
                    <TableCell className="font-medium">BILL-{bill.bill_id}</TableCell>
                    <TableCell>₹{Number(bill.amt_topay).toFixed(2)}</TableCell>
                    <TableCell>{new Date(bill.due_date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          bill.status === "paid" ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"
                        }`}
                      >
                        {bill.status === "paid" ? "Paid" : "Unpaid"}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
