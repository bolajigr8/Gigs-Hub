'use client'

import {
  AwaitedReactNode,
  Fragment,
  JSXElementConstructor,
  ReactElement,
  ReactNode,
  ReactPortal,
} from 'react'
import { Button } from '../ui/button'
import { Dialog, DialogFooter, DialogContent, DialogTitle } from '../ui/dialog'
import {
  getCandidateDetailsByIDAction,
  updateJobApplicationAction,
} from '@/actions'

import { createClient } from '@supabase/supabase-js'

const CandidateList = ({
  currentCandidateDetails,
  setCurrentCandidateDetails,
  showcurrentCandidateDetailsModal,
  setShowcurrentCandidateDetailsModal,
  jobItem,
  jobApplications,
}: any) => {
  // function to collect the candidate details
  async function handleFetchCandidateDetails(getCurrentCandidateId: any) {
    const data = await getCandidateDetailsByIDAction(getCurrentCandidateId)
    if (data) {
      setCurrentCandidateDetails(data)
      setShowcurrentCandidateDetailsModal(true)
    }
  }

  // supabase client for handlePreviewResume
  const supabaseClient = createClient(
    'https://hgmzxgxgjncrnbgtljwl.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnbXp4Z3hnam5jcm5iZ3RsandsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjkyMzc3MDUsImV4cCI6MjA0NDgxMzcwNX0.ioktoM-6_jIEJH7F8UNOkJwnhjHdegP9u0sRfeEKz-Q'
  )

  // Function to download Resume
  async function handlePreviewResume() {
    try {
      const resumePath = currentCandidateDetails?.candidateInfo?.resume

      if (!resumePath) {
        console.error('No resume path found.')
        return
      }

      // Retrieve the public URL from Supabase
      const { data, error }: any = await supabaseClient.storage
        .from('Gigs-Hub-Public')
        .getPublicUrl(resumePath)

      // Check if the file was found
      if (error || !data?.publicUrl) {
        console.error(
          'Error fetching resume URL:',
          error || 'Public URL not available'
        )
        return
      }

      const fileName = resumePath.split('/').pop() || 'Resume.pdf'

      // Create an anchor element for downloading the resume
      const a = document.createElement('a')
      a.href = data.publicUrl
      a.setAttribute('download', fileName)
      a.setAttribute('target', '_blank')

      // Append the anchor to the document and trigger the download
      document.body.appendChild(a)
      a.click()

      document.body.removeChild(a)
    } catch (err) {
      console.error('Error in handlePreviewResume:', err)
    }
  }

  // handleUpdateJobstatus function
  async function handleUpdateJobstatus(getCurrentJobstaus: any) {
    let copyJobyApplicants = [...jobApplications]

    const indexOfJobApplicant = copyJobyApplicants.findIndex(
      (item: any) => item.candidateUserId === currentCandidateDetails?.userId
    )

    const jobAplicantToUpdate = {
      ...copyJobyApplicants[indexOfJobApplicant],
      status:
        copyJobyApplicants[indexOfJobApplicant].status.concat(
          getCurrentJobstaus
        ),
    }
    await updateJobApplicationAction(jobAplicantToUpdate, '/jobs')
  }

  return (
    <Fragment>
      <div className='grid grid-cols-1 gap-3 p-10 md:grid-cols-2 lg:grid-cols-3'>
        {jobApplications && jobApplications.length > 0
          ? jobApplications.map(
              (
                jobApplicantItem: { name: string; candidateUserId: string },
                index: number // Added key here
              ) => (
                <div
                  key={index}
                  className='bg-white shadow-lg w-full max-w-sm rounded-lg overflow-hidden mx-auto mt-4'
                >
                  {' '}
                  {/* Added key here */}
                  <div className='px-4 my-6 flex justify-between items-center'>
                    <h3 className='dark:text-gray-950 text-lg font-bold'>
                      {jobApplicantItem?.name}
                    </h3>
                    <Button
                      onClick={() =>
                        handleFetchCandidateDetails(
                          jobApplicantItem?.candidateUserId
                        )
                      }
                      className=' dark:bg-black  dark:text-gray-200 flex h-11 items-center justify-center px-5'
                    >
                      View Profile
                    </Button>
                  </div>
                </div>
              )
            )
          : null}
      </div>

      <Dialog
        open={showcurrentCandidateDetailsModal}
        onOpenChange={() => {
          setShowcurrentCandidateDetailsModal(null)
          setShowcurrentCandidateDetailsModal(false)
        }}
      >
        <DialogContent className='dark:bg-gray-950'>
          <div className='p-6 dark:bg-gray-950 bg-white rounded-lg shadow-lg'>
            <h1 className='text-3xl font-bold text-gray-900 mb-3 leading-tight'>
              <span className='text-indigo-600'>
                {currentCandidateDetails?.candidateInfo?.name}
              </span>
              <span className='text-gray-500 dark:text-gray-200 ml-2 text-sm font-light'>
                {currentCandidateDetails?.email}
              </span>
            </h1>

            <p className='text-md font-semibold dark:text-gray-200 text-gray-700'>
              {currentCandidateDetails?.candidateInfo?.currentCompany}
            </p>

            <p className='text-sm font-medium dark:text-gray-200 text-gray-600'>
              {currentCandidateDetails?.candidateInfo?.currentJobLocation}
            </p>

            <p className='text-md font-semibold dark:text-gray-200 text-gray-800'>
              Total Experience:{' '}
              {currentCandidateDetails?.candidateInfo?.totalExperience} Years
            </p>

            <p className='text-md font-semibold dark:text-gray-200 text-gray-800'>
              Salary:{' '}
              <span className=' text-green-600'>
                $ {currentCandidateDetails?.candidateInfo?.currentSalary}
              </span>
            </p>
            <p className='text-md font-semibold dark:text-gray-200 text-gray-800'>
              Notice Period:{' '}
              {currentCandidateDetails?.candidateInfo?.noticePeriod}
            </p>

            {/* Previous Companies */}
            <div className='mt-4'>
              <p className='text-md font-semibold dark:text-gray-200 text-gray-800'>
                Previous Companies:
              </p>
              <div className='flex gap-2 flex-wrap mt-2'>
                {currentCandidateDetails?.candidateInfo?.previousCompany
                  .split(',')
                  .map(
                    (
                      item: string,
                      index: number // Added key here
                    ) => (
                      <div
                        key={index}
                        className='w-28 flex justify-center items-center  h-8 bg-gray-800 rounded-md'
                      >
                        {' '}
                        {/* Added key here */}
                        <h2 className='text-sm font-medium text-white capitalize'>
                          {item}
                        </h2>
                      </div>
                    )
                  )}
              </div>
            </div>

            {/* Skills */}
            <div className='mt-6'>
              <p className='text-md font-semibold dark:text-gray-200 text-gray-800'>
                Skills:
              </p>
              <div className='flex items-center flex-wrap gap-2 mt-2'>
                {currentCandidateDetails?.candidateInfo?.skills
                  ?.replace(/\sand\s/g, ',')
                  ?.replace(/\s+/g, ',')
                  ?.split(',')
                  ?.filter((item: string) => item)
                  ?.map(
                    (
                      item: string,
                      index: number // Added key here
                    ) => (
                      <div
                        key={index} // Added key here
                        className='w-24 flex justify-center items-center h-8 bg-blue-600 rounded-md'
                      >
                        <h2 className='text-sm font-medium text-white capitalize'>
                          {item.trim()}
                        </h2>
                      </div>
                    )
                  )}
              </div>
            </div>

            {/* Buttons */}
            <div className='mt-8 flex gap-3'>
              {/* Resume Button */}
              <Button
                onClick={handlePreviewResume}
                className='flex h-11 items-center justify-center px-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md shadow-sm'
              >
                Resume
              </Button>
              {/* Select Button */}
              <Button
                onClick={() => handleUpdateJobstatus('selected')}
                className={`flex h-11 items-center justify-center px-5 bg-green-600 hover:bg-green-700 text-white rounded-md shadow-sm disabled:opacity-65`}
                disabled={
                  jobApplications
                    .find(
                      (item: any) =>
                        item.candidateUserId === currentCandidateDetails?.userId
                    )
                    ?.status.includes('selected') ||
                  jobApplications
                    .find(
                      (item: any) =>
                        item.candidateUserId === currentCandidateDetails?.userId
                    )
                    ?.status.includes('not selected')
                }
              >
                Select
              </Button>
              {/* Reject Button */}
              <Button
                onClick={() => handleUpdateJobstatus('not selected')}
                className={`flex h-11 items-center justify-center px-5 bg-red-600 hover:bg-red-700 text-white rounded-md shadow-sm disabled:opacity-65`}
                disabled={
                  jobApplications
                    .find(
                      (item: any) =>
                        item.candidateUserId === currentCandidateDetails?.userId
                    )
                    ?.status.includes('not selected') ||
                  jobApplications
                    .find(
                      (item: any) =>
                        item.candidateUserId === currentCandidateDetails?.userId
                    )
                    ?.status.includes('selected')
                }
              >
                Reject
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Fragment>
  )
}

export default CandidateList
