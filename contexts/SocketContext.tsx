'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { Socket } from 'socket.io-client'
import { initializeSocket, disconnectSocket, getSocket } from '@/lib/socket'

interface SocketContextType {
  socket: Socket | null
  isConnected: boolean
  roomId: string | null
  participantCount: number
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  roomId: null,
  participantCount: 0,
})

export const useSocket = () => useContext(SocketContext)

interface SocketProviderProps {
  children: ReactNode
  roomId: string
}

export function SocketProvider({ children, roomId }: SocketProviderProps) {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [participantCount, setParticipantCount] = useState(0)

  useEffect(() => {
    // Initialize socket connection
    console.log('🚀 Initializing socket for room:', roomId)
    const newSocket = initializeSocket(roomId)
    setSocket(newSocket)

    // Connection event handlers
    newSocket.on('connect', () => {
      setIsConnected(true)
      console.log('✅ Connected to server')
    })

    newSocket.on('connect_error', (error) => {
      setIsConnected(false)
      console.error('❌ Connection error:', error.message)
      console.error('Error type:', error.type)
      console.error('Full error:', error)
    })

    newSocket.on('disconnect', (reason) => {
      setIsConnected(false)
      console.log('❌ Disconnected from server:', reason)
    })
    
    // Add connection timeout warning
    const connectionTimeout = setTimeout(() => {
      if (!newSocket.connected) {
        console.warn('⏱️ Connection taking longer than expected...')
        console.warn('Backend URL:', process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000')
      }
    }, 5000)

    // Room events
    newSocket.on('room-joined', (data: { participantCount: number }) => {
      setParticipantCount(data.participantCount)
      console.log('✅ Joined room, participants:', data.participantCount)
    })

    newSocket.on('user-joined', (data: { participantCount: number }) => {
      setParticipantCount(data.participantCount)
      console.log('👤 User joined, total:', data.participantCount)
    })

    newSocket.on('user-left', (data: { participantCount: number }) => {
      setParticipantCount(data.participantCount)
      console.log('👋 User left, total:', data.participantCount)
    })

    // Cleanup on unmount
    return () => {
      clearTimeout(connectionTimeout)
      newSocket.emit('leave-room', { roomId })
      disconnectSocket()
    }
  }, [roomId])

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        roomId,
        participantCount,
      }}
    >
      {children}
    </SocketContext.Provider>
  )
}

