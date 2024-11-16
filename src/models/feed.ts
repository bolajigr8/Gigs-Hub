import mongoose from 'mongoose'

const FeedSchema = new mongoose.Schema({
  userId: String,
  username: String,
  message: String,
  image: String,
  likes: [
    {
      reactorUserId: String,
      reactorUserName: String,
    },
  ],
})

const Feed = mongoose.models.Feed || mongoose.model('Feed', FeedSchema)

export default Feed
