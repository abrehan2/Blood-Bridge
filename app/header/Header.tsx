"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import redLogo from '@/assets/redLogo.png'
import Navbar from '@/app/header/components/Navbar'
import MainLinks from '@/app/header/components/MainLinks'
import { X, Menu } from 'lucide-react'
import cx from 'classnames'

const Header = () => {
    const [showNavbar, setShowNavbar] = useState<boolean>(false)
    return (
        <div className='relative w-full pl-[6%] pr-[3%] flex justify-between pt-2 lg:pt-5'>
            <Link href='/'>
                <div className='flex items-center'>
                    <div className='w-10 lg:w-12 h-10 lg:h-12'>
                        <Image className='w-full h-full object-contain' src={redLogo} alt='Logo' />
                    </div>
                    <p className={`w-min text-red-700 text-sm md:text-base font-black font-LatoBold uppercase tracking-[3px] !leading-[18px]`}>Blood Bank</p>
                </div>
            </Link>
            <div className='lg:hidden'>
                <div className='w-10 h-10 rounded-full flex justify-center items-center cursor-pointer' onClick={() => setShowNavbar(true)}>
                    <Menu />
                </div>
                <div className={cx('absolute top-0 right-0 w-[60vw] sm:w-[50vw] md:w-[40vw] bg-white shadow-lg z-[6] min-h-screen animate-right-to-left', {'!hidden !animate-left-to-right': !showNavbar})}>
                    <X className='absolute right-2 top-2 cursor-pointer' onClick={() => setShowNavbar(false)}/>
                    <div className='w-full pt-10'>
                        <Navbar isMbl={true}/>
                    </div>
                </div>
            </div>
            <div className='absolute left-0 right-0 mx-auto top-[56px] lg:hidden'>
                <MainLinks />
            </div>
            <div className='lg:flex flex-col items-end gap-y-2.5 hidden'>
                <MainLinks />
                <Navbar />
            </div>
        </div>
    )
}

export default Header