import React from 'react'

const RecentEvent = () => {
    const eventMessage = "Join Us on August 10th at 12 PM to Celebrate the Lifesaving Importance of Blood Donation!";
  return (
    <div className='w-full bg-red-700 bg-opacity-70 mt-8 mb-12'>
        <p className='capitalize py-0.5 font-RobotoRegular tracking-[4px] text-[10px] md:text-xs lg:text-sm text-white text-center slide-in-from-right-10'>"{eventMessage}"</p>
    </div>
  )
}

export default RecentEvent