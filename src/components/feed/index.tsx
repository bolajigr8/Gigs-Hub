'use client'

import { Fragment, useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { Dialog, DialogContent } from '../ui/dialog'
import { Textarea } from '../ui/textarea'
import { Label } from '../ui/label'
import { CirclePlus, Heart } from 'lucide-react'
import { Input } from '../ui/input'
import { createClient } from '@supabase/supabase-js'
import { createFeedPostAction, updateFeedPostAction } from '@/actions'

// types
type User = {
  id: string
}

type ProfileInfo = {
  candidateInfo?: { name: string }
  recruiterInfo?: { name: string }
}

type FeedPost = {
  _id: string
  username: string
  message: string
  image: string
  likes: { reactorUserId: string; reactorUserName: string }[]
}

type FeedProps = {
  user: User | null
  profileInfo: ProfileInfo | null
  allFeedPosts: FeedPost[]
}

// end of types

// supabase client for handleUploadImageToSupabase
const supabaseClient = createClient(
  'https://hgmzxgxgjncrnbgtljwl.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnbXp4Z3hnam5jcm5iZ3RsandsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjkyMzc3MDUsImV4cCI6MjA0NDgxMzcwNX0.ioktoM-6_jIEJH7F8UNOkJwnhjHdegP9u0sRfeEKz-Q'
)

function Feed({ user, profileInfo, allFeedPosts }: FeedProps) {
  // state variables
  const [showPostDialog, setShowPostDialog] = useState(false)
  const [formData, setFormData] = useState<{
    message: string
    imageUrl: string
  }>({
    message: '',
    imageUrl: '',
  })

  const [imageData, setImageData] = useState<File | null>(null)
  const [isImageLoading, setIsImageLoading] = useState(false)

  //end of state variables

  // handleFileOnChange i.e the + icon
  function handleFileOnChange(event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault()
    if (event.target.files && event.target.files[0]) {
      setImageData(event.target.files[0])
    }
  }

  // handleFetchImagePublicUrl

  function handleFetchImagePublicUrl(getData: { path: string }) {
    if (!getData?.path) {
      console.error('Invalid or undefined path provided.')
      setIsImageLoading(false) // Reset loading state
      return
    }

    const { data } = supabaseClient.storage
      .from('Gigs-Hub-Public')
      .getPublicUrl(getData.path)

    if (!data?.publicUrl) {
      console.error('Failed to fetch public URL or public URL is missing.')
      setIsImageLoading(false) // Reset loading state
      return
    }

    setFormData((prev) => ({
      ...prev,
      imageUrl: data.publicUrl,
    }))
    setIsImageLoading(false) // Reset loading state
  }

  // handleSaveFeedPost
  async function handleSaveFeedPost() {
    if (!formData.imageUrl) {
      console.error('Image URL is missing!')
      return
    }

    await createFeedPostAction(
      {
        userId: user?.id || '',
        username:
          profileInfo?.candidateInfo?.name ||
          profileInfo?.recruiterInfo?.name ||
          '',
        message: formData.message,
        image: formData.imageUrl,
        likes: [],
      },
      '/feed'
    )

    setShowPostDialog(false)
    setFormData({ imageUrl: '', message: '' })
  }

  // handleUploadImageToSupabase
  async function handleUploadImageToSupabase() {
    if (!imageData) {
      console.error('No image data provided.')
      return
    }

    try {
      setIsImageLoading(true) // Set loading state

      const sanitizedFileName = imageData.name.replace(/[^a-zA-Z0-9.-]/g, '_')
      const filePath = `public/${sanitizedFileName}`

      const { data, error } = await supabaseClient.storage
        .from('Gigs-Hub-Public')
        .upload(filePath, imageData, {
          cacheControl: '3600',
          upsert: false,
        })

      if (error) {
        console.error('Supabase upload error:', error.message)
        setIsImageLoading(false) // Reset loading state on error
        return
      }

      if (data && data.path) {
        handleFetchImagePublicUrl({ path: data.path })
      } else {
        console.error('Upload successful but no path returned:', data)
      }
    } catch (error) {
      console.error('Unexpected error during upload:', error)
    } finally {
      setIsImageLoading(false) // Reset loading state after completion
    }
  }

  // handleUpdateFeedPostLikes
  async function handleUpdateFeedPostLikes(getCurrentFeedPostItem: {
    _id?: string
    username?: string
    message?: string
    image?: string
    likes: any
  }) {
    let cpyLikesFromCurrentFeedPostItem = [...getCurrentFeedPostItem.likes]
    const index = cpyLikesFromCurrentFeedPostItem.findIndex(
      (likeItem) => likeItem.reactorUserId === user?.id
    )

    if (index === -1)
      cpyLikesFromCurrentFeedPostItem.push({
        reactorUserId: user?.id,
        reactorUserName:
          profileInfo?.candidateInfo?.name || profileInfo?.recruiterInfo?.name,
      })
    else cpyLikesFromCurrentFeedPostItem.splice(index, 1)

    getCurrentFeedPostItem.likes = cpyLikesFromCurrentFeedPostItem
    await updateFeedPostAction(getCurrentFeedPostItem, '/feed')
  }

  useEffect(() => {
    if (imageData) {
      setIsImageLoading(true) // Set loading state on image selection
      handleUploadImageToSupabase()
        .then(() => console.log('Image upload and public URL fetch complete.'))
        .catch((err) => {
          console.error('Error during upload process:', err)
          setIsImageLoading(false) // Reset loading state on error
        })
    }
  }, [imageData])

  return (
    <Fragment>
      <div className='mx-auto max-w-7xl'>
        <div className='flex items-baseline justify-between dark:border-white border-b pb-6 pt-24'>
          <h1 className='dark:text-white text-4xl font-bold tracking-tight text-gray-900'>
            Explore Feed
          </h1>
          <div className='flex items-center'>
            <Button
              onClick={() => setShowPostDialog(true)}
              className='flex h-11 items-center justify-center px-5'
            >
              Add New Post
            </Button>
          </div>
        </div>
        {/* posts */}
        <div className='py-12'>
          <div className='container m-auto p-0 flex flex-col gap-5 dark:text-gray-200 text-gray-700'>
            {allFeedPosts && allFeedPosts.length > 0 ? (
              allFeedPosts.map((feedPostItem: FeedPost) => (
                <div
                  key={feedPostItem?._id}
                  className='group relative -mx-4 p-6 rounded-3xl dark:bg-gray-950  bg-gray-100 hover:bg-white hover:shadow-2xl cursor-auto shadow-2xl shadow-transparent gap-8 md:flex'
                >
                  <div className='sm:w-2/6   rounded-3xl overflow-hidden transition-all duration-500 group-hover:rounded-xl'>
                    <img
                      src={feedPostItem?.image}
                      alt='Post'
                      className='h-80  w-full object-contain rounded-3xl  object-top transition duration-500 group-hover:scale-105'
                    />
                  </div>
                  {/* end of posts */}

                  {/* likes */}
                  <div className='sm:p-2 sm:pl-0 sm:w-4/6'>
                    <span className='mt-4 mb-2 inline-block font-medium dark:text-gray-200 text-gray-500 sm:mt-0'>
                      {feedPostItem?.username}
                    </span>
                    <h3 className='mb-6 text-2xl lg:text-3xl font-bold dark:text-gray-200 text-gray-900'>
                      {feedPostItem?.message}
                    </h3>
                    <div className='flex gap-5'>
                      <Heart
                        size={25}
                        fill={
                          feedPostItem?.likes?.length > 0
                            ? '#000000'
                            : '#ffffff'
                        }
                        className='cursor-pointer'
                        onClick={() => handleUpdateFeedPostLikes(feedPostItem)}
                      />
                      <span className='font-semibold text-xl'>
                        {feedPostItem?.likes?.length}
                      </span>
                    </div>
                  </div>
                  {/* end of likes */}
                </div>
              ))
            ) : (
              <h1>No posts found!</h1>
            )}
          </div>
        </div>
      </div>
      <Dialog
        open={showPostDialog}
        onOpenChange={() => {
          setShowPostDialog(false)
          setFormData({
            message: '',
            imageUrl: '',
          })
        }}
      >
        <DialogContent className='h-[550px]'>
          <Textarea
            name='message'
            value={formData?.message}
            onChange={(event) =>
              setFormData({
                ...formData,
                message: event.target.value,
              })
            }
            placeholder='What do you want to talk about?'
            className='border-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0 h-[200px] text-[28px]'
          />

          <div className='flex gap-5 items-center justify-between'>
            <Label htmlFor='imageUrl'>
              <CirclePlus />
              <Input
                onChange={handleFileOnChange}
                className='hidden'
                id='imageUrl'
                type='file'
              />
            </Label>
            <Button
              onClick={handleSaveFeedPost}
              disabled={
                formData.message === '' ||
                formData.imageUrl === '' ||
                isImageLoading
              }
              className='flex w-40 h-11 items-center justify-center px-5 disabled:opacity-65'
            >
              {isImageLoading ? 'Please Wait...' : 'Post'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Fragment>
  )
}

export default Feed
