'use client'

import CandidateList from '../candidate-list'
import { Drawer, DrawerContent } from '../ui/drawer'
import { ScrollArea } from '../ui/scroll-area'

function JobApplicants({
  showApplicantsDrawer,
  setShowApplicantsDrawer,
  currentCandidateDetails,
  setCurrentCandidateDetails,
  showcurrentCandidateDetailsModal,
  setShowcurrentCandidateDetailsModal,
  jobItem,
  jobApplications,
}: any) {
  return (
    <Drawer open={showApplicantsDrawer} onOpenChange={setShowApplicantsDrawer}>
      <DrawerContent className='max-h-[50vh]'>
        <ScrollArea className='h-auto overflow-y-auto'>
          <CandidateList
            currentCandidateDetails={currentCandidateDetails}
            setCurrentCandidateDetails={setCurrentCandidateDetails}
            showcurrentCandidateDetailsModal={showcurrentCandidateDetailsModal}
            setShowcurrentCandidateDetailsModal={
              setShowcurrentCandidateDetailsModal
            }
            jobItem={jobItem}
            jobApplications={jobApplications}
          />
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  )
}

export default JobApplicants
