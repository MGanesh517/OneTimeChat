'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid'
import CodeRain from '@/components/CodeRain'
import GlitchText from '@/components/GlitchText'
import HackingTerminal from '@/components/HackingTerminal'
import { Terminal, Lock, ArrowRight, Users, Zap } from 'lucide-react'

export default function Home() {
  const [roomId, setRoomId] = useState('')
  const [inputRoomId, setInputRoomId] = useState('')
  const [showRoom, setShowRoom] = useState(false)
  const [createName, setCreateName] = useState('')
  const [joinName, setJoinName] = useState('')
  const [quickJoinName, setQuickJoinName] = useState('')
  const router = useRouter()

  const generateRandomName = () => {
    return `User${Math.floor(100 + Math.random() * 900)}`
  }

  const generateRoomId = () => {
    const id = uuidv4().split('-')[0].toUpperCase()
    setRoomId(id)
    setShowRoom(true)
    // Auto-generate name if empty
    if (!createName.trim()) {
      setCreateName(generateRandomName())
    }
  }

  const joinRoom = () => {
    if (inputRoomId.trim()) {
      const name = joinName.trim() || generateRandomName()
      const key = `otc_display_name_${inputRoomId.trim().toUpperCase()}`
      if (typeof window !== 'undefined') {
        localStorage.setItem(key, name)
      }
      router.push(`/room/${inputRoomId.trim().toUpperCase()}`)
    }
  }

  const quickJoin = () => {
    const name = quickJoinName.trim() || generateRandomName()
    const quickRoomId = 'PUBLIC'
    const key = `otc_display_name_${quickRoomId}`
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, name)
    }
    router.push(`/room/${quickRoomId}`)
  }

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId)
    // You can add a toast notification here
  }

  return (
    <main className="min-h-screen relative overflow-hidden bg-hacker-darker">
      <CodeRain />
      
      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <GlitchText text="ONETIME CHAT" className="text-6xl md:text-8xl font-bold mb-4" />
          <p className="text-hacker-text text-xl md:text-2xl font-mono mt-4">
            [ ANONYMOUS SECURE COMMUNICATION ]
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <Lock className="text-hacker-green" size={20} />
            <span className="text-hacker-green/70 text-sm">End-to-End Encrypted • No Logs • Anonymous</span>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Quick Join - Full Width */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-hacker-dark border-2 border-hacker-green glow-green p-6 rounded-lg"
          >
            <div className="flex items-center gap-2 mb-4">
              <Zap className="text-hacker-green" size={24} />
              <h2 className="text-2xl font-bold text-hacker-text">QUICK JOIN</h2>
            </div>
            <p className="text-white/70 mb-4 font-mono text-sm">
              Join the public room instantly. No code needed. Chat with anyone who clicks Quick Join.
            </p>
            <div className="flex gap-3">
              <input
                type="text"
                value={quickJoinName}
                onChange={(e) => setQuickJoinName(e.target.value)}
                placeholder="Your name (optional - random if empty)"
                className="flex-1 bg-hacker-darker border-2 border-hacker-green/50 text-white px-4 py-3 focus:outline-none focus:border-hacker-green focus:glow-green font-mono placeholder:text-hacker-green/30"
              />
              <button
                onClick={() => setQuickJoinName(generateRandomName())}
                className="px-4 py-3 bg-hacker-green/10 border-2 border-hacker-green/50 text-hacker-green hover:bg-hacker-green/20 transition-all font-mono text-sm"
              >
                Random
              </button>
              <button
                onClick={quickJoin}
                className="px-8 py-3 bg-hacker-green/20 border-2 border-hacker-green text-hacker-green hover:bg-hacker-green/30 transition-all glow-green font-bold font-mono flex items-center gap-2"
              >
                <Zap size={18} />
                QUICK JOIN
              </button>
            </div>
          </motion.div>

          {/* Create & Join Rooms - Side by Side */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Create Room */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              <div className="bg-hacker-dark border-2 border-hacker-green glow-green p-6 rounded-lg">
                <div className="flex items-center gap-2 mb-4">
                  <Terminal className="text-hacker-green" size={24} />
                  <h2 className="text-2xl font-bold text-hacker-text">CREATE ROOM</h2>
                </div>
                <p className="text-white/70 mb-4 font-mono text-sm">
                  Generate a unique room ID and share it with others to start an anonymous chat session.
                </p>
                
                {!showRoom ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={createName}
                      onChange={(e) => setCreateName(e.target.value)}
                      placeholder="Your name (optional - random if empty)"
                      className="w-full bg-hacker-darker border-2 border-hacker-green/50 text-white px-4 py-2 focus:outline-none focus:border-hacker-green focus:glow-green font-mono placeholder:text-hacker-green/30"
                    />
                    <button
                      onClick={generateRoomId}
                      className="w-full py-4 bg-hacker-green/20 border-2 border-hacker-green text-hacker-green hover:bg-hacker-green/30 transition-all glow-green font-bold text-lg font-mono flex items-center justify-center gap-2"
                    >
                      <Terminal size={20} />
                      GENERATE ROOM ID
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <HackingTerminal roomId={roomId} onCopyRoomId={copyRoomId} />
                    <button
                      onClick={() => {
                        const name = createName.trim() || generateRandomName()
                        const key = `otc_display_name_${roomId}`
                        if (typeof window !== 'undefined') {
                          localStorage.setItem(key, name)
                        }
                        router.push(`/room/${roomId}`)
                      }}
                      className="w-full py-4 bg-hacker-green/20 border-2 border-hacker-green text-hacker-green hover:bg-hacker-green/30 transition-all glow-green font-bold text-lg font-mono flex items-center justify-center gap-2"
                    >
                      ENTER ROOM
                      <ArrowRight size={20} />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Join Room */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-6"
            >
              <div className="bg-hacker-dark border-2 border-hacker-green glow-green p-6 rounded-lg">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="text-hacker-green" size={24} />
                  <h2 className="text-2xl font-bold text-hacker-text">JOIN ROOM</h2>
                </div>
                <p className="text-white/70 mb-4 font-mono text-sm">
                  Enter a room ID to join an existing anonymous chat session.
                </p>
                
                <div className="space-y-3">
                  <input
                    type="text"
                    value={inputRoomId}
                    onChange={(e) => setInputRoomId(e.target.value.toUpperCase())}
                    placeholder="ENTER ROOM ID"
                    className="w-full bg-hacker-darker border-2 border-hacker-green/50 text-hacker-green px-4 py-3 focus:outline-none focus:border-hacker-green focus:glow-green font-mono placeholder:text-hacker-green/30 text-lg font-bold tracking-wider"
                  />
                  <input
                    type="text"
                    value={joinName}
                    onChange={(e) => setJoinName(e.target.value)}
                    placeholder="Your name (optional - random if empty)"
                    className="w-full bg-hacker-darker border-2 border-hacker-green/50 text-white px-4 py-2 focus:outline-none focus:border-hacker-green focus:glow-green font-mono placeholder:text-hacker-green/30"
                  />
                  <button
                    onClick={joinRoom}
                    disabled={!inputRoomId.trim()}
                    className="w-full py-4 bg-hacker-green/20 border-2 border-hacker-green text-hacker-green hover:bg-hacker-green/30 transition-all glow-green font-bold text-lg font-mono flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    JOIN ROOM
                    <ArrowRight size={20} />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="max-w-4xl mx-auto mt-12 grid md:grid-cols-3 gap-6"
        >
          <div className="bg-hacker-dark/50 border border-hacker-border p-4 rounded-lg text-center">
            <Lock className="text-hacker-green mx-auto mb-2" size={32} />
            <h3 className="text-hacker-text font-bold mb-2">SECURE</h3>
            <p className="text-white/70 text-sm font-mono">End-to-end encryption</p>
          </div>
          <div className="bg-hacker-dark/50 border border-hacker-border p-4 rounded-lg text-center">
            <Users className="text-hacker-green mx-auto mb-2" size={32} />
            <h3 className="text-hacker-text font-bold mb-2">ANONYMOUS</h3>
            <p className="text-white/70 text-sm font-mono">No identity required</p>
          </div>
          <div className="bg-hacker-dark/50 border border-hacker-border p-4 rounded-lg text-center">
            <Terminal className="text-hacker-green mx-auto mb-2" size={32} />
            <h3 className="text-hacker-text font-bold mb-2">EPHEMERAL</h3>
            <p className="text-white/70 text-sm font-mono">One-time sessions</p>
          </div>
        </motion.div>
      </div>
    </main>
  )
}

