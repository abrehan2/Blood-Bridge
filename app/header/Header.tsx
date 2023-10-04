import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import redLogo from '@/assets/redLogo.png'
import MapIcon from '@/globals/icons/map-icon'
import { Button } from '@/components/ui/button'
import Navbar from '@/app/header/components/Navbar'

const Header = () => {
    return (
        <div className='w-full pl-[6%] pr-[3%] flex justify-between mt-5'>
            <Link href='/'>
                <div className='flex items-center'>
                    <div className='w-12 h-12'>
                        <Image className='w-full h-full object-contain' src={redLogo} alt='Logo' />
                    </div>
                    <p className={`w-min text-red-700 text-sm md:text-base font-black font-LatoBold uppercase tracking-[3px] !leading-[18px]`}>Blood Bank</p>
                </div>
            </Link>
            <div className='flex flex-col items-end gap-y-2.5'>
                <div className='flex items-center'>
                    <div className='flex items-center gap-x-1.5'>
                        <MapIcon svgClass='w-5 h-5' />
                        <p className='text-zinc-500 text-sm font-LatoRegular uppercase tracking-[2px]'>
                            locate
                        </p>
                    </div>
                    <div className='border-r-2 border-zinc-500 h-3 mx-2' />
                    <Button className='!bg-red-700 !bg-opacity-70 !py-0 !px-1 !rounded-[3px] !h-auto text-sm font-LatoRegular uppercase tracking-[2px]'>Donate</Button>
                    <div className='border-r-2 border-zinc-500 h-3 mx-2' />
                    <Button className='!bg-red-700 !bg-opacity-70 !py-0 !px-1 !rounded-[3px] !h-auto text-sm font-LatoRegular uppercase tracking-[2px]'>Request</Button>
                    <div className='border-r-2 border-zinc-500 h-3 mx-2' />
                    <Link href={'/auth/signIn'}>
                        <Button variant={'ghost'} className='!py-0 !px-1 !rounded-[3px] !h-auto text-sm font-LatoRegular uppercase tracking-[2px] !text-zinc-500'>Login</Button>
                    </Link>
                </div>
                <Navbar />
            </div>
        </div>
    )
}

export default Header