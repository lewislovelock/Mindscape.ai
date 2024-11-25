"use client"

import { useState, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"

interface Message {
  type: "assistant" | "user" | "system" | "error"
  content: string
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [ws, setWs] = useState<WebSocket | null>(null)
  const { toast } = useToast()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const clientId = Math.random().toString(36).substring(7)
    const websocket = new WebSocket(`ws://localhost:8000/ws/${clientId}`)

    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data)
      setMessages(prev => [...prev, data])
    }

    websocket.onerror = (error) => {
      toast({
        variant: "destructive",
        title: "Connection Error",
        description: "Failed to connect to the therapist."
      })
    }

    setWs(websocket)
    return () => websocket.close()
  }, [])

  const sendMessage = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!input.trim() || !ws) return
    
    ws.send(JSON.stringify({
      type: "message",
      content: input
    }))

    setMessages(prev => [...prev, { type: "user", content: input }])
    setInput("")
  }

  return (
    <Card className="w-full max-w-2xl mx-auto h-[600px] flex flex-col rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.type === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`flex items-start space-x-3 max-w-[80%] ${
                message.type === "user" ? "flex-row-reverse space-x-reverse" : "flex-row"
              }`}
            >
              <Avatar className="w-8 h-8 ring-2 ring-white/10 shadow-xl">
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-emerald-500 text-white">
                  {message.type === "user" ? "U" : "T"}
                </div>
              </Avatar>
              <div
                className={`rounded-2xl p-4 ${
                  message.type === "user"
                    ? "bg-gradient-to-br from-blue-500/80 to-emerald-500/80 text-white"
                    : "bg-white/10 backdrop-blur-md"
                } shadow-xl`}
              >
                {message.content}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="p-4 border-t border-white/10 bg-white/5 rounded-b-2xl">
        <div className="flex items-center space-x-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-white/10 backdrop-blur-xl border border-white/10 rounded-xl shadow-inner resize-none min-h-[40px] py-2 px-3"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                sendMessage()
              }
            }}
          />
          <Button 
            type="submit"
            className="rounded-xl bg-gradient-to-r from-blue-500 to-emerald-200 hover:opacity-90 transition-all shadow-lg h-[40px] px-4"
          >
            Send
          </Button>
        </div>
      </form>
    </Card>
  )
} 