"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { apiFetch } from "@/lib/api"

interface Bill {
  bill_id: number
  amt_topay: string
  due_date: string
  status: "paid" | "unpaid"
}

export default function PayBillPage() {
  const router = useRouter()
  const [bills, setBills] = useState<Bill[]>([])
  const [selectedBillId, setSelectedBillId] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [paying, setPaying] = useState(false)
  const [formData, setFormData] = useState({
    cardNumber: "",
    cardName: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
  })

  useEffect(() => {
    apiFetch("/api/bills/user")
      .then((json) => {
        const unpaid = json.data.filter((b: Bill) => b.status === "unpaid")
        setBills(unpaid)
        if (unpaid.length > 0) setSelectedBillId(String(unpaid[0].bill_id))
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const selectedBill = bills.find((b) => String(b.bill_id) === selectedBillId)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedBill) return
    setPaying(true)
    setError("")

    try {
      // Demo payment: card details are not sent or stored anywhere
      await apiFetch("/api/bills/pay", {
        method: "POST",
        body: JSON.stringify({ bill_id: selectedBill.bill_id }),
      })
      router.push("/customer/payment-history")
    } catch (err: any) {
      setError(err.message)
      setPaying(false)
    }
  }

  if (loading) return <div className="p-4">Loading...</div>

  if (bills.length === 0) {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">Pay Bill</h2>
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            You have no unpaid bills. 🎉
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Pay Bill</h2>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Bill Summary</CardTitle>
            <CardDescription>Select the bill you want to pay</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Bill</Label>
                <Select value={selectedBillId} onValueChange={setSelectedBillId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a bill" />
                  </SelectTrigger>
                  <SelectContent>
                    {bills.map((bill) => (
                      <SelectItem key={bill.bill_id} value={String(bill.bill_id)}>
                        BILL-{bill.bill_id} — ₹{Number(bill.amt_topay).toFixed(2)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedBill && (
                <>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Bill ID:</span>
                    <span>BILL-{selectedBill.bill_id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Due Date:</span>
                    <span>{new Date(selectedBill.due_date).toLocaleDateString()}</span>
                  </div>
                  <div className="border-t pt-4 flex justify-between font-medium">
                    <span>Total Amount:</span>
                    <span>₹{Number(selectedBill.amt_topay).toFixed(2)}</span>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Details</CardTitle>
            <CardDescription>Demo payment — card details are not processed or stored</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  name="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cardName">Name on Card</Label>
                <Input
                  id="cardName"
                  name="cardName"
                  placeholder="John Smith"
                  value={formData.cardName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2 col-span-1">
                  <Label htmlFor="expiryMonth">Month</Label>
                  <Select
                    value={formData.expiryMonth}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, expiryMonth: value }))}
                  >
                    <SelectTrigger id="expiryMonth">
                      <SelectValue placeholder="MM" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => {
                        const month = (i + 1).toString().padStart(2, "0")
                        return (
                          <SelectItem key={month} value={month}>
                            {month}
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 col-span-1">
                  <Label htmlFor="expiryYear">Year</Label>
                  <Select
                    value={formData.expiryYear}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, expiryYear: value }))}
                  >
                    <SelectTrigger id="expiryYear">
                      <SelectValue placeholder="YY" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 10 }, (_, i) => {
                        const year = (new Date().getFullYear() + i).toString().slice(-2)
                        return (
                          <SelectItem key={year} value={year}>
                            {year}
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 col-span-1">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    name="cvv"
                    placeholder="123"
                    maxLength={3}
                    value={formData.cvv}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {error && <p className="text-sm font-medium text-red-500">{error}</p>}
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={paying || !selectedBill}>
                {paying
                  ? "Processing..."
                  : selectedBill
                    ? `Pay ₹${Number(selectedBill.amt_topay).toFixed(2)}`
                    : "Pay"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
