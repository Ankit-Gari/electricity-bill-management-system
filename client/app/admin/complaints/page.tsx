"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Sample data
const initialComplaints = [
  {
    id: 1,
    from: "Emily Davis",
    connectionId: "CID10048",
    subject: "Incorrect Meter Reading",
    message:
      "The meter reading on my latest bill seems incorrect. It shows much higher consumption than usual. Please investigate.",
    date: "2024-04-15",
    status: "Pending",
  },
  {
    id: 2,
    from: "Robert Wilson",
    connectionId: "CID10049",
    subject: "Bill Amount Dispute",
    message:
      "I believe there's an error in my bill calculation. The amount is significantly higher than previous months despite similar usage.",
    date: "2024-04-14",
    status: "Pending",
  },
  {
    id: 3,
    from: "Jennifer Taylor",
    connectionId: "CID10050",
    subject: "Power Outage",
    message:
      "We've been experiencing frequent power outages in our area for the past week. Please look into this issue.",
    date: "2024-04-12",
    status: "Resolved",
  },
  {
    id: 4,
    from: "David Miller",
    connectionId: "CID10051",
    subject: "Connection Issue",
    message:
      "After the recent maintenance work, my power connection has been unstable. Please send a technician to check.",
    date: "2024-04-10",
    status: "In Progress",
  },
]

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState(initialComplaints)
  const [selectedComplaint, setSelectedComplaint] = useState<(typeof initialComplaints)[0] | null>(null)
  const [responseText, setResponseText] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredComplaints = complaints.filter((complaint) => {
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "pending" && complaint.status === "Pending") ||
      (activeTab === "resolved" && complaint.status === "Resolved")

    const matchesStatus = statusFilter === "all" || complaint.status === statusFilter

    return matchesTab && matchesStatus
  })

  const handleComplaintClick = (complaint: (typeof initialComplaints)[0]) => {
    setSelectedComplaint(complaint)
    setResponseText("")
  }

  const handleUpdateStatus = (status: string) => {
    if (!selectedComplaint) return

    setComplaints(complaints.map((c) => (c.id === selectedComplaint.id ? { ...c, status } : c)))

    setSelectedComplaint({
      ...selectedComplaint,
      status,
    })
  }

  const handleSendResponse = () => {
    if (!selectedComplaint || !responseText.trim()) return

    // Update status to resolved
    handleUpdateStatus("Resolved")

    alert("Response sent successfully!")
    setResponseText("")
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Complaints</h2>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-1">
          <Card>
            <CardHeader className="px-4 py-3">
              <div className="flex justify-between items-center">
                <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="pending">Pending</TabsTrigger>
                    <TabsTrigger value="resolved">Resolved</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
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
                      onClick={() => handleComplaintClick(complaint)}
                    >
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">{complaint.from}</span>
                        <span className="text-xs text-muted-foreground">{complaint.date}</span>
                      </div>
                      <div className="text-sm truncate">{complaint.subject}</div>
                      <div className="text-xs text-muted-foreground truncate">{complaint.message}</div>
                      <div className="mt-1">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs ${
                            complaint.status === "Pending"
                              ? "bg-orange-100 text-orange-800"
                              : complaint.status === "In Progress"
                                ? "bg-blue-100 text-blue-800"
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
                <CardTitle>{selectedComplaint.subject}</CardTitle>
                <CardDescription>
                  From: {selectedComplaint.from} ({selectedComplaint.connectionId}) • {selectedComplaint.date}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-md">{selectedComplaint.message}</div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Status:</span>
                    <Select value={selectedComplaint.status} onValueChange={handleUpdateStatus}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Resolved">Resolved</SelectItem>
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
