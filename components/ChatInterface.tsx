'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, User, Bot, Reply, X } from 'lucide-react'
import { useChat, Message } from '@/hooks/useChat'
import { useSocket } from '@/contexts/SocketContext'
import { useRouter } from 'next/navigation'

interface ChatInterfaceProps {
    roomId: string
}

export default function ChatInterface({ roomId }: ChatInterfaceProps) {
    const { messages, sendMessage, isConnected } = useChat(roomId)
    const { participantCount, socket } = useSocket()
    const router = useRouter()
    const [input, setInput] = useState('')
    const [replyingTo, setReplyingTo] = useState<Message | null>(null)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleSend = () => {
        if (input.trim() && isConnected) {
            sendMessage(input, replyingTo ? {
                id: replyingTo.id,
                text: replyingTo.text,
                sender: replyingTo.sender,
            } : undefined)
            setInput('')
            setReplyingTo(null)
        }
    }

    const handleEndChat = () => {
        if (socket) {
            socket.emit('leave-room', { roomId })
        }
        router.push('/')
    }

    const handleReplyClick = (message: Message) => {
        setReplyingTo(message)
        // Scroll to input
        setTimeout(() => {
            const input = document.querySelector('input[type="text"]') as HTMLInputElement
            input?.focus()
        }, 100)
    }

    return (
        <div className="flex flex-col h-full bg-hacker-dark border-2 border-hacker-green glow-green rounded-lg overflow-hidden">
            {/* Chat Header */}
            <div className="bg-hacker-darker border-b-2 border-hacker-green p-4">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-hacker-green animate-pulse-green' : 'bg-hacker-error'}`}></div>
                        <span className="text-hacker-text font-bold">ROOM: {roomId}</span>
                        {participantCount > 0 && (
                            <span className="text-xs text-hacker-green/70">({participantCount} users)</span>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-hacker-green/70">
                            {isConnected ? 'ANONYMOUS MODE • CONNECTED' : 'CONNECTING...'}
                        </span>
                        <button
                            onClick={handleEndChat}
                            className="px-3 py-1.5 bg-hacker-error/20 border border-hacker-error text-hacker-error hover:bg-hacker-error/30 transition-all text-xs font-mono font-bold flex items-center gap-1"
                        >
                            <X size={14} />
                            END CHAT
                        </button>
                    </div>
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
                            className={`group flex items-start gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : ''
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
                                    {/* Reply Preview */}
                                    {message.replyTo && (
                                        <div className={`mb-2 pb-2 border-l-2 ${
                                            message.replyTo.sender === 'user' 
                                                ? 'border-hacker-green/50' 
                                                : 'border-hacker-border/50'
                                        } pl-2 text-xs opacity-70`}>
                                            <div className="flex items-center gap-1 mb-1">
                                                <Reply size={12} className="text-hacker-green/70" />
                                                <span className="text-hacker-green/70 font-mono">
                                                    {message.replyTo.sender === 'user' ? 'You' : 'Anonymous'}
                                                </span>
                                            </div>
                                            <p className="text-hacker-green/60 font-mono truncate max-w-[200px]">
                                                {message.replyTo.text}
                                            </p>
                                        </div>
                                    )}
                                    <p className="text-sm font-mono break-words">{message.text}</p>
                                    <div className="flex items-center justify-between mt-2 gap-2">
                                        <span className="text-xs text-hacker-green/50">
                                            {message.timestamp.toLocaleTimeString()}
                                        </span>
                                        <button
                                            onClick={() => handleReplyClick(message)}
                                            className="opacity-0 group-hover:opacity-100 hover:opacity-100 transition-opacity p-1 hover:bg-hacker-green/20 rounded"
                                            title="Reply to this message"
                                        >
                                            <Reply size={12} className="text-hacker-green/70" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
                <div ref={messagesEndRef} />
            </div>

            {/* Reply Preview */}
            {replyingTo && (
                <div className="border-t-2 border-hacker-green bg-hacker-darker/50 p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                        <Reply size={16} className="text-hacker-green flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs text-hacker-green/70 font-mono">
                                    Replying to {replyingTo.sender === 'user' ? 'yourself' : 'Anonymous'}
                                </span>
                            </div>
                            <p className="text-xs text-hacker-green/60 font-mono truncate">
                                {replyingTo.text}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => setReplyingTo(null)}
                        className="p-1 hover:bg-hacker-error/20 text-hacker-error transition-all flex-shrink-0"
                    >
                        <X size={16} />
                    </button>
                </div>
            )}

            {/* Input */}
            <div className="border-t-2 border-hacker-green p-4 bg-hacker-darker">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                handleSend()
                            } else if (e.key === 'Escape' && replyingTo) {
                                setReplyingTo(null)
                            }
                        }}
                        placeholder={
                            replyingTo 
                                ? `Reply to: ${replyingTo.text.substring(0, 30)}...` 
                                : isConnected 
                                    ? "Type your message..." 
                                    : "Connecting..."
                        }
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

