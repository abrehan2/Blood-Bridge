import React from 'react'
import shadow from '@/app/components/shadow.module.css'
import DonationStatistics from '@/app/(HeaderFooterLayout)/profile/components/DonationStatistics'

const page = () => {
  return (
    <div className={`w-full bg-stone-50 pl-[2%] pr-[4%] pt-6 relative ${shadow.bloodBankNavHeight}`}>
      <p className='font-DMSansSemiBold mb-4 text-xl text-slate-900 capitalize'>Blood Requests Statistics</p>
      <DonationStatistics />
    </div>
  )
}

export default page