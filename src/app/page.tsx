import Image from 'next/image'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { fetchProfileAction } from '@/actions'
import { Fragment } from 'react'
import { Button } from '@/components/ui/button'
import HomeBtnControls from '@/components/homebtn-control'

interface ProfileInfo {
  _id: string | undefined
}

async function Home() {
  // this is whether user is authenticated or not
  const user = await currentUser()

  // this is whether user that is authenticated is either a candidate or recruiter
  const profileInfo: ProfileInfo = await fetchProfileAction(user?.id)

  // if the Id is not present, it means the person is not onboarded as a candidate or recruiter, so they need to onboard first  ---- so he has registered as a user but is not onboaded as either a candidate or a recruiter
  if (user && !profileInfo?._id) redirect('/onboard')

  return (
    <Fragment>
      <section className=''>
        <div className='relative w-full'>
          <div className='min-h-screen flex'>
            <article className='container m-auto p-0'>
              <div className='flex items-center flex-wrap gap-12 lg:gap-0'>
                <div className='lg:w-5/12 space-y-8'>
                  <span className='flex space-x-2'>
                    <span className='block w-14 mb-2 border-b-2 dark:border-gray-400 border-gray-700'></span>
                    <span className='font-medium text-gray-600   dark:text-gray-200'>
                      One Stop Solution to Find Jobs
                    </span>
                  </span>
                  <h1 className='text-5xl font-bold md:text-6xl'>
                    The Best <br /> Job Portal App
                  </h1>
                  <p className='text-xl text-gray-700 dark:text-gray-200 capitalize'>
                    find the best jobs from top product companies and build your
                    career
                  </p>
                  <HomeBtnControls
                    profileInfo={profileInfo}
                    user={JSON.parse(JSON.stringify(user))}
                  />
                </div>
                {/* image */}

                <section className='hidden relative w-full  lg:w-[50%] lg:flex items-center justify-end'>
                  <img
                    src='https://utfs.io/f/4c9f7186-8ad0-4680-aece-a5abea608705-k6t10e.png'
                    alt='Hero'
                    className='h-full  w-full object-contain z-10'
                  />
                </section>
              </div>
            </article>
          </div>
        </div>
      </section>
    </Fragment>
  )
}

export default Home
