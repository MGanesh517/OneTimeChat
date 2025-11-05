import { useState, useEffect, useRef } from 'react'
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
  const sentMessagesRef = useRef<Set<string>>(new Set()) // Track sent messages

  useEffect(() => {
    if (!socket) return

    // Listen for new messages
    const handleMessage = (data: {
      id: string
      text: string
      sender: string
      timestamp: string
    }) => {
      const messageText = data.text.trim()
      
      // Check if this is a message we just sent (deduplicate)
      // If we sent this message recently, don't add it as 'other'
      if (sentMessagesRef.current.has(messageText)) {
        // This is our own message being broadcast back - ignore it
        console.log('🔄 Ignoring duplicate (our own message):', messageText)
        // Remove from tracking after a delay
        setTimeout(() => {
          sentMessagesRef.current.delete(messageText)
        }, 3000)
        return
      }
      
      // Check if message already exists in the list (double check)
      setMessages((prev) => {
        const messageTime = new Date(data.timestamp).getTime()
        const isDuplicate = prev.some(msg => {
          const timeDiff = Math.abs(msg.timestamp.getTime() - messageTime)
          return msg.text === messageText && timeDiff < 3000 // Within 3 seconds
        })
        
        if (isDuplicate) {
          console.log('🔄 Ignoring duplicate (already in list):', messageText)
          return prev
        }
        
        // This is a new message from another user
        console.log('✅ New message from other user:', messageText)
        const newMessage: Message = {
          id: data.id,
          text: messageText,
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

    const trimmedText = text.trim()
    
    // Track this message as sent by us
    sentMessagesRef.current.add(trimmedText)
    
    const message: Message = {
      id: Date.now().toString(),
      text: trimmedText,
      sender: 'user',
      timestamp: new Date(),
    }

    // Optimistically add message
    setMessages((prev) => [...prev, message])

    // Send to server
    socket.emit('send-message', {
      roomId,
      text: trimmedText,
    })
    
    // Clean up tracking after 5 seconds (message should be processed by then)
    setTimeout(() => {
      sentMessagesRef.current.delete(trimmedText)
    }, 5000)
  }

  return {
    messages,
    sendMessage,
    isTyping,
    isConnected,
  }
}

