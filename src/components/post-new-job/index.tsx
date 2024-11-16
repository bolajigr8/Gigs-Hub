'use client'
import React, { useState } from 'react'
import { Button } from '../ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { initialPostNewJobFormData, postNewJobFormControls } from '@/utils'
import { CommonForm } from '../cmn-form'
import { postNewJobFormType } from '@/types'
import { postNewJobAction } from '@/actions'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'

const PostNewJob = ({ user, profileInfo, jobsList }: any) => {
  const [showJobDialog, setShowJobDialog] = useState(false)
  const [jobFormData, setJobFormData] = useState({
    ...initialPostNewJobFormData,
    // we are setting the companyName value to be constant gotten from profileInfo
    companyName: profileInfo?.recruiterInfo?.companyName,
  })

  // for toast
  const { toast } = useToast()

  console.log('jobs list', jobsList)

  // to check if all the fields are filled and then enable the btn
  const handlePostBtn = () => {
    return (Object.keys(jobFormData) as Array<keyof postNewJobFormType>).every(
      (control) =>
        typeof jobFormData[control] === 'string' &&
        jobFormData[control].trim() !== ''
    )
  }

  // post new job action
  async function createNewJobs() {
    await postNewJobAction(
      { ...jobFormData, recruiterId: user?.id, candidates: [] },
      '/jobs'
    )
    setJobFormData({
      ...initialPostNewJobFormData,
      companyName: profileInfo?.recruiterInfo?.companyName,
    })
    setShowJobDialog(false)
  }

  // handle post new job
  function handleAddNewJobs() {
    if (!profileInfo?.isPremiumUser && jobsList.length >= 2) {
      // using the toast
      toast({
        variant: 'destructive',
        title: 'You can post max 2 jobs',
        description: 'Please opt for membership to post more jobs',
      })
      return
    }
    // displaying the form
    setShowJobDialog(true)
    setJobFormData({
      ...initialPostNewJobFormData,
      // we are setting the companyName value to be constant gotten from profileInfo
      companyName: profileInfo?.recruiterInfo?.companyName,
    })
  }

  return (
    <div>
      <Button
        onClick={() => handleAddNewJobs()}
        className='disabled:opacity-60 flex h-11 items-center justify-center   '
      >
        Post A Job
      </Button>
      <Dialog open={showJobDialog} onOpenChange={() => setShowJobDialog(false)}>
        <DialogContent className='overflow-auto   sm:max-w-screen-md h-[500px]    '>
          <DialogHeader>
            <DialogTitle>Post new Job</DialogTitle>
          </DialogHeader>
          <div className='gap-4 grid py-4'>
            <CommonForm
              btnText={'Add'}
              formData={jobFormData}
              setFormData={setJobFormData}
              isBtnDisabled={!handlePostBtn()}
              formControls={postNewJobFormControls}
              btnType={'submit'}
              action={createNewJobs}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default PostNewJob
