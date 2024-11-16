'use client'

import { useState } from 'react'
import CommonCard from '../cmn-card'
import JobIcon from '../job-icon'
import { Button } from '../ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { FaLocationDot } from 'react-icons/fa6'
import { createJobApplication } from '@/actions'
import { profile } from 'console'
import { useRouter, useSearchParams } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'

const CandidateJobCard = ({ jobItem, profileInfo, jobApplications }: any) => {
  const [showJobDetailsDrawer, setShowJobDetailsDrawer] = useState(false)

  // use toast
  const { toast } = useToast()

  const handleJobApply = () => {
    if (!profileInfo?.isPremiumUser && jobApplications.length >= 2) {
      setShowJobDetailsDrawer(false)
      // using the toast
      toast({
        variant: 'destructive',
        title: 'You can apply max 2 jobs',
        description: 'Please opt for membership to apply more jobs',
      })
      return
    }
    createJobApplication(
      {
        recruiterUserId: jobItem?.recruiterId,
        name: profileInfo?.candidateInfo?.name,
        email: profileInfo?.email,
        candidateUserId: profileInfo?.userId,
        status: ['Applied'],
        jobId: jobItem?._id,
        JobApplyDate: new Date().toLocaleDateString(),
      },
      '/jobs'
    )

    setShowJobDetailsDrawer(false)
  }

  return (
    <>
      <Drawer
        open={showJobDetailsDrawer}
        onOpenChange={setShowJobDetailsDrawer}
      >
        <CommonCard
          title={jobItem?.title}
          desc={jobItem?.companyName}
          icon={<JobIcon width={100} height={100} />}
          footerContent={
            <Button
              onClick={() => setShowJobDetailsDrawer(true)}
              className=' mr-auto px-5 dark:bg-black dark:text-gray-200 '
            >
              View Details
            </Button>
          }
        />

        <DrawerContent className='p-6'>
          <DrawerHeader className='px-0'>
            <div className='flex justify-between'>
              <DrawerTitle className='font-extrabold text-3xl lg:text-4xl dark:text-white text-gray-800  capitalize '>
                {jobItem?.title}
              </DrawerTitle>

              <div className='flex gap-3'>
                <Button
                  onClick={handleJobApply}
                  disabled={
                    jobApplications.findIndex(
                      (item: { jobId: any }) => item.jobId === jobItem._id
                    ) > -1
                      ? true
                      : false
                  }
                  className='disabled:opacity-65 mr-auto px-5 '
                >
                  {jobApplications.findIndex(
                    (item: { jobId: any }) => item.jobId === jobItem._id
                  ) > -1
                    ? 'Applied'
                    : 'Apply'}
                </Button>
                <Button
                  onClick={() => setShowJobDetailsDrawer(false)}
                  className=' mr-auto px-5 '
                >
                  cancel
                </Button>
              </div>
            </div>
          </DrawerHeader>

          <DrawerDescription className='text-xl flex gap-1 items-center font-medium dark:text-white text-gray-600'>
            {jobItem?.description}
            <span className='text-sm flex gap-1 items-center font-normal dark:text-white text-gray-500 ml-4'>
              <FaLocationDot />
              {jobItem?.location}
            </span>
          </DrawerDescription>

          <div className='w-[130px] mt-3 flex justify-center items-center h-[35px] bg-primary rounded-[4px]'>
            <h3 className='text-white dark:text-black text-md lg:text-lg font-bold'>
              {jobItem?.type}
            </h3>
          </div>

          <h3 className='text-medium font-medium dark:text-white text-black mt-3'>
            Experience: {jobItem?.experience}
          </h3>

          <div className='flex gap-4 mt-3'>
            {jobItem?.skills
              .replace(/\band\b/g, '')
              .split(/[\s,]+/)
              .map((item: any) => {
                return (
                  <div className='w-[100px] flex justify-center items-center h-[35px] dark:bg-white  bg-black rounded-[4px]  '>
                    <h2 className='text-[13px] font-medium dark:text-black text-white  capitalize '>
                      {item}
                    </h2>
                  </div>
                )
              })}
          </div>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default CandidateJobCard
