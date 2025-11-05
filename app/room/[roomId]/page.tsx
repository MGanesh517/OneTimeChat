'use client'

import { useParams } from 'next/navigation'
import { useState } from 'react'
import { motion } from 'framer-motion'
import CodeRain from '@/components/CodeRain'
import ChatInterface from '@/components/ChatInterface'
import VideoCallInterface from '@/components/VideoCallInterface'
import GlitchText from '@/components/GlitchText'
import { SocketProvider, useSocket } from '@/contexts/SocketContext'
import { ArrowLeft, Video, MessageSquare } from 'lucide-react'
import { useRouter } from 'next/navigation'

function RoomContent() {
  const params = useParams()
  const roomId = params.roomId as string
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'chat' | 'video'>('chat')
  const { isConnected } = useSocket()

  return (
    <main className="min-h-screen relative overflow-hidden bg-hacker-darker">
      <CodeRain />
      
      <div className="relative z-10 container mx-auto px-4 py-6 h-screen flex flex-col">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/')}
              className="p-2 border-2 border-hacker-green bg-hacker-green/20 text-hacker-green hover:bg-hacker-green/30 transition-all"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <GlitchText text={`ROOM: ${roomId}`} className="text-2xl font-bold" />
              <p className="text-hacker-green/70 text-sm font-mono mt-1">Anonymous Session Active</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-hacker-green animate-pulse-green' : 'bg-hacker-error'}`}></div>
            <span className="text-hacker-text font-mono text-sm">{isConnected ? 'CONNECTED' : 'CONNECTING...'}</span>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex gap-4 mb-4"
        >
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-6 py-3 border-2 font-bold font-mono transition-all flex items-center gap-2 ${
              activeTab === 'chat'
                ? 'bg-hacker-green/20 border-hacker-green text-hacker-green glow-green'
                : 'bg-hacker-dark border-hacker-border text-white/70 hover:border-hacker-green/50'
            }`}
          >
            <MessageSquare size={20} />
            CHAT
          </button>
          <button
            onClick={() => setActiveTab('video')}
            className={`px-6 py-3 border-2 font-bold font-mono transition-all flex items-center gap-2 ${
              activeTab === 'video'
                ? 'bg-hacker-green/20 border-hacker-green text-hacker-green glow-green'
                : 'bg-hacker-dark border-hacker-border text-white/70 hover:border-hacker-green/50'
            }`}
          >
            <Video size={20} />
            VIDEO CALL
          </button>
        </motion.div>

        {/* Content Area */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 min-h-0"
        >
          {activeTab === 'chat' ? (
            <ChatInterface roomId={roomId} />
          ) : (
            <VideoCallInterface />
          )}
        </motion.div>
      </div>
    </main>
  )
}

export default function RoomPage() {
  const params = useParams()
  const roomId = params.roomId as string

  return (
    <SocketProvider roomId={roomId}>
      <RoomContent />
    </SocketProvider>
  )
}

