import React from 'react'
import Image from 'next/image'
import bgAuthBack from '@/assets/bgAuthBack.png'
import bgAuthFront from '@/assets/bgAuthFront.png'
import Logo from '@/assets/Logo.png'
import bgHands from '@/assets/bgHands.png'
import Link from 'next/link'

const layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className='w-full min-h-screen relative overflow-hidden'>
            <div className='w-full absolute -top-40 left-0'>
                <Image className='w-full object-cover absolute left-0 top-0 z-[1]' src={bgAuthFront} alt='Background' />
                <Image className='w-full object-cover absolute left-0 top-6 -z-[1]' src={bgAuthBack} alt='Background' />
            </div>
            <div className='w-full min-h-screen relative z-[2] pt-10'>
                <div className='w-[86%] flex items-center justify-between mx-auto'>
                    <Link href='/'>
                        <div className='flex items-center'>
                            <div className='w-[42px] h-[42px]'>
                                <Image className='w-full h-full object-contain' src={Logo} alt='Logo' />
                            </div>
                            <p className={`w-min text-white text-sm md:text-base font-black font-LatoBold uppercase tracking-[3px] !leading-[18px]`}>Blood Bank</p>
                        </div>
                    </Link>
                    <p className='text-white text-sm md:text-base font-black font-LatoBold uppercase tracking-[3px]'>Create New Account</p>
                    <p className='text-white text-sm md:text-base font-black font-LatoBold uppercase tracking-[3px]'>Contact Us</p>
                </div>
                <div className='w-[86%] mx-auto pb-7'>
                    {children}
                </div>
                <div className='w-80 absolute left-0 bottom-0'>
                    <Image className='w-full object-contain' src={bgHands} alt='Logo' />
                </div>
            </div>
        </div>
    )
}

export default layout