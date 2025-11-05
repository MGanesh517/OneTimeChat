'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, User, Bot } from 'lucide-react'
import { useChat } from '@/hooks/useChat'
import { useSocket } from '@/contexts/SocketContext'

interface ChatInterfaceProps {
    roomId: string
}

export default function ChatInterface({ roomId }: ChatInterfaceProps) {
    const { messages, sendMessage, isConnected } = useChat(roomId)
    const { participantCount } = useSocket()
    const [input, setInput] = useState('')
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleSend = () => {
        if (input.trim() && isConnected) {
            sendMessage(input)
            setInput('')
        }
    }

    return (
        <div className="flex flex-col h-full bg-hacker-dark border-2 border-hacker-green glow-green rounded-lg overflow-hidden">
            {/* Chat Header */}
            <div className="bg-hacker-darker border-b-2 border-hacker-green p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-hacker-green animate-pulse-green' : 'bg-hacker-error'}`}></div>
                        <span className="text-hacker-text font-bold">ROOM: {roomId}</span>
                        {participantCount > 0 && (
                            <span className="text-xs text-hacker-green/70">({participantCount} users)</span>
                        )}
                    </div>
                    <span className="text-xs text-hacker-green/70">
                        {isConnected ? 'ANONYMOUS MODE • CONNECTED' : 'CONNECTING...'}
                    </span>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                <AnimatePresence>
                    {messages.map((message) => (
                        <motion.div
                            key={message.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className={`flex items-start gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : ''
                                }`}
                        >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${message.sender === 'user'
                                    ? 'bg-hacker-green/20 border border-hacker-green'
                                    : 'bg-hacker-border border border-hacker-green/50'
                                }`}>
                                {message.sender === 'user' ? (
                                    <User className="text-hacker-green" size={16} />
                                ) : (
                                    <Bot className="text-hacker-text" size={16} />
                                )}
                            </div>
                            <div className={`flex-1 max-w-[70%] ${message.sender === 'user' ? 'text-right' : ''
                                }`}>
                                <div className={`inline-block p-3 rounded-lg ${message.sender === 'user'
                                        ? 'bg-hacker-green/20 border border-hacker-green text-hacker-green'
                                        : 'bg-hacker-darker border border-hacker-border text-white'
                                    }`}>
                                    <p className="text-sm font-mono break-words">{message.text}</p>
                                    <span className="text-xs text-hacker-green/50 mt-1 block">
                                        {message.timestamp.toLocaleTimeString()}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t-2 border-hacker-green p-4 bg-hacker-darker">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder={isConnected ? "Type your message..." : "Connecting..."}
                        disabled={!isConnected}
                        className="flex-1 bg-hacker-dark border-2 border-hacker-green/50 text-white px-4 py-2 focus:outline-none focus:border-hacker-green focus:glow-green font-mono placeholder:text-hacker-green/30 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!isConnected || !input.trim()}
                        className="px-6 py-2 bg-hacker-green/20 border-2 border-hacker-green text-hacker-green hover:bg-hacker-green/30 transition-all glow-green flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send size={18} />
                        <span className="font-bold">SEND</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

