"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"

export default function PayBillPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    cardNumber: "",
    cardName: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert("Payment successful! A confirmation has been sent to your email.")
    router.push("/customer/payment-history")
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Pay Bill</h2>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Bill Summary</CardTitle>
            <CardDescription>Review your bill before payment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Bill ID:</span>
                <span>BILL-10045-APR24</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Billing Period:</span>
                <span>Mar 5 - Apr 4, 2024</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Due Date:</span>
                <span>May 15, 2024</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Units:</span>
                <span>250 units</span>
              </div>
              <div className="border-t pt-4 flex justify-between font-medium">
                <span>Total Amount:</span>
                <span>$124.50</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Details</CardTitle>
            <CardDescription>Enter your card information</CardDescription>
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
                    onValueChange={(value) => handleSelectChange("expiryMonth", value)}
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
                    onValueChange={(value) => handleSelectChange("expiryYear", value)}
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
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full">
                Pay $124.50
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
