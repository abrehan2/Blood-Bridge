import React from 'react'
import shadow from '@/app/components/shadow.module.css'
import BloodGroupForm from '@/app/(HeaderFooterLayout)/profile/components/BloodGroupForm'

const page = () => {
  return (
    <div className={`w-full bg-stone-200 pl-[5%] pr-[10%] pt-8 relative ${shadow.bloodBankNavHeight}`}>
      <p className='font-LatoBold mb-[1.125rem] text-2xl text-slate-900'>Create Blood Types</p>
      <div className='w-full flex justify-between'>
        <div className='w-full'>
          <BloodGroupForm />
        </div>
      </div>
    </div>
  )
}

export default page