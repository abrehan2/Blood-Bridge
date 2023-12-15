"use client"

import React from 'react'
import shadow from '@/app/components/shadow.module.css'
import Dashboard from '@/globals/icons/dashboard'
import { CalendarClock, Droplets, ShoppingBag, User } from 'lucide-react'
import { usePathname } from 'next/navigation'
import cx from 'classnames'
import Link from 'next/link'
import Image from 'next/image'
import bloodDonationIcon from '@/assets/bloodDonationIcon.png'
import bloodDonationBlackIcon from '@/assets/bloodDonationBlackIcon.png'
import Settings from '@/globals/icons/settings'
import { Button } from '@/components/ui/button'
import BloodTypeIcon from '@/globals/icons/blood-type-icon'

const BloodBankNavigation = () => {
    const pathname = usePathname()

    const isBBDashboard = pathname.startsWith('/profile/bloodBank/dashboard');
    const isBBUsers = pathname.startsWith('/profile/bloodBank/users');
    const isBBOrders = pathname.startsWith('/profile/bloodBank/requests');
    const isBBEvents = pathname.startsWith('/profile/bloodBank/events');
    const isBBTypesBlood = pathname.startsWith('/profile/bloodBank/types-blood');
    const isBBBlood = pathname.startsWith('/profile/bloodBank/blood');
    const isBBDonation = pathname.startsWith('/profile/bloodBank/donation')
    const isBBSettings = pathname.startsWith('/profile/bloodBank/settings')

    return (
        <div className={`w-full h-full flex flex-col gap-y-4 pt-4 ${shadow.lightShadow}`}>
            <Link href={'/profile/bloodBank/dashboard'}>
                <div className='w-full relative flex items-center gap-x-2 py-2 ps-5'>
                    <div className={cx('hidden absolute top-0 left-0 h-full border-l-[3px] border-bloodBankNavRed', { '!block': isBBDashboard })} />
                    <Dashboard svgClass='w-[22px] h-[22px]' color={isBBDashboard ? '#BF372A' : '#1C1A19'} />
                    <p className={cx('text-[#1C1A19] font-DMSansBold capitalize', { '!text-bloodBankNavRed': isBBDashboard })}>Dashboard</p>
                </div>
            </Link>
            <Link href={'/profile/bloodBank/users'}>
                <div className='w-full relative flex items-center gap-x-2 py-2 ps-5'>
                    <div className={cx('hidden absolute top-0 left-0 h-full border-l-[3px] border-bloodBankNavRed', { '!block': isBBUsers })} />
                    <User size={22} color={isBBUsers ? '#BF372A' : '#1C1A19'} />
                    <p className={cx('text-[#1C1A19] font-DMSansBold capitalize', { '!text-bloodBankNavRed': isBBUsers })}>Users</p>
                </div>
            </Link>
            <Link href={'/profile/bloodBank/requests'}>
                <div className='w-full relative flex items-center gap-x-2 py-2 ps-5'>
                    <div className={cx('hidden absolute top-0 left-0 h-full border-l-[3px] border-bloodBankNavRed', { '!block': isBBOrders })} />
                    <ShoppingBag size={22} color={isBBOrders ? '#BF372A' : '#1C1A19'} />
                    <p className={cx('text-[#1C1A19] font-DMSansBold capitalize', { '!text-bloodBankNavRed': isBBOrders })}>Requests</p>
                </div>
            </Link>
            <Link href={'/profile/bloodBank/events'}>
                <div className='w-full relative flex items-center gap-x-2 py-2 ps-5'>
                    <div className={cx('hidden absolute top-0 left-0 h-full border-l-[3px] border-bloodBankNavRed', { '!block': isBBEvents })} />
                    <CalendarClock size={22} color={isBBEvents ? '#BF372A' : '#1C1A19'} />
                    <p className={cx('text-[#1C1A19] font-DMSansBold capitalize', { '!text-bloodBankNavRed': isBBEvents })}>Events</p>
                </div>
            </Link>
            <Link href={'/profile/bloodBank/blood'}>
                <div className='w-full relative flex items-center gap-x-2 py-2 ps-5'>
                    <div className={cx('hidden absolute top-0 left-0 h-full border-l-[3px] border-bloodBankNavRed', { '!block': isBBBlood })} />
                    <Droplets size={22} color={isBBBlood ? '#BF372A' : '#1C1A19'} />
                    <p className={cx('text-[#1C1A19] font-DMSansBold capitalize', { '!text-bloodBankNavRed': isBBBlood })}>Blood</p>
                </div>
            </Link>
            <Link href={'/profile/bloodBank/donation'}>
                <div className='w-full relative flex items-center gap-x-2 py-2 ps-5'>
                    <div className={cx('hidden absolute top-0 left-0 h-full border-l-[3px] border-bloodBankNavRed', { '!block': isBBDonation })} />
                    <Image className='w-[22px] object-contain' src={isBBDonation ? bloodDonationIcon : bloodDonationBlackIcon} alt='Blood Donations' />
                    <p className={cx('text-[#1C1A19] font-DMSansBold capitalize', { '!text-bloodBankNavRed': isBBDonation })}>Donation</p>
                </div>
            </Link>
            <Link href={'/profile/bloodBank/types-blood'}>
                <div className='w-full relative flex items-center gap-x-1 py-2 ps-5'>
                    <div className={cx('hidden absolute top-0 left-0 h-full border-l-[3px] border-bloodBankNavRed', { '!block': isBBTypesBlood })} />
                    <BloodTypeIcon svgClass='w-[28px] h-[28px]' color={isBBTypesBlood ? '#BF372A' : '#1C1A19'} />
                    <p className={cx('text-[#1C1A19] font-DMSansBold capitalize', { '!text-bloodBankNavRed': isBBTypesBlood })}>Blood Types</p>
                </div>
            </Link>
            <Link href={'/profile/bloodBank/settings/management'}>
                <div className='w-full relative flex items-center gap-x-2 py-2 ps-5'>
                    <div className={cx('hidden absolute top-0 left-0 h-full border-l-[3px] border-bloodBankNavRed', { '!block': isBBSettings })} />
                    <Settings svgClass='w-[22px] h-[22px]' color={isBBSettings ? '#BF372A' : '#1C1A19'} />
                    <p className={cx('text-[#1C1A19] font-DMSansBold capitalize', { '!text-bloodBankNavRed': isBBSettings })}>Settings</p>
                </div>
            </Link>

            <Link href={'/profile/bloodBank/request'}>
                <div className='w-full flex justify-center'>
                    <Button className='!h-auto !font-LatoMedium !text-white !bg-darkRed hover:!bg-red-800 !rounded-[48px] !text-xl !pb-1.5 !pt-1 !px-6 w-max mx-auto'>Request</Button>
                </div>
            </Link>
        </div>
    )
}

export default BloodBankNavigation