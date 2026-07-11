"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, FileText, AlertCircle, IndianRupee, TrendingUp } from "lucide-react"
import { apiFetch } from "@/lib/api"

interface DashboardData {
  totalCustomers: number
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

interface StatsData {
  totalRevenue: string
  totalBills: string
  paidBills: string
  unpaidBills: string
  topCustomers: { name: string; total: string }[]
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [stats, setStats] = useState<StatsData | null>(null)

  useEffect(() => {
    apiFetch("/api/admin/dashboard")
      .then(json => setData(json.data))
      .catch(err => console.error("Error loading dashboard data:", err))

    apiFetch("/api/admin/stats")
      .then(json => setStats(json.data))
      .catch(err => console.error("Error loading stats:", err))
  }, [])

  if (!data) return <div className="p-4">Loading...</div>

  const paidBills = stats ? Number(stats.paidBills) : 0
  const totalBills = stats ? Number(stats.totalBills) : 0
  const collectionRate = totalBills ? Math.round((paidBills / totalBills) * 100) : 0
  const maxTotal = stats?.topCustomers.length ? Number(stats.topCustomers[0].total) : 0

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalCustomers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats ? `₹${Number(stats.totalRevenue).toLocaleString("en-IN")}` : "—"}
            </div>
            {stats && (
              <p className="text-xs text-muted-foreground">
                {stats.paidBills} of {stats.totalBills} bills paid ({collectionRate}%)
              </p>
            )}
          </CardContent>
        </Card>

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

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Recent Bills</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.recentBills.map((bill, index) => (
              <div className="flex items-center justify-between" key={index}>
                <div>
                  <p className="text-sm font-medium">{bill.name}</p>
                  <p className="text-sm text-muted-foreground">
                    ₹{Number(bill.amount).toFixed(2)} - Due {new Date(bill.due_date).toLocaleDateString()}
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
                  <p className="text-sm text-muted-foreground">{complaint.name} - {new Date(complaint.timestamp).toLocaleString()}</p>
                </div>
                <div className={`font-medium ${complaint.status === "pending" ? "text-orange-500" : "text-green-500"}`}>
                  {complaint.status}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Top Customers by Revenue
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {!stats ? (
              <p className="text-sm text-muted-foreground">Loading...</p>
            ) : (
              stats.topCustomers.map((customer, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{customer.name}</span>
                    <span className="text-muted-foreground">
                      ₹{Number(customer.total).toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-100">
                    <div
                      className="h-2 rounded-full bg-gray-900"
                      style={{ width: `${maxTotal ? (Number(customer.total) / maxTotal) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
