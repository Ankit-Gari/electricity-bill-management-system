"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, AlertCircle } from "lucide-react"

interface DashboardData {
  unpaidBills: number
  activeComplaints: number
  recentBills: {
    name: string
    amount: number
    due_date: string
    c_id: number
  }[]
  recentComplaints: {
    name: string
    complaint: string
    status: string
    timestamp: string
  }[]
}

export default function CustomerDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)

  useEffect(() => {
    const token = localStorage.getItem("token");
  
    fetch("http://localhost:5000/api/customer/dashboard", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then(setData)
      .catch((err) => console.error("Error loading dashboard data:", err));
  }, []);
  
  if (!data) return <div className="p-4">Loading...</div>

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Customer Dashboard</h2>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Unpaid Bills</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.unpaidBills}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Complaints</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.activeComplaints}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Bills</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.recentBills.map(bill => (
              <div className="flex items-center justify-between" key={bill.c_id}>
                <div>
                  <p className="text-sm font-medium">{bill.name}</p>
                  <p className="text-sm text-muted-foreground">
                    ₹{bill.amount} - Due {bill.due_date}
                  </p>
                </div>
                <div className="font-medium">CID: {bill.c_id}</div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Complaints</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.recentComplaints.map((complaint, index) => (
              <div className="flex items-center justify-between" key={index}>
                <div>
                  <p className="text-sm font-medium">{complaint.complaint}</p>
                  <p className="text-sm text-muted-foreground">
                    {complaint.name} - {new Date(complaint.timestamp).toLocaleString()}
                  </p>
                </div>
                <div
                  className={`font-medium ${
                    complaint.status === "pending" ? "text-orange-500" : "text-green-500"
                  }`}
                >
                  {complaint.status}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
