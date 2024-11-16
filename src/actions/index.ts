'use server'

import connect from '@/lib/database'
import Application from '@/models/application'
import Job from '@/models/job'
import Profile from '@/models/profile'
import { revalidatePath } from 'next/cache'
import { FilterParamsAction } from '@/types'
import Feed from '@/models/feed'

const stripe = require('stripe')(
  'sk_test_51QIha6GINIrp0oKlc07fPRo0AnzDSgLfKLlqVPdkQzEH6lXuLXfAMipnQTJq1SfFg6pEpFnwupdRjsQ7AmDGTkVs00O3hzpgIP'
)

// create profile
export async function createProfileAction(
  formData: any,
  pathToRevalidate: string
) {
  await connect()
  await Profile.create(formData)
  revalidatePath(pathToRevalidate)
}

// collect profile
export async function fetchProfileAction(id: string | undefined) {
  await connect()
  const result = await Profile.findOne({ userId: id })
  return JSON.parse(JSON.stringify(result))
}

// create Job action
export async function postNewJobAction(
  formData: any,
  pathToRevalidate: string
) {
  await connect()
  await Job.create(formData)
  revalidatePath(pathToRevalidate)
}

// fetch job action
// this falls into 2 categories, --- recruiter and candidate

// recruiter
export const fetchJobsForRecruiter = async (id: string | undefined) => {
  await connect()
  const result = await Job.find({ recruiterId: id })

  return JSON.parse(JSON.stringify(result))
}

// candidate
// old one - collecting all the jobs

// export const fetchJobsForCandidateAction = async () => {
//   await connect()
//   const result = await Job.find({})

//   return JSON.parse(JSON.stringify(result))
// }

// new one - collecting jobs according to the search params

// export const fetchJobsForCandidateAction = async ({
//   filterParams = {} as FilterParamsAction,
// }) => {
//   await connect()

//   let updatedParams: { [key: string]: any } = {}
//   // define the structure of updatedParams as key-value pairs of strings

//   // Process the filterParams and populate updatedParams
//   Object.keys(filterParams).filter((filterKey) => {
//     updatedParams[filterKey] = { $in: filterParams[filterKey].split(',') }
//   })

//   console.log('updated params', updatedParams)

//   const result = await Job.find(
//     filterParams && Object.keys(filterParams).length > 0 ? updatedParams : {}
//   )

//   return JSON.parse(JSON.stringify(result))
// }

export const fetchJobsForCandidateAction = async ({
  filterParams = {} as FilterParamsAction,
}) => {
  await connect()

  // Define updatedParams as an object with dynamic keys and values of any type
  let updatedParams: { [key: string]: any } = {}

  // Populate updatedParams by processing each key in filterParams
  Object.keys(filterParams).forEach((filterKey) => {
    updatedParams[filterKey] = {
      $in: Array.isArray(filterParams[filterKey])
        ? filterParams[filterKey]
        : filterParams[filterKey].split(','),
    }
  })

  // Fetch jobs based on updatedParams if any keys exist, else fetch all jobs
  const result = await Job.find(
    Object.keys(updatedParams).length > 0 ? updatedParams : {}
  )

  return JSON.parse(JSON.stringify(result))
}

// export const fetchJobsForCandidateAction = async ({
//   filterParams = {} as FilterParamsAction,
// }) => {
//   await connect()

//   // Log the incoming filterParams to ensure it has values
//   console.log('Received filterParams:', filterParams)

//   let updatedParams: { [key: string]: { $in: string[] } } = {} // define the structure of updatedParams

//   if (filterParams && Object.keys(filterParams).length > 0) {
//     Object.keys(filterParams).forEach((filterKey) => {
//       const paramValue = filterParams[filterKey]

//       // Log the filterKey and paramValue to ensure they're being accessed correctly
//       console.log(`Processing filterKey: ${filterKey}, paramValue:`, paramValue)

//       if (paramValue) {
//         // Check if paramValue is a string, and split it if necessary
//         updatedParams[filterKey] = {
//           $in: Array.isArray(paramValue)
//             ? paramValue // it's already an array
//             : (paramValue as string).split(','), // it's a string, so split it
//         }
//       }
//     })

//     // Log the updatedParams after the loop
//     console.log('Updated Params after processing:', updatedParams)
//   } else {
//     console.log('No filterParams provided or filterParams is empty')
//   }

//   const result = await Job.find(
//     Object.keys(updatedParams).length > 0 ? updatedParams : {}
//   )

//   return JSON.parse(JSON.stringify(result))
// }

// export const fetchJobsForCandidateAction = async ({
//   filterParams = {} as FilterParamsType,
// }) => {
//   await connect()

//   let updatedParams: { [key: string]: { $in: string[] } } = {} // define the structure of updatedParams

//   Object.keys(filterParams).forEach((filterKey) => {
//     updatedParams[filterKey] = { $in: filterParams[filterKey].split(',') }
//   })

//   const result = await Job.find(
//     filterParams && Object.keys(filterParams).length > 0 ? updatedParams : {}
//   )

//   return JSON.parse(JSON.stringify(result))
// }

// create job application action

export async function createJobApplication(
  data: any,
  pathToRevalidate: string
) {
  await connect()
  await Application.create(data)
  revalidatePath(pathToRevalidate)
}

// fetch job application action - candidate

export async function fetchJobApplicationForCandidate(
  candidateId: string | undefined
) {
  await connect()
  const result = await Application.find({ candidateUserId: candidateId })

  return JSON.parse(JSON.stringify(result))
}

// fetch job application action - recruiter

export async function fetchJobApplicationForRecruiter(
  recruiterId: string | undefined
) {
  await connect()
  const result = await Application.find({ recruiterUserId: recruiterId })

  return JSON.parse(JSON.stringify(result))
}

// update job application action
export async function updateJobApplicationAction(
  data: any,
  pathToRevalidate: string
) {
  await connect()
  const {
    _id,
    recruiterUserId,
    name,
    email,
    candidateUserId,
    status,
    jobId,
    JobApplyDate,
  } = data
  await Application.findOneAndUpdate(
    {
      _id: _id,
    },
    {
      recruiterUserId,
      name,
      email,
      candidateUserId,
      status,
      jobId,
      JobApplyDate,
    },
    {
      new: true,
    }
  )
  revalidatePath(pathToRevalidate)
}

// get candidate details by candidate ID
export async function getCandidateDetailsByIDAction(currentCandidateID: any) {
  await connect()
  const result = await Profile.findOne({ userId: currentCandidateID })
  return JSON.parse(JSON.stringify(result))
}

// create Filter component
export async function createFilterCategoryAction() {
  await connect()
  const result = await Job.find({})
  return JSON.parse(JSON.stringify(result))
}

// Update Profile Action
export async function updateProfileAction(data: any, pathToRevalidate: string) {
  await connect()

  const {
    userId,
    role,
    email,
    isPremiumUser,
    memberShipType,
    memberShipStartDate,
    memberShipEndDate,
    recruiterInfo,
    candidateInfo,
    _id,
  } = data

  await Profile.findOneAndUpdate(
    {
      _id: _id,
    },
    {
      userId,
      role,
      email,
      isPremiumUser,
      memberShipType,
      memberShipStartDate,
      memberShipEndDate,
      recruiterInfo,
      candidateInfo,
    },
    { new: true }
  )

  revalidatePath(pathToRevalidate)
}

//create stripe price id based on tier selection
export async function createPriceIdAction(data: any) {
  const session = await stripe.prices.create({
    currency: 'inr',
    unit_amount: data?.amount * 100,
    recurring: {
      interval: 'year',
    },
    product_data: {
      name: 'Premium Plan',
    },
  })

  return {
    success: true,
    id: session?.id,
  }
}

//create payment logic
export async function createStripePaymentAction(data: any) {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: data?.lineItems,
    mode: 'subscription',
    success_url: `http://localhost:3000/membership` + '?status=success',
    cancel_url: `http://localhost:3000/membership` + '?status=cancel',
  })

  return {
    success: true,
    id: session?.id,
  }
}

// create post actions

export async function createFeedPostAction(
  data: any,
  pathToRevalidate: string
) {
  await connect()
  await Feed.create(data)
  revalidatePath(pathToRevalidate)
}

// fetch all post action

export async function fetchAllFeedPostAction() {
  await connect()
  const result = await Feed.find({})
  return JSON.parse(JSON.stringify(result))
}

// update post action
export async function updateFeedPostAction(
  data: any,
  pathToRevalidate: string
) {
  await connect()
  const { userId, username, message, image, likes, _id } = data
  await Feed.findOneAndUpdate(
    {
      _id: _id,
    },
    {
      userId,
      username,
      message,
      image,
      likes,
    },
    { new: true }
  )
  revalidatePath(pathToRevalidate)
}
