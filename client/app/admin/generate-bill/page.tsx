"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { apiFetch } from "@/lib/api"

const RATE_PER_UNIT = 8 // ₹ per unit

interface Customer {
  c_id: number
  name: string | null
}

export default function GenerateBillPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [customerId, setCustomerId] = useState("")
  const [unitsConsumed, setUnitsConsumed] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [status, setStatus] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    apiFetch("/api/admin/users")
      .then((json) => setCustomers(json.data))
      .catch((err) => setStatus({ type: "error", text: err.message }))
  }, [])

  const selectedCustomer = customers.find((c) => String(c.c_id) === customerId)
  const amount = unitsConsumed ? Number(unitsConsumed) * RATE_PER_UNIT : 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus(null)
    setSubmitting(true)

    try {
      await apiFetch("/api/admin/bills", {
        method: "POST",
        body: JSON.stringify({
          c_id: Number(customerId),
          amount,
          due_date: dueDate,
        }),
      })
      setStatus({ type: "success", text: "Bill generated successfully!" })
      setCustomerId("")
      setUnitsConsumed("")
      setDueDate("")
    } catch (err: any) {
      setStatus({ type: "error", text: err.message })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Generate Bill</h2>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>New Electricity Bill</CardTitle>
          <CardDescription>Select a customer and enter consumption to generate a new bill</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customer">Customer</Label>
                <Select value={customerId} onValueChange={setCustomerId} required>
                  <SelectTrigger id="customer">
                    <SelectValue placeholder="Select customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((c) => (
                      <SelectItem key={c.c_id} value={String(c.c_id)}>
                        CID{c.c_id} — {c.name || "Unknown"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerName">Customer Name</Label>
                <Input id="customerName" value={selectedCustomer?.name || ""} readOnly className="bg-gray-50" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="unitsConsumed">Units Consumed</Label>
                <Input
                  id="unitsConsumed"
                  type="number"
                  min="1"
                  placeholder="e.g. 250"
                  value={unitsConsumed}
                  onChange={(e) => setUnitsConsumed(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input id="dueDate" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
              </div>
            </div>

            <div className="rounded-md bg-gray-50 p-4 flex justify-between">
              <span className="text-sm text-muted-foreground">
                Bill amount ({unitsConsumed || 0} units × ₹{RATE_PER_UNIT}/unit)
              </span>
              <span className="font-medium">₹{amount.toFixed(2)}</span>
            </div>

            {status && (
              <p className={`text-sm font-medium ${status.type === "success" ? "text-green-600" : "text-red-500"}`}>
                {status.text}
              </p>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={submitting || !customerId}>
              {submitting ? "Generating..." : "Generate Bill"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
