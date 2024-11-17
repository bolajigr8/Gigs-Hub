'use client'

import CompaniesPage from '@/app/companies/page'
import CommonCard from '../cmn-card'
import JobIcon from '../job-icon'
import { Button } from '../ui/button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const Companies = ({ jobsList }: any) => {
  const router = useRouter()

  // create unique set of companies
  const createNewSetOfCompanies: string[] = Array.from(
    new Set(
      jobsList
        .filter(
          (jobItem: { companyName: string }) =>
            jobItem?.companyName?.trim() !== ''
        )
        .map((item: { companyName: string }) => item.companyName)
    )
  )

  // handleFilterJobsByCompanyName, the functionality of the params has been done in the jobs page
  const handleFilterJobsByCompanyName = (getCompanyName: string) => {
    sessionStorage.setItem(
      'filterParams',
      JSON.stringify({
        companyName: [getCompanyName],
      })
    )

    router.push('/jobs')
  }

  return (
    <section className='mx-auto max-w-7xl'>
      <header className='flex items-baseline justify-between border-b pb-6 pt-24'>
        <h1 className='text-4xl font-bold tracking-tight dark:text-gray-200 text-gray-900'>
          Browse Companies
        </h1>
      </header>
      <main className='pt-6 pb-24'>
        <div className='grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-3'>
          <div className='lg:col-span-4'>
            <div className='container mx-auto p-0 space-y-8'>
              {/* new one  */}
              <div className='grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-3'>
                {createNewSetOfCompanies &&
                createNewSetOfCompanies.length > 0 ? (
                  createNewSetOfCompanies.map((companyName, index) => (
                    <CommonCard
                      key={index}
                      icon={<JobIcon width={120} height={120} />}
                      title={companyName}
                      footerContent={
                        <Button
                          onClick={() =>
                            handleFilterJobsByCompanyName(companyName)
                          }
                          className='h-11 flex items-center dark:text-gray-200 dark:bg-black  justify-center px-5'
                        >
                          <Link href={'/jobs'}>See jobs</Link>
                        </Button>
                      }
                    />
                  ))
                ) : (
                  <h1>No companies Present</h1>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </section>
  )
}

export default Companies
