"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample data
const initialMessages = [
  {
    id: 1,
    from: "Admin",
    subject: "Response to your complaint",
    message:
      "Dear customer, we have investigated the power outage issue you reported. The problem was due to scheduled maintenance in your area. We apologize for any inconvenience caused.",
    date: "2024-04-15",
    read: false,
  },
  {
    id: 2,
    from: "Admin",
    subject: "Bill clarification",
    message:
      "Dear customer, regarding your query about the increased bill amount, we have checked and found that your consumption has increased by 15% compared to last month. Please let us know if you need any further clarification.",
    date: "2024-04-10",
    read: true,
  },
  {
    id: 3,
    from: "Admin",
    subject: "Payment confirmation",
    message:
      "Dear customer, this is to confirm that we have received your payment of $124.50 for the bill period of March 2024. Thank you for your prompt payment.",
    date: "2024-03-12",
    read: true,
  },
]

export default function InboxPage() {
  const [messages, setMessages] = useState(initialMessages)
  const [selectedMessage, setSelectedMessage] = useState<(typeof initialMessages)[0] | null>(null)
  const [activeTab, setActiveTab] = useState("all")

  const filteredMessages = messages.filter((message) => {
    if (activeTab === "all") return true
    if (activeTab === "unread") return !message.read
    return true
  })

  const handleMessageClick = (message: (typeof initialMessages)[0]) => {
    // Mark as read when opened
    if (!message.read) {
      setMessages(messages.map((m) => (m.id === message.id ? { ...m, read: true } : m)))
    }
    setSelectedMessage(message)
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Inbox</h2>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-1">
          <Card>
            <CardHeader className="px-4 py-3">
              <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="unread">Unread</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {filteredMessages.length === 0 ? (
                  <div className="py-4 text-center text-muted-foreground">No messages found</div>
                ) : (
                  filteredMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`p-4 cursor-pointer hover:bg-gray-50 ${selectedMessage?.id === message.id ? "bg-gray-50" : ""} ${!message.read ? "font-medium" : ""}`}
                      onClick={() => handleMessageClick(message)}
                    >
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">{message.from}</span>
                        <span className="text-xs text-muted-foreground">{message.date}</span>
                      </div>
                      <div className="text-sm truncate">{message.subject}</div>
                      <div className="text-xs text-muted-foreground truncate">{message.message}</div>
                      {!message.read && (
                        <div className="mt-1">
                          <span className="px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-800">New</span>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="col-span-2">
          {selectedMessage ? (
            <Card>
              <CardHeader>
                <CardTitle>{selectedMessage.subject}</CardTitle>
                <CardDescription>
                  From: {selectedMessage.from} • {selectedMessage.date}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-gray-50 rounded-md">{selectedMessage.message}</div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setSelectedMessage(null)}>
                  Back
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <h3 className="text-lg font-medium">Select a message</h3>
                <p className="text-muted-foreground">Choose a message from the list to view its contents</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
