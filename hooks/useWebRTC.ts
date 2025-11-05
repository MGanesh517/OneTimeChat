import { useState, useEffect, useRef } from 'react'
import { useSocket } from '@/contexts/SocketContext'

export function useWebRTC(roomId: string) {
  const { socket, isConnected } = useSocket()
  const [localStream, setLocalStream] = useState<MediaStream | null>(null)
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null)
  const [videoEnabled, setVideoEnabled] = useState(true)
  const [audioEnabled, setAudioEnabled] = useState(true)
  
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null)

  // Initialize WebRTC
  useEffect(() => {
    if (!socket || !isConnected) return

    const configuration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
      ],
    }

    const pc = new RTCPeerConnection(configuration)
    peerConnectionRef.current = pc

    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('ice-candidate', {
          roomId,
          candidate: event.candidate,
        })
      }
    }

    // Handle remote stream
    pc.ontrack = (event) => {
      setRemoteStream(event.streams[0])
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0]
      }
    }

    // Listen for WebRTC signaling
    socket.on('offer-received', async (data: { offer: RTCSessionDescriptionInit }) => {
      try {
        await pc.setRemoteDescription(new RTCSessionDescription(data.offer))
        const answer = await pc.createAnswer()
        await pc.setLocalDescription(answer)
        socket.emit('answer', {
          roomId,
          answer,
        })
      } catch (error) {
        console.error('Error handling offer:', error)
      }
    })

    socket.on('answer-received', async (data: { answer: RTCSessionDescriptionInit }) => {
      try {
        await pc.setRemoteDescription(new RTCSessionDescription(data.answer))
      } catch (error) {
        console.error('Error handling answer:', error)
      }
    })

    socket.on('ice-candidate-received', async (data: { candidate: RTCIceCandidateInit }) => {
      try {
        await pc.addIceCandidate(new RTCIceCandidate(data.candidate))
      } catch (error) {
        console.error('Error adding ICE candidate:', error)
      }
    })

    return () => {
      pc.close()
      peerConnectionRef.current = null
    }
  }, [socket, isConnected, roomId])

  // Get user media
  const startLocalStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: videoEnabled,
        audio: audioEnabled,
      })
      setLocalStream(stream)
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream
      }

      // Add tracks to peer connection
      if (peerConnectionRef.current) {
        stream.getTracks().forEach((track) => {
          peerConnectionRef.current?.addTrack(track, stream)
        })
      }

      // Create and send offer
      if (peerConnectionRef.current && socket) {
        const offer = await peerConnectionRef.current.createOffer()
        await peerConnectionRef.current.setLocalDescription(offer)
        socket.emit('offer', {
          roomId,
          offer,
        })
      }
    } catch (error) {
      console.error('Error accessing media devices:', error)
    }
  }

  // Stop local stream
  const stopLocalStream = () => {
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop())
      setLocalStream(null)
    }
  }

  // Toggle video
  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = !videoEnabled
        setVideoEnabled(!videoEnabled)
      }
    }
  }

  // Toggle audio
  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !audioEnabled
        setAudioEnabled(!audioEnabled)
      }
    }
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopLocalStream()
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close()
      }
    }
  }, [])

  return {
    localVideoRef,
    remoteVideoRef,
    localStream,
    remoteStream,
    videoEnabled,
    audioEnabled,
    startLocalStream,
    stopLocalStream,
    toggleVideo,
    toggleAudio,
  }
}

