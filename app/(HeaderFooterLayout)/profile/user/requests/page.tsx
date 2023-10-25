import React from 'react'
import UserRequestsMain from '@/app/(HeaderFooterLayout)/profile/components/UserRequestsMain'

const page = () => {
  return (
    <div className='w-full bg-[#F8F6F6] py-6 mb-4 rounded-[33px]'>
      <div className='w-full px-8'>
        <UserRequestsMain />
      </div>
    </div>
  )
}

export default page