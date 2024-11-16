'use client'
import React, { useEffect, useState } from 'react'
import PostNewJob from '../post-new-job'
import RecruiterJobCard from '../recruiter-job-card'
import CandidateJobCard from '../candidate-job-card'
import { filterMenuDataArray, formUrlQuery } from '@/utils'
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
} from '../ui/menubar'
import { Label } from '../ui/label'
import { FilterMenu, FilterParamsType } from '@/types'
import { useRouter, useSearchParams } from 'next/navigation'

const JobListing = ({
  user,
  profileInfo,
  jobsList,
  jobApplications,
  filterCategories,
}: any) => {
  // Filter Params state
  const [filterParams, setFilterParams] = useState<FilterParamsType>({})
  // search params
  const searchParams = useSearchParams()

  // router
  const router = useRouter()

  // filter FUnctionality
  const handleFilter = (
    getSectionId: string,
    getCurrentOption: string
  ): void => {
    // Copy the current filterParams state to a new object
    const copyfilterParams: FilterParamsType = { ...filterParams }

    // Ensure section exists in filterParams
    if (!copyfilterParams[getSectionId]) {
      // If it doesn't exist, create a new array for the section
      copyfilterParams[getSectionId] = [getCurrentOption]
    } else {
      // Check if the option is already selected
      const indexOfCurrentOption =
        copyfilterParams[getSectionId].indexOf(getCurrentOption)

      if (indexOfCurrentOption === -1) {
        // If the option is not selected, add it to the array
        copyfilterParams[getSectionId].push(getCurrentOption)
      } else {
        // If the option is already selected, remove it from the array
        copyfilterParams[getSectionId] = copyfilterParams[getSectionId].filter(
          (option) => option !== getCurrentOption
        )
      }
    }

    // Update the state with the new filterParams
    setFilterParams(copyfilterParams)

    // Store the updated filterParams in sessionStorage
    sessionStorage.setItem('filterParams', JSON.stringify(copyfilterParams))

    // Debugging: log the updated filterParams
    // console.log('Updated filterParams:', copyfilterParams)
  }

  // filter Menus
  const filterMenus: FilterMenu[] = filterMenuDataArray.map((item: any) => ({
    id: item.id,
    name: item.label,
    options: Array.from(
      new Set(filterCategories.map((listItem: any) => listItem[item.id]))
    ),
  }))

  // useEffect for triggering re-render and saving to local storage and getting back from local storage

  useEffect(() => {
    const savedFilterParams = sessionStorage.getItem('filterParams')
    if (savedFilterParams) {
      setFilterParams(JSON.parse(savedFilterParams))
    }
  }, [])

  // useEffect for search bar
  useEffect(() => {
    if (filterParams && Object.keys(filterParams).length > 0) {
      let url = ''
      url = formUrlQuery({
        params: searchParams.toString,
        dataToAdd: filterParams,
      })
      router.push(url, { scroll: false })
    }
  }, [filterParams, searchParams])

  return (
    <div className='mx-auto max-w-7xl'>
      <div className='flex items-baseline justify-between border-b border-gray-200 pb-6 pt-24 '>
        <h1 className='text-4xl font-bold tracking-tight dark:text-white text-gray-900 '>
          {profileInfo.role === 'candidate'
            ? 'Explore All Jobs'
            : 'Jobs Dashboard'}
        </h1>
        <div className='flex items-center'>
          {profileInfo.role === 'candidate' ? (
            // filter

            <Menubar>
              {filterMenus.map((filterMenu) => (
                <MenubarMenu key={filterMenu.id}>
                  {' '}
                  {/* Add key prop to MenubarMenu */}
                  <MenubarTrigger>{filterMenu.name}</MenubarTrigger>
                  <MenubarContent>
                    {filterMenu.options.map(
                      (option: string, optionIdx: number) => (
                        <MenubarItem
                          onClick={() => handleFilter(filterMenu.id, option)} // Accessing id here correctly
                          key={optionIdx}
                          className='flex items-center'
                        >
                          <div
                            className={`h-4 w-4 border rounded border-gray-900  dark:border-gray-200  ${
                              filterParams &&
                              Object.keys(filterParams).length > 0 &&
                              filterParams[filterMenu.id] &&
                              filterParams[filterMenu.id].indexOf(option) > -1
                                ? 'bg-black dark:bg-gray-200 dark:text-gray-200'
                                : ''
                            }`}
                          />
                          <Label className='ml-3 cursor-pointer text-sm text-gray-600'>
                            {option}
                          </Label>
                        </MenubarItem>
                      )
                    )}
                  </MenubarContent>
                </MenubarMenu>
              ))}
            </Menubar>
          ) : (
            <PostNewJob
              jobsList={jobsList}
              user={user}
              profileInfo={profileInfo}
            />
          )}
        </div>
      </div>

      {/* listing the jobs here */}
      <div className='pt-6 pb-24'>
        <article className='grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-3'>
          <div className='lg:col-span-4'>
            <div className='container p-0 mx-auto space-y-8'>
              <article className='grid grid-cols-1 gap-x-4 gap-y-8 md:grid-cols-2 lg:grid-cols-3'>
                {jobsList && jobsList.length > 0 ? (
                  jobsList.map((jobItem: any) =>
                    profileInfo?.role === 'candidate' ? (
                      <CandidateJobCard
                        key={jobItem}
                        jobItem={jobItem}
                        profileInfo={profileInfo}
                        jobApplications={jobApplications}
                      />
                    ) : (
                      <RecruiterJobCard
                        key={jobItem}
                        jobItem={jobItem}
                        profileInfo={profileInfo}
                        jobApplications={jobApplications}
                      />
                    )
                  )
                ) : (
                  <p>No jobs uploaded yet </p>
                )}
              </article>
            </div>
          </div>
        </article>
      </div>
    </div>
  )
}

export default JobListing
