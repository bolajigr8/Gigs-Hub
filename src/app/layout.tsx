import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Suspense } from 'react'
import Loading from './Loading'
import CommonLayout from '@/components/cmn-layout'
import { ClerkProvider } from '@clerk/nextjs'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Micbol Gigs-Hub',
  description: 'Get Hired Here',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang='en'>
        <body className={inter.className}>
          <Suspense fallback={<Loading />}>
            <CommonLayout
              attribute='class'
              defaultTheme='system'
              children={children}
            />
            {/* to use toast we must put this here */}
          </Suspense>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  )
}
