import {
  fetchJobApplicationForCandidate,
  fetchJobsForCandidateAction,
} from '@/actions'
import CandidateActivity from '@/components/candidate-activity'
import { currentUser } from '@clerk/nextjs/server'

const ActivityPage = async ({ searchParams }: any) => {
  const user = await currentUser()
  const jobList = await fetchJobsForCandidateAction(searchParams)
  const jobApplicants = await fetchJobApplicationForCandidate(user?.id)
  return <CandidateActivity jobList={jobList} jobApplicants={jobApplicants} />
}

export default ActivityPage
