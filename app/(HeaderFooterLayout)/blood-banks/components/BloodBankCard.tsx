"use client"
import React from 'react'
import Image from 'next/image'
import { CalendarDaysIcon, Mail, MapPin, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import shadow from '@/app/components/shadow.module.css'
import cx from 'classnames'

const BloodBankCard = ({ bloodBanks }: { bloodBanks: any[] }) => {

  return (
    <div className='w-4/5 mx-auto grid grid-cols-3 gap-x-14 gap-y-10 py-10'>
      {bloodBanks.map((BB_Data, index) => (
        <div className={`w-full h-[90vh] flex flex-col justify-between px-3 rounded-sm ${shadow.lightShadow}`} key={index}>
          <div className='w-full h-[91%] flex flex-col gap-y-1.5'>
            <div className='w-full h-[45%]'>
              <Image src={BB_Data?.bloodBank?.avatar!} alt='Blood Bank Image' className='!h-full object-contain object-top' width={1000} height={1000} />
            </div>
            <div className='flex flex-col gap-y-1 h-[55%]'>
              <h1 className='font-LatoBold text-black'>{BB_Data?.bloodBank?.name}</h1>
              <div className='flex gap-x-2'>
                <MapPin size={15} className='mt-1' />
                <p className='text-[15x] font-LatoRegular text-black'>{BB_Data?.bloodBank?.address}<br />Sector: {BB_Data?.bloodBank?.sector}</p>
              </div>
              <div className='flex items-center gap-x-2'>
                <Phone size={15} />
                <p className='text-[15x] font-LatoRegular text-black'>{BB_Data?.bloodBank?.contact}</p>
              </div>
              <div className='flex items-center gap-x-2'>
                <Mail size={15} />
                <p className='text-[15x] font-LatoRegular text-black'>{BB_Data?.bloodBank?.email}</p>
              </div>
              <div className='flex items-center gap-x-2'>
                <CalendarDaysIcon size={15} />
                <p className='text-[15x] font-LatoRegular text-black'>24/7</p>
              </div>
              <div className='grid grid-cols-4 gap-y-2 my-2 px-2'>
                {BB_Data?.bloodGroups?.map((BG_Data: any, index: any) => (
                  <div key={index} className={cx('flex flex-col items-center justify-between w-full bg-white py-0.5 border-r border-red-800', {'!border-none': (BB_Data?.bloodGroups / 2 === 0 ? ((index + 1) === BB_Data?.bloodGroups.length || (index + 1) === (BB_Data?.bloodGroups.length / 2)) : ((index + 1) === BB_Data?.bloodGroups.length || (index + 1) === Math.ceil(BB_Data?.bloodGroups.length / 2)))})}>
                    <p className='font-LatoBold text-black text-sm'>{BG_Data.bloodGroup}</p>
                    <p className=' font-LatoRegular text-black text-sm'>{BG_Data.stock}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className='flex items-start gap-x-3 h-[8%]'>
            <Button variant={'outline'} className='!py-0.5 !pr-0 !h-auto uppercase tracking-[5px] !rounded-full !border-2 !border-red-700 hover:!bg-red-700 hover:!text-white min-w-[100px] md:min-w-[108px] lg:min-w-[120px] font-DMSansMedium focus:!ring-0 text-xs md:text-sm lg:text-base !pl-1'>Request</Button>
            <Button variant={'outline'} className='!py-0.5 !pr-0 !h-auto uppercase tracking-[5px] !rounded-full !border-2 !border-red-700 hover:!bg-red-700 hover:!text-white min-w-[100px] md:min-w-[108px] lg:min-w-[120px] font-DMSansMedium focus:!ring-0 text-xs md:text-sm lg:text-base !pl-1'>Donate</Button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default BloodBankCard