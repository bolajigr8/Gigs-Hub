import { fetchAllFeedPostAction, fetchProfileAction } from '@/actions'
import Feed from '@/components/feed'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

const FeedPage = async () => {
  const user = await currentUser()
  const profileInfo = await fetchProfileAction(user?.id)

  if (!profileInfo) redirect('/onboard')

  const allFeedPosts = await fetchAllFeedPostAction()

  return (
    <Feed
      allFeedPosts={allFeedPosts}
      user={JSON.parse(JSON.stringify(user))}
      profileInfo={profileInfo}
    />
  )
}

export default FeedPage
