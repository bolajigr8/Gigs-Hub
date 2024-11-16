import mongoose, { connection } from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  )
}

const connect = async () => {
  const connectionState = mongoose.connection.readyState

  if (connectionState === 1) {
    console.log('already connected')
    return
  }
  if (connectionState === 2) {
    console.log('connecting...')
    return
  }

  try {
    // mongoose.connect(MONGODB_URI!, {
    //   dbName: 'board-data',
    //   bufferCommands: true,
    // })
    await mongoose.connect(MONGODB_URI!, {
      dbName: 'board-data',
    })
    console.log('CONNECTED')
  } catch (error) {
    console.log('ERROR IN CONNNECTINF TO DB: ', error)
    throw new Error('ERROR IN CONNNECTINF TO DB DB ')
  }
}

export default connect
