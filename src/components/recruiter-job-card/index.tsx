'use client'

import CommonCard from '../cmn-card'
import JobIcon from '../job-icon'
import { Button } from '../ui/button'
import { useState } from 'react'
import JobApplicants from '../job-applicants'

const RecruiterJobCard = ({ jobItem, jobApplications }: any) => {
  const [showApplicantsDrawer, setShowApplicantsDrawer] = useState(false)
  const [currentCandidateDetails, setCurrentCandidateDetails] = useState(null)
  const [
    showcurrentCandidateDetailsModal,
    setShowcurrentCandidateDetailsModal,
  ] = useState(false)

  return (
    <div>
      <CommonCard
        icon={<JobIcon width={100} height={100} />}
        title={jobItem?.title}
        footerContent={
          <Button
            onClick={() => setShowApplicantsDrawer(true)}
            className=' dark:bg-black dark:text-gray-200 disabled:opacity-55 mr-auto px-5 '
            disabled={
              jobApplications.filter(
                (item: { jobId: any }) => item.jobId === jobItem?._id
              ).length === 0
            }
          >
            {
              jobApplications.filter(
                (item: { jobId: any }) => item?.jobId === jobItem?._id
              ).length
            }{' '}
            Applicants
          </Button>
        }
      />
      <JobApplicants
        showApplicantsDrawer={showApplicantsDrawer}
        setShowApplicantsDrawer={setShowApplicantsDrawer}
        currentCandidateDetails={currentCandidateDetails}
        setCurrentCandidateDetails={setCurrentCandidateDetails}
        showcurrentCandidateDetailsModal={showcurrentCandidateDetailsModal}
        setShowcurrentCandidateDetailsModal={
          setShowcurrentCandidateDetailsModal
        }
        jobItem={jobItem}
        jobApplications={jobApplications.filter(
          (jobApplicantsItem: { jobId: any; _id: any }) =>
            jobApplicantsItem.jobId === jobItem?._id
        )}
      />
    </div>
  )
}

export default RecruiterJobCard
