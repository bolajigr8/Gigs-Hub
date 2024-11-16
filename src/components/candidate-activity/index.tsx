'use client'

import CommonCard from '../cmn-card'
import JobIcon from '../job-icon'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'

const CandidateActivity = ({ jobList, jobApplicants }: any) => {
  const uniqueStatusArray = Array.from(
    new Set(
      jobApplicants
        .map((jobApplicantItem: any) => jobApplicantItem.status)
        .flat(1)
    )
  )

  return (
    <section className='mx-auto max-w-7xl'>
      <Tabs defaultValue='Applied' className='w-full'>
        <div className='flex items-baseline justify-between border-b pb-6 pt-24 '>
          <h1 className='text-4xl font-bold tracking-tight dark:text-gray-200 text-gray-950  '>
            Your Activity
          </h1>
          {/* list of status tabs */}
          <TabsList>
            {uniqueStatusArray.map((status: any) => (
              <TabsTrigger value={status}>{status}</TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/*  */}

        <div className='pb-24 pt-6'>
          <article className='container mx-auto p-0 space-y-8'>
            <div className='flex flex-col gap-4'>
              {uniqueStatusArray.map((status: any) => (
                <TabsContent value={status}>
                  {jobList
                    .filter(
                      (jobItem: any) =>
                        jobApplicants
                          .filter(
                            (jobApplication: any) =>
                              jobApplication.status.indexOf(status) > -1
                          )
                          .findIndex(
                            (filteredItemByStatus: any) =>
                              jobItem._id === filteredItemByStatus.jobId
                          ) > -1
                    )
                    .map((finalFilteredItem: any) => {
                      return (
                        <CommonCard
                          icon={<JobIcon width={0} height={0} />}
                          title={finalFilteredItem?.title}
                          description={finalFilteredItem?.companyName}
                        />
                      )
                    })}
                </TabsContent>
              ))}
            </div>
          </article>
        </div>
      </Tabs>
    </section>
  )
}

export default CandidateActivity
