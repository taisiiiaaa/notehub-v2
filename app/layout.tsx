import type { Metadata } from 'next'
import { Roboto } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import TanStackProvider from '@/components/TanStackProvider/TanStackProvider'

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-roboto',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Home | NoteHub',
  description:
    'Welcome to NoteHub, a simple and efficient application for managing personal notes. Organize your thoughts and ideas with ease',
  openGraph: {
    title: 'Home | NoteHub',
    description:
      'Welcome to NoteHub, a simple and efficient application for managing personal notes. Organize your thoughts and ideas with ease',
    url: `https://notehub.com`,
    images: [
      {
        url: 'https://ac.goit.global/fullstack/react/og-meta.jpg',
        width: 1200,
        height: 630,
        alt: 'NoteHub - A simple and efficient application for managing personal notes',
      },
    ],
  },
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode
  modal: React.ReactNode
}>) {
  return (
    <html lang='en' className={roboto.variable}>
      <body>
        <TanStackProvider>
          <Header />

          {modal}
          {children}

          <Footer />

          <div id='modal-root' />
        </TanStackProvider>
      </body>
    </html>
  )
}
