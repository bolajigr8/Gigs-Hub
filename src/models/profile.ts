// Here we'll manage for both candidate and recruiter

import mongoose from 'mongoose'

const ProfileSchema = new mongoose.Schema({
  // logged in user id coming from clerk
  userId: String,
  role: String,
  email: String,
  isPremiumUser: Boolean,
  memberShipType: String,
  memberShipStartDate: String,
  memberShipEndDate: String,
  recruiterInfo: {
    name: String,
    companyName: String,
    companyRole: String,
  },
  candidateInfo: {
    name: String,
    resume: String,

    currentJobLocation: String,
    preferredJobLocation: String,
    currentSalary: String,
    noticePeriod: String,
    skills: String,
    currentCompany: String,
    previousCompany: String,
    totalExperience: String,
    college: String,
    collegeLocation: String,
    graduatedYear: String,
    linkedinProfile: String,
    githubProfile: String,
  },
})

const Profile =
  mongoose.models.Profile || mongoose.model('Profile', ProfileSchema)

export default Profile
