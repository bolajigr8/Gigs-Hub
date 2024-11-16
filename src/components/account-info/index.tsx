'use client'

import {
  recruiterOnboardFormControls,
  candidateOnboardFormControls,
  initialCandidateAccountFormData,
  initialRecruiterFormData,
} from '@/utils'
import { useEffect, useState } from 'react'
import { CommonForm } from '../cmn-form'
import { updateProfileAction } from '@/actions'

const AccountInfo = ({ profileInfo }: any) => {
  const [candidateFormData, setCandidateFormData] = useState(
    initialCandidateAccountFormData
  )
  const [recruiterFormData, setRecruiterFormData] = useState(
    initialRecruiterFormData
  )

  useEffect(() => {
    if (profileInfo?.role === 'recruiter')
      setRecruiterFormData(profileInfo?.recruiterInfo)
    if (profileInfo?.role === 'candidate')
      setCandidateFormData(profileInfo?.candidateInfo)
  }, [profileInfo])

  // handle update action the recruiter or candidate form data

  const handleUpdateAction = async () => {
    await updateProfileAction(
      profileInfo?.role === 'candidate'
        ? {
            _id: profileInfo?._id,
            userId: profileInfo?.userId,
            role: profileInfo?.role,
            email: profileInfo?.email,
            isPremiumUser: profileInfo?.isPremiumUser,
            membershipType: profileInfo?.membershipType,
            membershipStartDate: profileInfo?.membershipStartDate,
            membershipEndDate: profileInfo?.membershipEndDate,
            candidateInfo: {
              ...candidateFormData,
              resume: profileInfo?.candidateInfo?.resume,
            },
          }
        : {
            _id: profileInfo?._id,
            userId: profileInfo?.userId,
            role: profileInfo?.role,
            email: profileInfo?.email,
            isPremiumUser: profileInfo?.isPremiumUser,
            membershipType: profileInfo?.membershipType,
            membershipStartDate: profileInfo?.membershipStartDate,
            membershipEndDate: profileInfo?.membershipEndDate,

            recruiterInfo: {
              ...recruiterFormData,
            },
          },
      '/account'
    )
  }

  return (
    <section className='mx-auto max-w-7xl'>
      {/* for nice header */}
      <div className='flex items-baseline justify-between pb-6 border-b pt-24'>
        <h1 className='text-4xl font-bold tracking-tight dark:text-gray-200 text-gray-950'>
          Account Details
        </h1>
      </div>
      {/* for nice header */}
      <div className='py-20 pb-24 pt-6'>
        <article className='container mx-auto p-0 space-y-8'>
          <CommonForm
            btnType={'submit'}
            action={handleUpdateAction}
            btnText='Update Profile'
            formControls={
              profileInfo?.role === 'candidate'
                ? candidateOnboardFormControls.filter(
                    (formControl) => formControl.name !== 'resume'
                  )
                : recruiterOnboardFormControls
            }
            formData={
              profileInfo?.role === 'candidate'
                ? candidateFormData
                : recruiterFormData
            }
            setFormData={
              profileInfo?.role === 'candidate'
                ? setCandidateFormData
                : setRecruiterFormData
            }
          />
        </article>
      </div>{' '}
    </section>
  )
}

export default AccountInfo
