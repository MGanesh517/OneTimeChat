import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

export const metadata: Metadata = {
  title: 'OneTime Chat - Anonymous Secure Chat',
  description: 'Anonymous chat with unique room IDs and video calls',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://one-time-chat-one.vercel.app'),
  icons: {
    icon: '/icon.svg',
  },
  openGraph: {
    title: 'OneTime Chat - Anonymous Secure Chat',
    description: 'Anonymous chat with unique room IDs and video calls',
    type: 'website',
    url: '/',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'OneTime Chat - Anonymous Secure Chat',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OneTime Chat - Anonymous Secure Chat',
    description: 'Anonymous chat with unique room IDs and video calls',
    images: ['/opengraph-image'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}

