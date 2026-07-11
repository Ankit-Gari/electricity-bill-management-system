"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample data
const initialMessages = [
  {
    id: 1,
    from: "John Smith",
    connectionId: "CID10045",
    subject: "Bill Clarification",
    message:
      "I have a question about my recent bill. The amount seems higher than usual. Could you please check if there was a mistake in the meter reading?",
    date: "2024-04-15",
    read: false,
    replied: false,
  },
  {
    id: 2,
    from: "Sarah Johnson",
    connectionId: "CID10046",
    subject: "Payment Confirmation",
    message:
      "I made a payment yesterday but haven't received a confirmation. Could you please verify if the payment was received?",
    date: "2024-04-14",
    read: true,
    replied: false,
  },
  {
    id: 3,
    from: "Michael Brown",
    connectionId: "CID10047",
    subject: "Address Change",
    message:
      "I'm moving to a new address next month. What's the process to transfer my connection to the new location?",
    date: "2024-04-12",
    read: true,
    replied: true,
  },
  {
    id: 4,
    from: "Emily Davis",
    connectionId: "CID10048",
    subject: "Meter Reading Issue",
    message: "The meter reader didn't visit this month. How will my bill be calculated?",
    date: "2024-04-10",
    read: true,
    replied: true,
  },
]

export default function InboxPage() {
  const [messages, setMessages] = useState(initialMessages)
  const [selectedMessage, setSelectedMessage] = useState<(typeof initialMessages)[0] | null>(null)
  const [replyText, setReplyText] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  const filteredMessages = messages.filter((message) => {
    if (activeTab === "all") return true
    if (activeTab === "unread") return !message.read
    if (activeTab === "replied") return message.replied
    return true
  })

  const handleMessageClick = (message: (typeof initialMessages)[0]) => {
    // Mark as read when opened
    if (!message.read) {
      setMessages(messages.map((m) => (m.id === message.id ? { ...m, read: true } : m)))
    }
    setSelectedMessage(message)
    setReplyText("")
  }

  const handleSendReply = () => {
    if (!selectedMessage || !replyText.trim()) return

    // Mark as replied
    setMessages(messages.map((m) => (m.id === selectedMessage.id ? { ...m, replied: true } : m)))

    alert("Reply sent successfully!")
    setReplyText("")
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Inbox</h2>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-1">
          <Card>
            <CardHeader className="px-4 py-3">
              <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="unread">Unread</TabsTrigger>
                  <TabsTrigger value="replied">Replied</TabsTrigger>
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
                      <div className="flex gap-2 mt-1">
                        {!message.read && (
                          <span className="px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-800">New</span>
                        )}
                        {message.replied && (
                          <span className="px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-800">Replied</span>
                        )}
                      </div>
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
                  From: {selectedMessage.from} ({selectedMessage.connectionId}) • {selectedMessage.date}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-md">{selectedMessage.message}</div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Reply</h3>
                    <Textarea
                      placeholder="Type your reply here..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      rows={5}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setSelectedMessage(null)}>
                  Back
                </Button>
                <Button onClick={handleSendReply} disabled={!replyText.trim()}>
                  Send Reply
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
