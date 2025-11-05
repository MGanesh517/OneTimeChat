import { useState, useEffect } from 'react'
import { useSocket } from '@/contexts/SocketContext'

export interface Message {
  id: string
  text: string
  sender: 'user' | 'other'
  timestamp: Date
}

export function useChat(roomId: string) {
  const { socket, isConnected } = useSocket()
  const [messages, setMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    if (!socket) return

    // Listen for new messages
    const handleMessage = (data: {
      id: string
      text: string
      sender: string
      timestamp: string
    }) => {
      const newMessage: Message = {
        id: data.id,
        text: data.text,
        sender: 'other', // In real implementation, compare with current user
        timestamp: new Date(data.timestamp),
      }
      setMessages((prev) => [...prev, newMessage])
    }

    socket.on('message-received', handleMessage)

    // Initial welcome message
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          text: 'Connected to room. You are anonymous.',
          sender: 'other',
          timestamp: new Date(),
        },
      ])
    }

    return () => {
      socket.off('message-received', handleMessage)
    }
  }, [socket, messages.length])

  const sendMessage = (text: string) => {
    if (!socket || !isConnected || !text.trim()) return

    const message: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date(),
    }

    // Optimistically add message
    setMessages((prev) => [...prev, message])

    // Send to server
    socket.emit('send-message', {
      roomId,
      text: text.trim(),
    })
  }

  return {
    messages,
    sendMessage,
    isTyping,
    isConnected,
  }
}

