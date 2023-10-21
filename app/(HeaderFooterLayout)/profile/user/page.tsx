import React from 'react'
import profile from '@/app/(HeaderFooterLayout)/profile/components/profile.module.css'

const page = () => {
  return (
    <div className={`w-full grid place-items-center ${profile.mainProfileHeight}`}>
        <p className='text-black font-LateefMedium text-4xl'>Welcome to Your Dashboard</p>
    </div>
  )
}

export default page