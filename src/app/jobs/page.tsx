import {
  fetchProfileAction,
  fetchJobsForRecruiter,
  fetchJobsForCandidateAction,
  fetchJobApplicationForCandidate,
  fetchJobApplicationForRecruiter,
  createFilterCategoryAction,
} from '@/actions'
import JobListing from '@/components/job-listing'
import { currentUser } from '@clerk/nextjs/server'

const JobsPage = async ({ searchParams }: any) => {
  const user = await currentUser()
  const profileInfo = await fetchProfileAction(user?.id)

  // getting the jobs from action
  const jobsList =
    profileInfo?.role === 'candidate'
      ? await fetchJobsForCandidateAction({ filterParams: searchParams })
      : await fetchJobsForRecruiter(user?.id)

  // get job applications lists

  const JobApplicationList =
    profileInfo?.role === 'candidate'
      ? await fetchJobApplicationForCandidate(user?.id)
      : await fetchJobApplicationForRecruiter(user?.id)

  // get  Filter categories
  const fetchFilterCategories = await createFilterCategoryAction()

  return (
    <JobListing
      user={JSON.parse(JSON.stringify(user))}
      profileInfo={profileInfo}
      jobsList={jobsList}
      jobApplications={JobApplicationList}
      filterCategories={fetchFilterCategories}
    />
  )
}

export default JobsPage
