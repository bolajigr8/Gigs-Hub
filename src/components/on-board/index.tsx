'use client'
// for both recruiter and candidate
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useEffect, useState } from 'react'
import { CommonForm } from '../cmn-form'
import {
  candidateOnboardFormControls,
  initialCandidateFormData,
  initialRecruiterFormData,
  recruiterOnboardFormControls,
} from '@/utils'
import { useUser } from '@clerk/nextjs'
import { createProfileAction } from '@/actions'
import { createClient } from '@supabase/supabase-js'
// Import UUID for generating unique file names (you can use any unique generator)
import { v4 as uuidv4 } from 'uuid' // Install with `npm install uuid`

// creating supabase client
const supabaseClient = createClient(
  'https://hgmzxgxgjncrnbgtljwl.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnbXp4Z3hnam5jcm5iZ3RsandsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjkyMzc3MDUsImV4cCI6MjA0NDgxMzcwNX0.ioktoM-6_jIEJH7F8UNOkJwnhjHdegP9u0sRfeEKz-Q'
)

function OnBoard() {
  // tabs
  const [currentTab, setCurrentTab] = useState('candidate')

  // recruiter form data
  const [recruiterFormData, setRecruiterFormData] = useState(
    initialRecruiterFormData
  )

  const [candidateFormData, setCandidateFormData] = useState(
    initialCandidateFormData
  )

  // state for the file  (supabase)
  // const [file, setFile] = useState(null)
  const [file, setFile] = useState<File | null>(null)

  // to get whether current user is authenticated, useUser() is a hook from clerk
  const currentAuthUser = useUser()

  // destructuring
  const { user } = currentAuthUser
  console.log('user', user)
  console.log('email', user?.primaryEmailAddress?.emailAddress)
  // ---------functions-----------

  // handle file
  const handleFileChange = (e: any) => {
    e.preventDefault()
    // console.log(e.target.files)
    // this set the files in our file state
    setFile(e.target.files[0])
  }

  // function uploading pdf to supabase
  async function handleUploadPdfToSupabase() {
    if (!file) return

    // Generate a unique file name by appending a UUID
    const uniqueFileName = `${uuidv4()}-${file.name}`

    // this stores in our storage
    const { data, error } = await supabaseClient.storage
      .from('Gigs-Hub-Public')
      .upload(`/public/${uniqueFileName}`, file as any, {
        cacheControl: '3600',
        upsert: false,
      })

    if (data) {
      setCandidateFormData({
        ...candidateFormData,
        // store the unique file path in the form data
        resume: data.path,
      })
    } else if (error?.message.includes('Duplicate')) {
      // Handle the duplicate error by informing the user or handling it as needed
      console.error('File already exists! Consider renaming the file.')
    } else if (error) {
      console.error('Upload failed:', error.message)
    }
  }

  // async function handleUploadPdfToSupabase() {
  //   // this stores in our storage
  //   const { data, error } = await supabaseClient.storage
  //     .from('Gigs-Hub')
  //     .upload(`/public/${file?.name}`, file as any, {
  //       cacheControl: '3600',
  //       upsert: false,
  //     })
  //   console.log(data, error)
  //   if (data) {
  //     setCandidateFormData({
  //       ...candidateFormData,
  //       // this will give the path that we are going to store in our database
  //       resume: data.path,
  //     })
  //   }
  //   // console.log(candidateFormData)
  // }

  // use effect for the file
  useEffect(() => {
    if (file) {
      handleUploadPdfToSupabase()
    }
  }, [file])

  const handleTabChange = (value: string) => {
    setCurrentTab(value)
  }

  // function to check if all fields are filled by recruiter
  const handleRecruiterFormValid = () => {
    return (
      recruiterFormData &&
      recruiterFormData.name.trim() !== '' &&
      recruiterFormData.companyName?.trim() !== '' &&
      recruiterFormData.companyRole?.trim() !== ''
    )
  }

  // function to check if all fields are filled by the candidates

  const handleCandidateFormValid = () => {
    return Object.entries(candidateFormData).every(([key, value]) => {
      if (typeof value === 'string') {
        return value.trim() !== ''
      }
      return true // For non-string fields like booleans or optional fields, skip validation
    })
  }

  // const handleCandidateFormValid = () => {
  //   return Object.entries(candidateFormData).every(([key, value]) => {
  //     if (typeof value === 'string') {
  //       return value.trim() !== ''
  //     }
  //     return true // For non-string fields like booleans or optional fields, skip validation
  //   })
  // }

  // create profile
  async function createProfile() {
    const data =
      currentTab === 'candidate'
        ? {
            candidateInfo: candidateFormData,
            isPremiumUser: false,
            role: 'candidate',
            userId: user?.id,
            email: user?.primaryEmailAddress?.emailAddress,
          }
        : {
            recruiterInfo: recruiterFormData,
            role: 'recruiter',
            isPremiumUser: false,
            userId: user?.id,
            email: user?.primaryEmailAddress?.emailAddress,
          }

    await createProfileAction(data, '/onboard')
  }

  return (
    <div className='bg-white dark:bg-gray-950 '>
      <Tabs value={currentTab} onValueChange={handleTabChange}>
        {/* heading */}
        <div className='w-full'>
          <div className='flex items-baseline justify-between border-b pb-6 pt-24'>
            <h1 className='text-4xl font-bold tracking-tighter dark:text-gray-200 text-gray-900'>
              Welcome to Onboarding
            </h1>
            <TabsList className=''>
              {/* for candidate */}
              <TabsTrigger value='candidate'>Candidate</TabsTrigger>
              {/* for recruiter */}
              <TabsTrigger value='recruiter'>Recruiter</TabsTrigger>
            </TabsList>
          </div>
        </div>
        {/* content */}
        <TabsContent value='candidate'>
          <CommonForm
            formControls={candidateOnboardFormControls}
            btnText={'Onboard as Candidate'}
            formData={candidateFormData}
            setFormData={setCandidateFormData}
            action={createProfile}
            handleFileChange={handleFileChange}
            btnType={'submit'}
            isBtnDisabled={!handleCandidateFormValid()}
          />
        </TabsContent>
        <TabsContent value='recruiter'>
          <CommonForm
            formControls={recruiterOnboardFormControls}
            btnText={'Onboard as Recruiter'}
            formData={recruiterFormData}
            setFormData={setRecruiterFormData}
            action={createProfile}
            isBtnDisabled={!handleRecruiterFormValid()}
            btnType={'submit'}
            // handleFileChange={handleFileChange}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default OnBoard
