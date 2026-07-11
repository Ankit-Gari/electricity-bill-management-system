"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { apiFetch } from "@/lib/api"

interface Message {
  id: number
  subject: string | null
  message: string
  is_read: number
  timestamp: string
}

export default function InboxPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    apiFetch("/api/inbox")
      .then((json) => setMessages(json.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const filteredMessages = messages.filter((message) => {
    if (activeTab === "unread") return !message.is_read
    return true
  })

  const handleMessageClick = (message: Message) => {
    if (!message.is_read) {
      apiFetch(`/api/inbox/${message.id}/read`, { method: "PATCH" }).catch(() => {})
      setMessages(messages.map((m) => (m.id === message.id ? { ...m, is_read: 1 } : m)))
    }
    setSelectedMessage(message)
  }

  if (loading) return <div className="p-4">Loading...</div>
  if (error) return <div className="p-4 text-red-500">{error}</div>

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
                      className={`p-4 cursor-pointer hover:bg-gray-50 ${selectedMessage?.id === message.id ? "bg-gray-50" : ""} ${!message.is_read ? "font-medium" : ""}`}
                      onClick={() => handleMessageClick(message)}
                    >
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Admin</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(message.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="text-sm truncate">{message.subject || "No subject"}</div>
                      <div className="text-xs text-muted-foreground truncate">{message.message}</div>
                      {!message.is_read && (
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
                <CardTitle>{selectedMessage.subject || "No subject"}</CardTitle>
                <CardDescription>
                  From: Admin • {new Date(selectedMessage.timestamp).toLocaleString()}
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
