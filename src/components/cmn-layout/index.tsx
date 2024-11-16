import { currentUser } from '@clerk/nextjs/server'
import Header from '../header'
import { fetchProfileAction } from '@/actions'
// for dark mode
import * as React from 'react'
import {
  ThemeProvider as NextThemesProvider,
  ThemeProviderProps,
} from 'next-themes'

type CommonLayoutProps = {
  children: React.ReactNode
  attribute: ThemeProviderProps['attribute'] // Ensure it matches the expected type
  defaultTheme: string
}

const CommonLayout = async ({
  children,
  // for dark mode
  attribute = 'class', // Default value for attribute
  defaultTheme,
}: CommonLayoutProps) => {
  const user = await currentUser()
  const profileInfo = await fetchProfileAction(user?.id)
  return (
    // wrapping everything in the nextthemesprovoder for dark mode --- we also go to the main layout page

    <NextThemesProvider attribute={attribute} defaultTheme={defaultTheme}>
      <div className='mx-auto max-w-7xl p-6 lg:px-8'>
        {/* header */}
        <Header
          profileInfo={profileInfo}
          user={JSON.parse(JSON.stringify(user))}
        />

        {/* children - main content */}
        <main>{children}</main>
        {/* children - main content */}
      </div>
    </NextThemesProvider>
  )
}

export default CommonLayout
