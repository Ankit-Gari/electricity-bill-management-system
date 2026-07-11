"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"

export default function SubmitComplaintPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    subject: "",
    category: "",
    message: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert("Your complaint has been submitted successfully. We will get back to you soon.")
    router.push("/customer/dashboard")
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Submit Complaint</h2>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>New Complaint</CardTitle>
          <CardDescription>
            Please provide details about your issue and we'll address it as soon as possible
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                name="subject"
                placeholder="Brief description of your issue"
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="billing">Billing Issue</SelectItem>
                  <SelectItem value="meter">Meter Reading</SelectItem>
                  <SelectItem value="connection">Connection Problem</SelectItem>
                  <SelectItem value="outage">Power Outage</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                name="message"
                placeholder="Please describe your issue in detail"
                value={formData.message}
                onChange={handleChange}
                rows={6}
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Submit Complaint
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
