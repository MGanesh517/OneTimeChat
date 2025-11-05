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
      const messageTime = new Date(data.timestamp).getTime()
      
      // Check if this message already exists (deduplicate)
      // This prevents duplicate messages when sender's own message is broadcast back
      setMessages((prev) => {
        // Check if message with same text and similar timestamp already exists
        const isDuplicate = prev.some(msg => {
          const timeDiff = Math.abs(msg.timestamp.getTime() - messageTime)
          return msg.text === data.text && timeDiff < 2000 // Within 2 seconds
        })
        
        if (isDuplicate) {
          // Message already exists, don't add it again
          return prev
        }
        
        // This is a new message from another user
        const newMessage: Message = {
          id: data.id,
          text: data.text,
          sender: 'other',
          timestamp: new Date(data.timestamp),
        }
        return [...prev, newMessage]
      })
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

