import React from 'react'
import UserFeedbackForm from '@/app/(HeaderFooterLayout)/profile/components/UserFeedbackForm'

const page = () => {
  return (
    <div className='w-full bg-[#F8F6F6] pt-6 pb-4 rounded-[33px]'>
      <div className='w-full px-8'>
          <UserFeedbackForm />
      </div> 
    </div>
  )
}

export default page