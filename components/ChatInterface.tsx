'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, User, Bot, Reply, X } from 'lucide-react'
import { useChat, Message } from '@/hooks/useChat'
import { useSocket } from '@/contexts/SocketContext'
import { useRouter } from 'next/navigation'
import EndChatModal from '@/components/EndChatModal'

interface ChatInterfaceProps {
    roomId: string
}

export default function ChatInterface({ roomId }: ChatInterfaceProps) {
    const { messages, sendMessage, isConnected, displayName, setDisplayName } = useChat(roomId)
    const { participantCount, socket } = useSocket()
    const router = useRouter()
    const [input, setInput] = useState('')
    const [replyingTo, setReplyingTo] = useState<Message | null>(null)
    const [showNamePrompt, setShowNamePrompt] = useState(false)
    const [showEndChatModal, setShowEndChatModal] = useState(false)
    const [tempName, setTempName] = useState('')
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    // Auto-show name prompt if no name is set
    useEffect(() => {
        if (isConnected && !displayName.trim()) {
            const key = `otc_display_name_${roomId}`
            const saved = typeof window !== 'undefined' ? localStorage.getItem(key) : null
            if (!saved || !saved.trim()) {
                // Auto-generate and show prompt
                const random = `User${Math.floor(100 + Math.random() * 900)}`
                setTempName(random)
                setShowNamePrompt(true)
            }
        }
    }, [isConnected, displayName, roomId])

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
        setShowEndChatModal(true)
    }

    const confirmEndChat = () => {
        if (socket) {
            socket.emit('leave-room', { roomId })
        }
        setShowEndChatModal(false)
        router.push('/')
    }

    const handleReplyClick = (message: Message) => {
        // Flatten replies: only reference the immediate message text, never nested
        const flat: Message = { id: message.id, text: message.text, sender: message.sender, timestamp: message.timestamp }
        setReplyingTo(flat)
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
                                {/* Receiver-only display name */}
                                {message.sender === 'other' && (
                                    <div className="text-xs text-hacker-green/70 font-mono mb-1">
                                        {message.displayName || 'Anonymous'}
                                    </div>
                                )}
                                <div className={`inline-block p-3 rounded-lg ${message.sender === 'user'
                                    ? 'bg-hacker-green/20 border border-hacker-green text-hacker-green'
                                    : 'bg-hacker-darker border border-hacker-border text-white'
                                    }`}>
                                    {/* Reply Preview */}
                                    {message.replyTo && (
                                        <div className={`mb-2 pb-2 border-l-2 ${message.replyTo.sender === 'user'
                                            ? 'border-hacker-green/50'
                                            : 'border-hacker-border/50'
                                            } pl-2 text-xs opacity-70`}>
                                            <div className="flex items-center gap-1 mb-1">
                                                <Reply size={12} className="text-hacker-green/70" />
                                                <span className="text-hacker-green/70 font-mono">Reply</span>
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

            {/* Name Prompt Modal */}
            {showNamePrompt && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-20">
                    <div className="bg-hacker-darker border-2 border-hacker-green p-4 w-full max-w-md">
                        <h3 className="text-hacker-green font-mono font-bold mb-2">Choose a display name</h3>
                        <p className="text-xs text-hacker-green/70 font-mono mb-3">Shown only to others. Your own messages won’t display your name.</p>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={tempName}
                                onChange={(e) => setTempName(e.target.value)}
                                placeholder={displayName}
                                className="flex-1 bg-hacker-dark border-2 border-hacker-green/50 text-white px-3 py-2 font-mono"
                            />
                            <button
                                onClick={() => {
                                    const gen = `User${Math.floor(100 + Math.random() * 900)}`
                                    setTempName(gen)
                                }}
                                className="px-3 py-2 bg-hacker-green/20 border-2 border-hacker-green text-hacker-green"
                            >
                                Random
                            </button>
                        </div>
                        <div className="flex justify-end gap-2 mt-3">
                            <button
                                onClick={() => setShowNamePrompt(false)}
                                className="px-3 py-1.5 border-2 border-hacker-border text-white/80"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    const name = (tempName || displayName).trim()
                                    const key = `otc_display_name_${roomId}`
                                    setDisplayName(name)
                                    if (typeof window !== 'undefined') localStorage.setItem(key, name)
                                    setShowNamePrompt(false)
                                }}
                                className="px-3 py-1.5 bg-hacker-green/20 border-2 border-hacker-green text-hacker-green"
                            >
                                Save
                            </button>
                        </div>
                    </div>
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
                    <button
                        onClick={() => setShowNamePrompt(true)}
                        className="px-3 py-2 border-2 border-hacker-green text-hacker-green hover:bg-hacker-green/10 font-mono"
                        title="Set display name"
                    >
                        {displayName}
                    </button>
                </div>
            </div>

            {/* End Chat Modal */}
            <EndChatModal
                isOpen={showEndChatModal}
                onConfirm={confirmEndChat}
                onCancel={() => setShowEndChatModal(false)}
                roomId={roomId}
            />
        </div>
    )
}

