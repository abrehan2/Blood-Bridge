"use client"
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import redLogo from '@/assets/redLogo.png'
import Navbar from '@/app/header/components/Navbar'
import MainLinks from '@/app/header/components/MainLinks'
import { X, Menu } from 'lucide-react'
import cx from 'classnames'
import { useBBSelector } from '@/redux/store'
import ClientOnly from '@/app/components/ClientOnly'
import shadow from '@/app/components/shadow.module.css'
import { usePathname } from 'next/navigation'

const Header = () => {
    const pathname = usePathname()
    const [showNavbar, setShowNavbar] = useState<boolean>(false)
    const user = useBBSelector(state => state.authReducer.value.user)
    const isLoading = useBBSelector(state => state.authReducer.value.isLoading)

    useEffect(() => {
    }, [isLoading])

    return (
        <ClientOnly>
            {isLoading ?
                <div className='h-[64px] flex items-center'>
                    <div className='w-10 h-10 border-t-2 border-zinc-500 rounded-full animate-spin' />
                </div>
                : <>
                    <div className={cx('relative w-full pl-[6%] pr-[3%] flex items-center justify-between pt-2 lg:pt-5', { '!pt-0 lg:!pt-0 !pl-0 !pr-0': user?.role === 'bloodBank' })}>
                        <Link className={cx({'bg-white w-[164px] py-2': user?.role === 'bloodBank' }, { [shadow.lightShadow]: pathname.startsWith('/profile/bloodBank/') })} href='/'>
                            <div className={cx('w-full flex items-center', { 'justify-center': user?.role === 'bloodBank' })}>
                                <div className='w-10 lg:w-12 h-10 lg:h-12'>
                                    <Image className='min-w-[2.5rem] w-full h-full object-contain' src={redLogo} alt='Logo' />
                                </div>
                                <p className={`w-min text-red-700 text-sm md:text-base font-black font-LatoBold uppercase tracking-[3px] !leading-[18px]`}>Blood Bridge</p>
                            </div>
                        </Link>
                        {user?.role !== 'bloodBank' &&
                            <>
                                <div className='lg:hidden'>
                                    <div className='w-10 h-10 rounded-full flex justify-center items-center cursor-pointer' onClick={() => setShowNavbar(true)}>
                                        <Menu />
                                    </div>
                                    <div className={cx('absolute top-0 right-0 w-[60vw] sm:w-[50vw] md:w-[40vw] bg-white shadow-lg z-[6] min-h-screen animate-right-to-left', { '!hidden !animate-left-to-right': !showNavbar })}>
                                        <X className='absolute right-2 top-2 cursor-pointer' onClick={() => setShowNavbar(false)} />
                                        <div className='w-full pt-10'>
                                            <Navbar isMbl={true} />
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
                            </>}
                        {user?.role === 'bloodBank' &&
                            <div className='pr-[2%]'>
                                <MainLinks />
                            </div>
                        }
                    </div>
                </>}
        </ClientOnly>
    )
}

export default Header