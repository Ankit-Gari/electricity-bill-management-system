"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { apiFetch } from "@/lib/api"

interface Complaint {
  id: number
  c_id: number
  name: string | null
  email: string | null
  subject: string | null
  message: string
  status: "pending" | "resolved"
  replied: number
  timestamp: string
}

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null)
  const [responseText, setResponseText] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    apiFetch("/api/admin/messages")
      .then((json) => setComplaints(json.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const filteredComplaints = complaints.filter((complaint) => {
    if (activeTab === "pending") return complaint.status === "pending"
    if (activeTab === "resolved") return complaint.status === "resolved"
    return true
  })

  const handleUpdateStatus = async (status: "pending" | "resolved") => {
    if (!selectedComplaint) return
    try {
      await apiFetch(`/api/admin/messages/${selectedComplaint.id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      })
      setComplaints(complaints.map((c) => (c.id === selectedComplaint.id ? { ...c, status } : c)))
      setSelectedComplaint({ ...selectedComplaint, status })
    } catch (err: any) {
      alert(err.message)
    }
  }

  const handleSendResponse = async () => {
    if (!selectedComplaint || !responseText.trim()) return
    try {
      await apiFetch(`/api/admin/messages/${selectedComplaint.id}/reply`, {
        method: "POST",
        body: JSON.stringify({ reply: responseText }),
      })
      setComplaints(
        complaints.map((c) =>
          c.id === selectedComplaint.id ? { ...c, status: "resolved", replied: 1 } : c,
        ),
      )
      setSelectedComplaint({ ...selectedComplaint, status: "resolved", replied: 1 })
      setResponseText("")
    } catch (err: any) {
      alert(err.message)
    }
  }

  if (loading) return <div className="p-4">Loading...</div>
  if (error) return <div className="p-4 text-red-500">{error}</div>

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Complaints</h2>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-1">
          <Card>
            <CardHeader className="px-4 py-3">
              <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="resolved">Resolved</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {filteredComplaints.length === 0 ? (
                  <div className="py-4 text-center text-muted-foreground">No complaints found</div>
                ) : (
                  filteredComplaints.map((complaint) => (
                    <div
                      key={complaint.id}
                      className={`p-4 cursor-pointer hover:bg-gray-50 ${selectedComplaint?.id === complaint.id ? "bg-gray-50" : ""}`}
                      onClick={() => {
                        setSelectedComplaint(complaint)
                        setResponseText("")
                      }}
                    >
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">{complaint.name || "Unknown"}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(complaint.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="text-sm truncate">{complaint.subject || "No subject"}</div>
                      <div className="text-xs text-muted-foreground truncate">{complaint.message}</div>
                      <div className="mt-1">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs ${
                            complaint.status === "pending"
                              ? "bg-orange-100 text-orange-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {complaint.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="col-span-2">
          {selectedComplaint ? (
            <Card>
              <CardHeader>
                <CardTitle>{selectedComplaint.subject || "No subject"}</CardTitle>
                <CardDescription>
                  From: {selectedComplaint.name || "Unknown"} (CID{selectedComplaint.c_id}) •{" "}
                  {new Date(selectedComplaint.timestamp).toLocaleString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-md">{selectedComplaint.message}</div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Status:</span>
                    <Select
                      value={selectedComplaint.status}
                      onValueChange={(value) => handleUpdateStatus(value as "pending" | "resolved")}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Response</h3>
                    <Textarea
                      placeholder="Type your response here..."
                      value={responseText}
                      onChange={(e) => setResponseText(e.target.value)}
                      rows={5}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setSelectedComplaint(null)}>
                  Back
                </Button>
                <Button onClick={handleSendResponse} disabled={!responseText.trim()}>
                  Send Response
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <h3 className="text-lg font-medium">Select a complaint</h3>
                <p className="text-muted-foreground">Choose a complaint from the list to view its details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
