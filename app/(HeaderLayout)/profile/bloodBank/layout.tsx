import React from 'react'
import shadow from '@/app/components/shadow.module.css'
import BloodBankNavigation from '@/app/(HeaderFooterLayout)/profile/components/BloodBankNavigation'

const layout = ({children}: {children: React.ReactNode}) => {
  return (
    <div className='w-full flex'>
        <div className={`relative z-[5] min-w-[164px] bg-white border-t border-black ${shadow.lightShadow} ${shadow.bloodBankNavHeight}`}>
            <BloodBankNavigation />
        </div>
        <div className={`w-[90%] ${shadow.bloodBankNavHeight} overflow-y-scroll`}>
            {children}
        </div>
    </div>
  )
}

export default layout