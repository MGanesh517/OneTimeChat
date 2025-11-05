'use client'

import { motion } from 'framer-motion'

interface GlitchTextProps {
    text: string
    className?: string
}

export default function GlitchText({ text, className = '' }: GlitchTextProps) {
    return (
        <motion.div
            className={`relative inline-block ${className}`}
            animate={{
                x: [0, -2, 2, -2, 2, 0],
            }}
            transition={{
                duration: 0.1,
                repeat: Infinity,
                repeatDelay: 2,
            }}
        >
            <span className="text-shadow-green">{text}</span>
            <span
                className="absolute inset-0 text-red-500 opacity-75"
                style={{
                    clipPath: 'inset(0 0 0 0)',
                    transform: 'translate(2px, -2px)',
                }}
            >
                {text}
            </span>
            <span
                className="absolute inset-0 text-cyan-500 opacity-75"
                style={{
                    clipPath: 'inset(0 0 0 0)',
                    transform: 'translate(-2px, 2px)',
                }}
            >
                {text}
            </span>
        </motion.div>
    )
}

