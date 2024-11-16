import { FormData, OnboardFormControl, postNewJobFormType } from '@/types'
import qs from 'query-string'

// Recruiter
export const recruiterOnboardFormControls: OnboardFormControl[] = [
  {
    label: 'Name',
    name: 'name',
    placeholder: 'Enter your name',
    componentType: 'input',
  },
  {
    label: 'Company Name',
    name: 'companyName',
    placeholder: 'Enter your company name',
    componentType: 'input',
  },
  {
    label: 'Company Role',
    name: 'companyRole',
    placeholder: 'Enter your company role',
    componentType: 'input',
  },
]

export const initialRecruiterFormData: FormData = {
  name: '',
  companyName: '',
  companyRole: '',
}

// Candidate

export const candidateOnboardFormControls: OnboardFormControl[] = [
  {
    label: 'Resume',
    name: 'resume',
    componentType: 'file',
  },
  {
    label: 'Name',
    name: 'name',
    placeholder: 'Enter your name',
    componentType: 'input',
  },
  {
    label: 'Current Company',
    name: 'currentCompany',
    placeholder: 'Enter your Current Company',
    componentType: 'input',
  },
  {
    label: 'Current Job Location',
    name: 'currentJobLocation',
    placeholder: 'Enter your Current Job Location',
    componentType: 'input',
  },
  {
    label: 'Preferred Job Location',
    name: 'preferredJobLocation',
    placeholder: 'Enter your Preferred Job Location',
    componentType: 'input',
  },
  {
    label: 'Current Salary',
    name: 'currentSalary',
    placeholder: 'Enter your Current Salary',
    componentType: 'input',
  },
  {
    label: 'Notice Period',
    name: 'noticePeriod',
    placeholder: 'Enter your Notice Period',
    componentType: 'input',
  },
  {
    label: 'Skills',
    name: 'skills',
    placeholder: 'Enter your Skills',
    componentType: 'input',
  },
  {
    label: 'Previous Companies',
    name: 'previousCompany',
    placeholder: 'Enter your Previous Companies',
    componentType: 'input',
  },
  {
    label: 'Total Experience',
    name: 'totalExperience',
    placeholder: 'Enter your Total Experience',
    componentType: 'input',
  },
  {
    label: 'College',
    name: 'college',
    placeholder: 'Enter your College',
    componentType: 'input',
  },
  {
    label: 'College Location',
    name: 'collegeLocation',
    placeholder: 'Enter your College Location',
    componentType: 'input',
  },
  {
    label: 'Graduated Year',
    name: 'graduatedYear',
    placeholder: 'Enter your Graduated Year',
    componentType: 'input',
  },
  {
    label: 'LinkedIn Profile',
    name: 'linkedinProfile',
    placeholder: 'Enter your Linkedin Profile',
    componentType: 'input',
  },
  {
    label: 'Github Profile',
    name: 'githubProfile',
    placeholder: 'Enter your Github Profile',
    componentType: 'input',
  },
]

export const initialCandidateFormData: FormData = {
  resume: '',
  name: '',
  currentJobLocation: '',
  preferredJobLocation: '',
  currentSalary: '',
  noticePeriod: '',
  skills: '',
  currentCompany: '',
  previousCompany: '',
  totalExperience: '',
  college: '',
  collegeLocation: '',
  graduatedYear: '',
  linkedinProfile: '',
  githubProfile: '',
}
export const initialCandidateAccountFormData: FormData = {
  name: '',
  currentJobLocation: '',
  preferredJobLocation: '',
  currentSalary: '',
  noticePeriod: '',
  skills: '',
  currentCompany: '',
  previousCompany: '',
  totalExperience: '',
  college: '',
  collegeLocation: '',
  graduatedYear: '',
  linkedinProfile: '',
  githubProfile: '',
}

export const postNewJobFormControls: OnboardFormControl[] = [
  {
    label: 'Company Name',
    name: 'companyName',
    placeholder: 'Company Name',
    componentType: 'input',
  },
  {
    label: 'Title',
    name: 'title',
    placeholder: 'Job Title',
    componentType: 'input',
  },
  {
    label: 'Type',
    name: 'type',
    placeholder: 'Job Type',
    componentType: 'input',
  },
  {
    label: 'Location',
    name: 'location',
    placeholder: 'Job Location',
    componentType: 'input',
  },
  {
    label: 'Experience',
    name: 'experience',
    placeholder: 'Job Experience',
    componentType: 'input',
  },
  {
    label: 'Description',
    name: 'description',
    placeholder: 'Job Description',
    componentType: 'input',
  },
  {
    label: 'Skills',
    name: 'skills',
    placeholder: 'Job Skills',
    componentType: 'input',
  },
  {
    label: 'Name',
    name: 'name',
    placeholder: 'Recruiter Name',
    componentType: 'input',
  },
]

export const initialPostNewJobFormData: postNewJobFormType = {
  companyName: '',
  title: '',
  type: '',
  experience: '',
  description: '',
  skills: '',
  location: '',
  name: '',
}

// filter menus

export const filterMenuDataArray = [
  {
    id: 'companyName',
    label: 'Company Name',
  },
  {
    id: 'title',
    label: 'Title',
  },
  {
    id: 'type',
    label: 'Type',
  },
  {
    id: 'location',
    label: 'Location',
  },
]

//Adding the search params using qs to the search bar whenever user selects a filter in the list of jobs
export function formUrlQuery({ params, dataToAdd }: any) {
  let currentUrl = qs.parse(params)

  if (Object.keys(dataToAdd).length > 0) {
    Object.keys(dataToAdd).map((key) => {
      if (dataToAdd[key].length === 0) delete currentUrl[key]
      else currentUrl[key] = dataToAdd[key].join(',')
    })
  }

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    {
      skipNull: true,
    }
  )
}

export const membershipPlans = [
  {
    heading: 'Tier 1',
    price: 100,
    type: 'basic',
  },
  {
    heading: 'Tier 2',
    price: 1000,
    type: 'teams',
  },
  {
    heading: 'Tier 3',
    price: 5000,
    type: 'enterprise',
  },
]
