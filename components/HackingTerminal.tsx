'use client'

import { motion } from 'framer-motion'
import { Terminal, Lock, Users, Video } from 'lucide-react'

interface HackingTerminalProps {
    roomId: string
    onCopyRoomId: () => void
}

export default function HackingTerminal({ roomId, onCopyRoomId }: HackingTerminalProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-hacker-dark border-2 border-hacker-green glow-green p-6 rounded-lg relative overflow-hidden"
        >
            <div className="scan-line absolute inset-0 pointer-events-none"></div>

            <div className="flex items-center gap-2 mb-4">
                <Terminal className="text-hacker-green" size={20} />
                <span className="text-hacker-text font-bold">SYSTEM TERMINAL</span>
            </div>

            <div className="space-y-2 font-mono text-sm">
                <div className="flex items-center gap-2">
                    <span className="text-hacker-green">&gt;</span>
                    <span className="text-white">Room ID Generated:</span>
                </div>
                <div className="flex items-center gap-2 ml-4">
                    <Lock className="text-hacker-green" size={16} />
                    <code className="text-hacker-green text-lg font-bold tracking-wider">{roomId}</code>
                    <button
                        onClick={onCopyRoomId}
                        className="ml-4 px-3 py-1 bg-hacker-green/20 border border-hacker-green text-hacker-green hover:bg-hacker-green/30 transition-all text-xs"
                    >
                        COPY
                    </button>
                </div>
                <div className="flex items-center gap-2 mt-4">
                    <span className="text-hacker-green">&gt;</span>
                    <span className="text-white">Status:</span>
                    <span className="text-hacker-text animate-pulse-green">ACTIVE</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-hacker-green">&gt;</span>
                    <span className="text-white">Participants:</span>
                    <Users className="text-hacker-green" size={16} />
                    <span className="text-hacker-text">Waiting...</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-hacker-green">&gt;</span>
                    <span className="text-white">Video Call:</span>
                    <Video className="text-hacker-green" size={16} />
                    <span className="text-hacker-text">Ready</span>
                </div>
            </div>
        </motion.div>
    )
}

