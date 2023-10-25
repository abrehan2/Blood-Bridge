import React from 'react'
import UserInfo from '@/app/(HeaderFooterLayout)/profile/components/UserInfo'

const layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className='w-full pl-[6.5%] pr-[3%] mt-10 flex items-start gap-x-5'>
            <UserInfo />
            <div className='w-[70%]'>
                { children }
            </div>
        </div>
  )
}

export default layout