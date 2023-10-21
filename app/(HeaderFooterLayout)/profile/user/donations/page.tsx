import React from 'react'
import UserDonationsMain from '@/app/(HeaderFooterLayout)/profile/components/UserDonationsMain'

const page = () => {
  return (
    <div className='w-full bg-[#F8F6F6] py-6 mb-4 rounded-[33px]'>
      <div className='w-full px-8'>
        <div className='flex flex-col justify-between w-full relative'>
          <h3 className='text-black font-RobotoBold text-xl mb-4 capitalize'>Blood Donations</h3>
          <UserDonationsMain />
        </div>
      </div>
    </div>
  )
}

export default page