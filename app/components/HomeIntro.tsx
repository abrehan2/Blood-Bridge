import React from 'react'
import Image from 'next/image'
import homeIntro from '@/assets/homeIntro.png'
import { Button } from '@/components/ui/button'

const HomeIntro = () => {
  return (
    <div className='w-full flex items-end flex-col-reverse md:flex-row pl-[6%] pr-[3%] mt-12 gap-x-4'>
        <div className='w-full md:w-2/5 flex flex-col gap-y-3.5 mt-5 md:mt-0'>
            <h1 className='text-2xl md:text-4xl capitalize font-PlayfairDisplayMedium italic'>Blood Bridge</h1>
            <p className='text-sm lg:text-base font-LatoRegular text-neutral-800'>Welcome to Blood Bridge, where we bridge the gap between blood donors and those in need. Our platform connects you with people who require blood transfusions and gives you the opportunity to make a life-saving difference. Whether you are a donor or in need, Blood Bridge makes the process simple and convenient. <span className=' uppercase text-blue-700 underline tracking-[3px] text-xs lg:text-sm pl-1'>Learn More</span></p>
            <div className='flex items-center gap-x-3'>
                <Button variant={'outline'} className='!py-1 !pr-0 !h-auto uppercase tracking-[5px] !rounded-full !border-2 !border-red-700 hover:!bg-red-700 hover:!text-white min-w-[100px] md:min-w-[108px] lg:min-w-[120px] font-DMSansMedium focus:!ring-0 text-xs md:text-sm lg:text-base !pl-1'>Request</Button>
                <Button variant={'outline'} className='!py-1 !pr-0 !h-auto uppercase tracking-[5px] !rounded-full !border-2 !border-red-700 hover:!bg-red-700 hover:!text-white min-w-[100px] md:min-w-[108px] lg:min-w-[120px] font-DMSansMedium focus:!ring-0 text-xs md:text-sm lg:text-base !pl-1'>Donate</Button>
            </div>
        </div>
        <div className='w-full md:w-3/5'>
            <Image className='w-full object-cover' src={homeIntro} alt='Home Intro' />
        </div>
    </div>
  )
}

export default HomeIntro