export interface OnboardFormControl {
  label: string
  name: string
  placeholder?: string
  componentType: 'input' | 'file' | 'textarea'
  disabled?: boolean
}

export interface OnboardFormControlsProps {
  formControls: OnboardFormControl[]
  action: Promise<void>
  btnText: string
  isBtnDisabled: boolean
  btnType: string
}

export interface FormData {
  name: string
  companyName?: string
  companyRole?: string
  isPremiumUser?: boolean
  resume?: string
  currentJobLocation?: string
  preferredJobLocation?: string
  currentSalary?: string
  noticePeriod?: string
  skills?: string
  currentCompany?: string
  previousCompany?: string
  totalExperience?: string
  college?: string
  collegeLocation?: string
  graduatedYear?: string
  linkedinProfile?: string
  githubProfile?: string
}

export type ButtonType = 'button' | 'submit' | 'reset'

export interface postNewJobFormType {
  companyName: string
  title: string
  type: string
  experience: string
  description: string
  skills: string
  location: string
  name: string
}

// filter menus
export type FilterMenu = {
  id: string
  name: string
  options: string[] // or any other type that fits your data
}

//  the type for filterParams - for handle filter function
export type FilterParamsType = {
  [key: string]: string[] // key is a string, and the value is an array of strings
}

export type FilterParamsAction = {
  // [key: string]: string[] // key is a string, and the value is an array of strings
  [key: string]: string | string[]
}
