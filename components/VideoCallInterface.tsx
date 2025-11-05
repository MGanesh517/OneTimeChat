'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Video, VideoOff, Mic, MicOff, Maximize2, X } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useWebRTC } from '@/hooks/useWebRTC'
import { useSocket } from '@/contexts/SocketContext'

export default function VideoCallInterface() {
    const params = useParams()
    const roomId = params.roomId as string
    const { isConnected } = useSocket()
    const {
        localVideoRef,
        remoteVideoRef,
        videoEnabled,
        audioEnabled,
        startLocalStream,
        stopLocalStream,
        toggleVideo,
        toggleAudio,
    } = useWebRTC(roomId)
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [hasStarted, setHasStarted] = useState(false)

    useEffect(() => {
        if (isConnected && !hasStarted) {
            startLocalStream()
            setHasStarted(true)
        }
        return () => {
            if (hasStarted) {
                stopLocalStream()
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isConnected])

    return (
        <div className="relative bg-hacker-dark border-2 border-hacker-green glow-green rounded-lg overflow-hidden">
            {/* Video Container */}
            <div className="relative aspect-video bg-hacker-darker">
                {/* Remote Video (Main) */}
                <video
                    ref={remoteVideoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                    style={{ display: remoteVideoRef.current?.srcObject ? 'block' : 'none' }}
                />
                
                {/* Placeholder when no remote stream */}
                {!remoteVideoRef.current?.srcObject && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                            <div className="w-24 h-24 rounded-full bg-hacker-green/20 border-4 border-hacker-green mx-auto mb-4 flex items-center justify-center animate-pulse-green">
                                <Video className="text-hacker-green" size={40} />
                            </div>
                            <p className="text-hacker-text font-mono">Waiting for connection...</p>
                            <p className="text-xs text-hacker-green/50 mt-2">Share this room ID to connect</p>
                        </div>
                    </div>
                )}

                {/* Local Video (Picture-in-Picture) */}
                {localVideoRef.current?.srcObject && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute top-4 right-4 w-32 h-24 bg-hacker-darker border-2 border-hacker-green rounded-lg overflow-hidden"
                    >
                        <video
                            ref={localVideoRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-hacker-green/20 p-1">
                            <p className="text-xs text-hacker-green text-center font-mono">You</p>
                        </div>
                    </motion.div>
                )}

                {/* Connection Status */}
                <div className="absolute top-4 left-4 flex items-center gap-2 bg-hacker-darker/80 border border-hacker-green px-3 py-1 rounded">
                    <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-hacker-green animate-pulse-green' : 'bg-hacker-error'}`}></div>
                    <span className="text-xs text-hacker-green font-mono">{isConnected ? 'CONNECTED' : 'CONNECTING...'}</span>
                </div>
            </div>

            {/* Controls */}
            <div className="bg-hacker-darker border-t-2 border-hacker-green p-4">
                <div className="flex items-center justify-center gap-4">
                    <button
                        onClick={toggleVideo}
                        disabled={!isConnected}
                        className={`p-3 rounded-lg border-2 transition-all ${videoEnabled
                                ? 'bg-hacker-green/20 border-hacker-green text-hacker-green glow-green'
                                : 'bg-hacker-error/20 border-hacker-error text-hacker-error'
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        {videoEnabled ? <Video size={20} /> : <VideoOff size={20} />}
                    </button>

                    <button
                        onClick={toggleAudio}
                        disabled={!isConnected}
                        className={`p-3 rounded-lg border-2 transition-all ${audioEnabled
                                ? 'bg-hacker-green/20 border-hacker-green text-hacker-green glow-green'
                                : 'bg-hacker-error/20 border-hacker-error text-hacker-error'
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        {audioEnabled ? <Mic size={20} /> : <MicOff size={20} />}
                    </button>

                    <button
                        onClick={() => setIsFullscreen(!isFullscreen)}
                        className="p-3 rounded-lg border-2 border-hacker-green bg-hacker-green/20 text-hacker-green hover:bg-hacker-green/30 transition-all"
                    >
                        <Maximize2 size={20} />
                    </button>

                    <button
                        onClick={() => {
                            stopLocalStream()
                            setHasStarted(false)
                        }}
                        className="p-3 rounded-lg border-2 border-hacker-error bg-hacker-error/20 text-hacker-error hover:bg-hacker-error/30 transition-all"
                    >
                        <X size={20} />
                    </button>
                </div>
            </div>
        </div>
    )
}

