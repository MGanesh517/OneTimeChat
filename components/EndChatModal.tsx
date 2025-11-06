'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, AlertTriangle, Shield, LogOut } from 'lucide-react'
import { useEffect, useRef } from 'react'

interface EndChatModalProps {
  isOpen: boolean
  onConfirm: () => void
  onCancel: () => void
  roomId: string
}

export default function EndChatModal({ isOpen, onConfirm, onCancel, roomId }: EndChatModalProps) {
  const audioContextRef = useRef<AudioContext | null>(null)

  // Generate hacking sound effect
  const playHackSound = (frequency: number, duration: number, type: 'beep' | 'sweep' | 'warning' = 'beep') => {
    if (typeof window === 'undefined') return
    
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      }
      
      const ctx = audioContextRef.current
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)
      
      if (type === 'warning') {
        oscillator.type = 'sawtooth'
        oscillator.frequency.setValueAtTime(frequency, ctx.currentTime)
        oscillator.frequency.exponentialRampToValueAtTime(frequency * 0.7, ctx.currentTime + duration)
      } else {
        oscillator.frequency.value = frequency
        oscillator.type = type === 'sweep' ? 'sawtooth' : 'square'
      }
      
      gainNode.gain.setValueAtTime(0.12, ctx.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration)
      
      oscillator.start(ctx.currentTime)
      oscillator.stop(ctx.currentTime + duration)
    } catch (error) {
      // Silently fail if audio context is not available
    }
  }

  useEffect(() => {
    if (isOpen) {
      playHackSound(300, 0.2, 'warning')
      setTimeout(() => playHackSound(250, 0.3, 'warning'), 150)
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full max-w-md">
              {/* Animated Border */}
              <motion.div
                className="absolute inset-0 rounded-lg"
                animate={{
                  boxShadow: [
                    '0 0 20px rgba(239,68,68,0.3)',
                    '0 0 40px rgba(239,68,68,0.5)',
                    '0 0 20px rgba(239,68,68,0.3)',
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />

              <div className="relative bg-hacker-darker border-4 border-hacker-error rounded-lg p-8 overflow-hidden">
                {/* Background Grid */}
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage: `
                      linear-gradient(rgba(239,68,68,0.1) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(239,68,68,0.1) 1px, transparent 1px)
                    `,
                    backgroundSize: '20px 20px',
                  }}
                />

                {/* Scanning Line Effect */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  initial={{ y: '-100%' }}
                  animate={{ y: '200%' }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                >
                  <div className="h-1 bg-hacker-error/30 w-full" />
                </motion.div>

                <div className="relative z-10 space-y-6">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <motion.div
                        animate={{
                          rotate: [0, 360],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: 'linear',
                        }}
                      >
                        <AlertTriangle className="text-hacker-error" size={32} />
                      </motion.div>
                      <h2 className="text-2xl font-bold text-hacker-error font-mono">
                        TERMINATE SESSION
                      </h2>
                    </div>
                    <button
                      onClick={onCancel}
                      className="p-2 hover:bg-hacker-error/20 rounded transition-colors"
                    >
                      <X className="text-hacker-error" size={20} />
                    </button>
                  </div>

                  {/* Warning Icon with Animation */}
                  <div className="flex justify-center">
                    <motion.div
                      className="relative"
                      animate={{
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    >
                      <div className="w-24 h-24 rounded-full bg-hacker-error/20 border-4 border-hacker-error flex items-center justify-center">
                        <LogOut className="text-hacker-error" size={48} />
                      </div>
                      <motion.div
                        className="absolute inset-0 rounded-full border-4 border-hacker-error"
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [0.5, 0, 0.5],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: 'easeOut',
                        }}
                      />
                    </motion.div>
                  </div>

                  {/* Message */}
                  <div className="text-center space-y-3">
                    <p className="text-white font-mono text-lg">
                      Are you sure you want to end this chat session?
                    </p>
                    <div className="bg-hacker-dark/50 border-2 border-hacker-error/50 p-4 rounded">
                      <p className="text-hacker-error/80 font-mono text-sm">
                        Room: <span className="text-hacker-error font-bold">{roomId}</span>
                      </p>
                      <p className="text-hacker-error/60 font-mono text-xs mt-2">
                        All messages will be saved. You can rejoin anytime.
                      </p>
                    </div>
                  </div>

                  {/* Security Notice */}
                  <div className="flex items-center gap-2 bg-hacker-dark/50 border border-hacker-border p-3 rounded">
                    <Shield className="text-hacker-green" size={20} />
                    <p className="text-hacker-green/70 font-mono text-xs">
                      Session will be securely terminated
                    </p>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-4">
                    <button
                      onClick={onCancel}
                      className="flex-1 py-3 bg-hacker-dark border-2 border-hacker-border text-white hover:bg-hacker-dark/80 transition-all font-mono font-bold"
                    >
                      CANCEL
                    </button>
                    <button
                      onClick={() => {
                        playHackSound(400, 0.2, 'sweep')
                        setTimeout(() => {
                          playHackSound(300, 0.3, 'beep')
                          onConfirm()
                        }, 200)
                      }}
                      className="flex-1 py-3 bg-hacker-error/20 border-2 border-hacker-error text-hacker-error hover:bg-hacker-error/30 transition-all glow-red font-mono font-bold flex items-center justify-center gap-2"
                    >
                      <LogOut size={18} />
                      END CHAT
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

