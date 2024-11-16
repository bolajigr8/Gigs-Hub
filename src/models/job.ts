// Here we'll manage for both candidate and recruiter

import mongoose from 'mongoose'

const JobSchema = new mongoose.Schema({
  companyName: String,
  title: String,
  type: String,
  experience: String,
  description: String,
  skills: String,
  location: String,
  name: String,
  recruiterId: String,
  applicants: [
    {
      name: String,
      email: String,
      userId: String,
      status: String,
    },
  ],
})

const Job = mongoose.models.Job || mongoose.model('Job', JobSchema)

export default Job
