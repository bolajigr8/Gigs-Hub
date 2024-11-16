'use client'

import { Button } from '../ui/button'
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet'
import Link from 'next/link'
import { AlignJustify, Moon } from 'lucide-react'
import { UserButton } from '@clerk/nextjs'
import { FaBell } from 'react-icons/fa'
import { useTheme } from 'next-themes'

// import { menuItemsData } from '../../../data'

const Header = ({ user, profileInfo }: { user: any; profileInfo: any }) => {
  // for dark mode
  const { theme, setTheme } = useTheme()

  const menuItemsData = [
    { label: 'Home', path: '/', show: true },
    // for login and register , we will only show if the user is not authenticated --- we will show the login page if the userInfo is not there
    { label: 'Login', path: '/sign-in', show: !user },
    { label: 'Register', path: '/sign-up', show: !user },
    { label: 'Feed', path: '/feed', show: profileInfo },
    { label: 'Jobs', path: '/jobs', show: profileInfo },
    {
      label: 'Activity',
      path: '/activity',
      show: profileInfo?.role === 'candidate',
    },
    {
      label: 'Companies',
      path: '/companies',
      show: profileInfo?.role === 'candidate',
    },
    { label: 'Membership', path: '/membership', show: profileInfo },
    { label: 'Account', path: '/account', show: profileInfo },
  ]

  return (
    <div>
      <header className='flex h-16 w-full shrink-0 items-center'>
        <Sheet>
          {/* what opens it */}
          <SheetTrigger asChild>
            <Button className='lg:hidden'>
              <AlignJustify className='h-6 w-6' />
              <span className='sr-only'>Toggle Navigation Menu</span>
            </Button>
          </SheetTrigger>
          {/* what is in it  */}
          <SheetContent side='left'>
            <Link href={'#'} className='mr-6 hidden lg:flex'>
              GIGS
            </Link>
            <div className='grid gap-2 py-6'>
              {menuItemsData.map((item) =>
                item.show ? (
                  <Link
                    key={item.path}
                    // targetting the selected params in the jobs
                    onClick={() => sessionStorage.removeItem('filterParams')}
                    className='w-full  flex items-center py-2 text-lg font-semibold'
                    href={item.path}
                  >
                    {item.label}
                  </Link>
                ) : null
              )}
              <div className='flex justify-between items-center'>
                {/* dark mode */}

                <Moon
                  fill={theme === 'dark' ? 'light' : 'dark'}
                  className='cursor-pointer'
                  onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                />

                {/* from clerk for log-out */}
                <UserButton afterSignOutUrl='/' />
              </div>
            </div>
          </SheetContent>
        </Sheet>
        <Link
          className='hidden  lg:flex items-center gap-1 mr-6 font-bold'
          href='/'
        >
          <span className='text-primary text-2xl'>
            <FaBell />
          </span>
          <h1>getHired</h1>
        </Link>
        <nav className='hidden lg:flex  ml-auto gap-6 items-center'>
          {menuItemsData.map((item) =>
            item.show ? (
              <Link
                key={item.path}
                className='group inline-flex h-9 w-max items-center rounded-md  px-4 py-2 text-sm font-medium '
                href={item.path}
              >
                {item.label}
              </Link>
            ) : null
          )}
          {/* dark mode */}
          {/* the wrapping for it to work is done on the common layout */}

          <Moon
            fill={theme === 'dark' ? 'light' : 'dark'}
            className='cursor-pointer'
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          />
          {/* from clerk for log-out */}
          <UserButton afterSignOutUrl='/' />
        </nav>
      </header>
    </div>
  )
}

export default Header
