// Re-Usabled Form Component

import { Button } from '../ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  ButtonType,
  FormData,
  OnboardFormControl,
  postNewJobFormType,
} from '@/types'

interface CommonFormProps {
  action: any
  btnText: string
  isBtnDisabled?: boolean
  btnType: ButtonType
  formControls: OnboardFormControl[]
  formData: FormData
  setFormData: any
  handleFileChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export function CommonForm({
  action,
  btnText,
  isBtnDisabled,
  btnType,
  formControls,
  formData,
  setFormData,
  handleFileChange,
}: CommonFormProps) {
  const renderInputByComponentType = (
    getCurrentControl: OnboardFormControl
  ) => {
    let content = null

    switch (getCurrentControl.componentType) {
      case 'input':
        content = (
          <div className='relative flex items-center mt-8'>
            <Input
              type='text'
              disabled={getCurrentControl.disabled}
              placeholder={getCurrentControl.placeholder}
              name={getCurrentControl.name}
              id={getCurrentControl.name}
              value={String(
                formData[getCurrentControl.name as keyof FormData] ?? ''
              )}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  [e.target.name]: e.target.value,
                })
              }
              className='w-full h-[60px] px-4 border rounded-md  dark:bg-black bg-gray-100 text-lg outline-none drop-shadow-sm transition-all duration-200 ease-in-out focus:bg-white focus:drop-shadow-lg focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0'
            />
          </div>
        )

        break

      case 'file':
        content = (
          <Label
            htmlFor={getCurrentControl.name}
            className='flex bg-gray-100 dark:bg-black items-center px-3 py-3 mx-auto mt-6 text-center border-2 border-dashed rounded-lg cursor-pointer'
          >
            <h2>{getCurrentControl.label}</h2>
            <Input
              id={getCurrentControl.name}
              type='file'
              onChange={handleFileChange}
            />
          </Label>
        )

        break

      // we can give multiple cases for textarea, radiobutton, checkbox and so on,

      default:
        content = (
          <div className='   relative flex items-center mt-8'>
            <Input
              type='text'
              disabled={getCurrentControl.disabled}
              placeholder={getCurrentControl.placeholder}
              name={getCurrentControl.name}
              id={getCurrentControl.name}
              // value={formData[getCurrentControl.name]}
              value={String(
                formData[getCurrentControl.name as keyof FormData] ?? ''
              )}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  [e.target.name]: e.target.value,
                })
              }
              className='w-full h-[60px] px-4 border rounded-md dark:bg-black bg-gray-100 text-lg outline-none drop-shadow-sm transition-all duration-200 ease-in-out focus:bg-white focus:drop-shadow-lg focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0'
            />
          </div>
        )

        break
    }
    return content
  }

  return (
    <form onSubmit={action}>
      {formControls.map((control, index) => (
        <div key={index}>{renderInputByComponentType(control)}</div>
      ))}
      <div className='mt-6 w-full'>
        <Button
          disabled={isBtnDisabled}
          type={btnType || 'submit'}
          className='disabled:opacity-60 dark:bg-blue-700  dark:text-gray-200 flex items-center justify-center px-5 '
        >
          {btnText}
        </Button>
      </div>
    </form>
  )
}
