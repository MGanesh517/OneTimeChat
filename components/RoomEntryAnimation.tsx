'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, Shield, CheckCircle2, Zap } from 'lucide-react'

interface RoomEntryAnimationProps {
  roomId: string
  onComplete: () => void
}

export default function RoomEntryAnimation({ roomId, onComplete }: RoomEntryAnimationProps) {
  const [stage, setStage] = useState<'decoding' | 'verifying' | 'granted'>('decoding')
  const [decodedValue, setDecodedValue] = useState('')
  const [scanLines, setScanLines] = useState<string[]>([])
  const audioContextRef = useRef<AudioContext | null>(null)

  // Generate hacking sound effect
  const playHackSound = (frequency: number, duration: number, type: 'beep' | 'sweep' | 'glitch' = 'beep') => {
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
      
      if (type === 'glitch') {
        oscillator.type = 'sawtooth'
        oscillator.frequency.setValueAtTime(frequency, ctx.currentTime)
        oscillator.frequency.exponentialRampToValueAtTime(frequency * 2, ctx.currentTime + duration / 2)
        oscillator.frequency.exponentialRampToValueAtTime(frequency, ctx.currentTime + duration)
      } else {
        oscillator.frequency.value = frequency
        oscillator.type = type === 'sweep' ? 'sawtooth' : 'square'
      }
      
      gainNode.gain.setValueAtTime(0.15, ctx.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration)
      
      oscillator.start(ctx.currentTime)
      oscillator.stop(ctx.currentTime + duration)
    } catch (error) {
      // Silently fail if audio context is not available
    }
  }

  useEffect(() => {
    // Generate scan lines for decoding
    const generateScanLine = () => {
      const chars = '0123456789ABCDEF'
      return Array.from({ length: 32 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
    }

    // Stage 1: Decoding (0-2.5s)
    const decodingInterval = setInterval(() => {
      setDecodedValue(generateScanLine().substring(0, 16))
      setScanLines(Array.from({ length: 5 }, () => generateScanLine()))
      playHackSound(150 + Math.random() * 200, 0.08, 'beep')
    }, 80)

    setTimeout(() => {
      clearInterval(decodingInterval)
      setStage('verifying')
      playHackSound(350, 0.3, 'sweep')
    }, 2500)

    // Stage 2: Verifying (2.5-4s)
    setTimeout(() => {
      setStage('granted')
      playHackSound(500, 0.4, 'glitch')
      setTimeout(() => {
        playHackSound(700, 0.3, 'sweep')
        playHackSound(900, 0.2, 'beep')
      }, 200)
    }, 4000)

    // Stage 3: Complete (4-6s)
    setTimeout(() => {
      onComplete()
    }, 6000)

    return () => {
      clearInterval(decodingInterval)
    }
  }, [onComplete])

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="entry-animation"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-50 bg-hacker-darker flex items-center justify-center overflow-hidden"
      >
        {/* Animated Background Grid */}
        <motion.div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,255,136,0.15) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,255,136,0.15) 1px, transparent 1px)
            `,
            backgroundSize: '30px 30px',
          }}
          animate={{
            backgroundPosition: ['0px 0px', '30px 30px'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
        />

        {/* Scanning Lines Effect */}
        {stage === 'decoding' && (
          <div className="absolute inset-0 pointer-events-none">
            {scanLines.map((line, i) => (
              <motion.div
                key={i}
                className="absolute left-0 right-0 h-px bg-hacker-green/20"
                initial={{ top: `${(i + 1) * 15}%`, opacity: 0 }}
                animate={{
                  top: ['20%', '80%'],
                  opacity: [0, 0.5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: 'linear',
                }}
              />
            ))}
          </div>
        )}

        <div className="relative z-10 flex flex-col items-center gap-10">
          {/* Enhanced Circular Decoding Animation */}
          <div className="relative w-80 h-80">
            {/* Outer Glow Ring */}
            <motion.div
              className="absolute inset-0 rounded-full"
              animate={{
                boxShadow: [
                  '0 0 40px rgba(0,255,136,0.3)',
                  '0 0 80px rgba(0,255,136,0.5)',
                  '0 0 40px rgba(0,255,136,0.3)',
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />

            {/* Outer Ring */}
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-hacker-green/40"
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            />
            
            {/* Middle Ring */}
            <motion.div
              className="absolute inset-6 rounded-full border-4 border-hacker-green/60"
              animate={{ rotate: -360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            />

            {/* Inner Ring */}
            <motion.div
              className="absolute inset-12 rounded-full border-4 border-hacker-green/80"
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            />
            
            {/* Center Circle with Icon */}
            <div className="absolute inset-20 rounded-full bg-hacker-dark border-4 border-hacker-green flex items-center justify-center overflow-hidden">
              {/* Pulsing Background */}
              <motion.div
                className="absolute inset-0 bg-hacker-green/10"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />

              {/* Icon */}
              <div className="relative z-10">
                {stage === 'decoding' && (
                  <motion.div
                    animate={{
                      scale: [1, 1.15, 1],
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  >
                    <Lock className="text-hacker-green" size={64} strokeWidth={2.5} />
                  </motion.div>
                )}
                {stage === 'verifying' && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 150, damping: 15 }}
                  >
                    <Shield className="text-hacker-green" size={64} strokeWidth={2.5} />
                  </motion.div>
                )}
                {stage === 'granted' && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: [0, 1.2, 1], rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  >
                    <CheckCircle2 className="text-hacker-green" size={64} strokeWidth={2.5} />
                  </motion.div>
                )}
              </div>
            </div>

            {/* Decoding Value Display */}
            {stage === 'decoding' && (
              <motion.div
                className="absolute -bottom-12 left-1/2 transform -translate-x-1/2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="text-hacker-green font-mono text-lg tracking-wider font-bold">
                  {decodedValue}
                </div>
              </motion.div>
            )}
          </div>

          {/* Status Text with Glitch Effect */}
          <div className="text-center space-y-6 min-h-[200px] flex flex-col justify-center">
            <AnimatePresence mode="wait">
              {stage === 'decoding' && (
                <motion.div
                  key="decoding"
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -30, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-3"
                >
                  <motion.h2
                    className="text-4xl md:text-5xl font-bold text-hacker-green font-mono"
                    animate={{
                      textShadow: [
                        '0 0 10px rgba(0,255,136,0.5)',
                        '0 0 20px rgba(0,255,136,0.8)',
                        '0 0 10px rgba(0,255,136,0.5)',
                      ],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  >
                    DECODING ACCESS...
                  </motion.h2>
                  <p className="text-hacker-green/70 font-mono text-base">
                    Analyzing room credentials
                  </p>
                </motion.div>
              )}

              {stage === 'verifying' && (
                <motion.div
                  key="verifying"
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -30, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-3"
                >
                  <motion.h2
                    className="text-4xl md:text-5xl font-bold text-hacker-green font-mono"
                    animate={{
                      textShadow: [
                        '0 0 10px rgba(0,255,136,0.5)',
                        '0 0 25px rgba(0,255,136,0.9)',
                        '0 0 10px rgba(0,255,136,0.5)',
                      ],
                    }}
                    transition={{
                      duration: 1.2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  >
                    VERIFYING SECURITY...
                  </motion.h2>
                  <p className="text-hacker-green/70 font-mono text-base">
                    Establishing secure connection
                  </p>
                </motion.div>
              )}

              {stage === 'granted' && (
                <motion.div
                  key="granted"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  {/* Door Opening Effect */}
                  <motion.div
                    className="relative overflow-hidden"
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: '100%', opacity: 1 }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  >
                    <div className="bg-hacker-green/20 border-4 border-hacker-green p-8 rounded-lg backdrop-blur-sm relative overflow-hidden">
                      {/* Animated Background */}
                      <motion.div
                        className="absolute inset-0 bg-hacker-green/5"
                        animate={{
                          backgroundPosition: ['0% 0%', '100% 100%'],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: 'linear',
                        }}
                        style={{
                          backgroundImage: 'linear-gradient(45deg, transparent 30%, rgba(0,255,136,0.1) 50%, transparent 70%)',
                          backgroundSize: '200% 200%',
                        }}
                      />

                      <motion.h2
                        className="text-5xl md:text-6xl font-bold text-hacker-green font-mono relative z-10"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                      >
                        <motion.span
                          animate={{
                            textShadow: [
                              '0 0 20px rgba(0,255,136,0.8)',
                              '0 0 40px rgba(0,255,136,1)',
                              '0 0 20px rgba(0,255,136,0.8)',
                            ],
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: 'easeInOut',
                          }}
                        >
                          ACCESS GRANTED
                        </motion.span>
                      </motion.h2>

                      {/* Success Icon */}
                      <motion.div
                        className="absolute top-4 right-4"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
                      >
                        <Zap className="text-hacker-green" size={32} fill="currentColor" />
                      </motion.div>
                    </div>
                  </motion.div>

                  <motion.p
                    className="text-hacker-green/80 font-mono text-lg font-semibold"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                  >
                    Room: <span className="text-hacker-green">{roomId}</span>
                  </motion.p>

                  {/* Enhanced Glitch Effect */}
                  <motion.div
                    className="flex gap-3 justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9 }}
                  >
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-3 h-3 rounded-full bg-hacker-green"
                        animate={{
                          scale: [1, 1.8, 1],
                          opacity: [0.4, 1, 0.4],
                          boxShadow: [
                            '0 0 10px rgba(0,255,136,0.5)',
                            '0 0 20px rgba(0,255,136,1)',
                            '0 0 10px rgba(0,255,136,0.5)',
                          ],
                        }}
                        transition={{
                          duration: 0.8,
                          repeat: Infinity,
                          delay: i * 0.15,
                          ease: 'easeInOut',
                        }}
                      />
                    ))}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Enhanced Progress Bar */}
          <div className="w-80 h-2 bg-hacker-dark border-2 border-hacker-green/30 rounded-full overflow-hidden relative">
            <motion.div
              className="h-full bg-hacker-green relative"
              initial={{ width: '0%' }}
              animate={{
                width: stage === 'decoding' ? '40%' : stage === 'verifying' ? '75%' : '100%',
              }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <motion.div
                className="absolute inset-0 bg-hacker-green/50"
                animate={{
                  x: ['-100%', '100%'],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
