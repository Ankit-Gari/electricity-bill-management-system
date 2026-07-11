"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function GenerateBillPage() {
  const [formData, setFormData] = useState({
    connectionId: "",
    customerName: "",
    unitsConsumed: "",
    month: "",
    year: new Date().getFullYear().toString(),
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
    alert("Bill generated successfully!")
    // Reset form
    setFormData({
      connectionId: "",
      customerName: "",
      unitsConsumed: "",
      month: "",
      year: new Date().getFullYear().toString(),
    })
  }

  // Simulate fetching customer details when connection ID is entered
  const handleConnectionIdBlur = () => {
    if (formData.connectionId) {
      // In a real app, this would be an API call
      if (formData.connectionId === "CID10045") {
        setFormData((prev) => ({ ...prev, customerName: "John Smith" }))
      } else if (formData.connectionId === "CID10046") {
        setFormData((prev) => ({ ...prev, customerName: "Sarah Johnson" }))
      } else {
        setFormData((prev) => ({ ...prev, customerName: "Customer Not Found" }))
      }
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Generate Bill</h2>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>New Electricity Bill</CardTitle>
          <CardDescription>Enter customer details and consumption to generate a new bill</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="connectionId">Connection ID</Label>
                <Input
                  id="connectionId"
                  name="connectionId"
                  placeholder="e.g. CID10045"
                  value={formData.connectionId}
                  onChange={handleChange}
                  onBlur={handleConnectionIdBlur}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerName">Customer Name</Label>
                <Input
                  id="customerName"
                  name="customerName"
                  value={formData.customerName}
                  readOnly
                  className="bg-gray-50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="unitsConsumed">Units Consumed</Label>
              <Input
                id="unitsConsumed"
                name="unitsConsumed"
                type="number"
                placeholder="e.g. 250"
                value={formData.unitsConsumed}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="month">Month</Label>
                <Select value={formData.month} onValueChange={(value) => handleSelectChange("month", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select month" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="January">January</SelectItem>
                    <SelectItem value="February">February</SelectItem>
                    <SelectItem value="March">March</SelectItem>
                    <SelectItem value="April">April</SelectItem>
                    <SelectItem value="May">May</SelectItem>
                    <SelectItem value="June">June</SelectItem>
                    <SelectItem value="July">July</SelectItem>
                    <SelectItem value="August">August</SelectItem>
                    <SelectItem value="September">September</SelectItem>
                    <SelectItem value="October">October</SelectItem>
                    <SelectItem value="November">November</SelectItem>
                    <SelectItem value="December">December</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Select value={formData.year} onValueChange={(value) => handleSelectChange("year", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Generate Bill
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
