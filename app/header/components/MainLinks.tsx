"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useBBSelector } from '@/redux/store'
import Link from 'next/link'
import { axiosInstance as axios } from '@/app/axios-api/axios'
import React from 'react'
import { logOutUserUrl } from '@/app/axios-api/Endpoint'
import { logOut } from '@/redux/features/authSlice'
import { useDispatch } from 'react-redux'
import toast from 'react-hot-toast'
import ClientOnly from '@/app/components/ClientOnly'
import { BellDot, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import cx from 'classnames'
import mapIcon from '@/assets/MapIcon.png'
import Image from 'next/image'
import shadow from '@/app/components/shadow.module.css'
import LogoutIcon from '@/globals/icons/logout'

const MainLinks = () => {
    const dispatch = useDispatch();
    const { push } = useRouter();
    const [showDropdown, setShowDropdown] = useState<boolean>(false)

    const handleLogout = () => {
        const url = logOutUserUrl();

        axios.get(url, {
            withCredentials: true,
        }).then((res) => {
            dispatch(logOut())
            push("/")
            toast.success(res.data.message);
        }).catch((err) => {
            toast.error(err!.response!.data!.message!);
        })
    }

    const isAuth = useBBSelector(state => state.authReducer.value.isAuth)
    const isLoading = useBBSelector(state => state.authReducer.value.isLoading)
    const user = useBBSelector(state => state.authReducer.value.user)

    const handleProfile = () => {
        if (user.role === 'bloodBank') {
            push('/profile/bloodBank/settings/management')
        }
        else {
            push('/profile/user/donations')
        }
        setShowDropdown(false)
    }

    return (
        <div className={cx('flex items-center justify-center', {'!gap-x-1.5': user?.role === 'bloodBank'})}>
            {user?.role !== 'bloodBank' && <>
                <Button variant={'ghost'} className='!py-0 !px-1 !rounded-[3px] !h-auto flex items-center gap-x-1.5'>
                    <Image className='!w-5 !h-5 object-contain' src={mapIcon} alt="Map Icon" />
                    <p className='text-zinc-500 text-xs sm:text-sm font-LatoRegular uppercase tracking-[2px]'>
                        locate
                    </p>
                </Button>
                <div className='border-r-2 border-zinc-500 h-3 mx-2' />
                <Button className='!bg-red-700 !bg-opacity-70 !py-0 !px-1 !rounded-[3px] !h-auto text-xs sm:text-sm font-LatoRegular uppercase tracking-[2px]'>Donate</Button>
                <div className='border-r-2 border-zinc-500 h-3 mx-2' />
                <Button className='!bg-red-700 !bg-opacity-70 !py-0 !px-1 !rounded-[3px] !h-auto text-xs sm:text-sm font-LatoRegular uppercase tracking-[2px]'>Request</Button>
                <div className='border-r-2 border-zinc-500 h-3 mx-2' />
            </>}
            {user?.role === 'bloodBank' &&
                <div className='flex items-center gap-x-0.5'>
                    <div className='w-7 h-7 cursor-pointer' onClick={handleLogout}>
                        <LogoutIcon svgClass='w-full h-full' />
                    </div>
                    <div className='cursor-pointer'>
                        <BellDot color="#ba5456" strokeWidth={1.4} size={24} />
                    </div>
                </div>
            }
            <ClientOnly>
                {isLoading ? <div className='w-5 h-5 border-t-2 border-zinc-500 rounded-full animate-spin' /> : <>
                    {!isAuth ? <>
                        <Link href={'/auth/signIn'}>
                            <Button variant={'ghost'} className='!py-0 !px-1 !rounded-[3px] !h-auto text-xs sm:text-sm font-LatoRegular uppercase tracking-[2px] !text-zinc-500'>Login</Button>
                        </Link>
                    </> :
                        <div className='relative'>
                            <div className='flex items-center gap-x-1.5'>
                                <p className={cx('text-black font-RobotoBold tracking-[2.75px] uppercase', { '!font-LatoMedium !capitalize !tracking-normal': user.role === 'bloodBank' })}>{user?.role === "user" ? user.firstName.split(' ')[0] : user.name}</p>
                                <div className={cx('w-5 h-5 cursor-pointer', { '!w-7 !h-7': user?.role === 'bloodBank' })} onClick={user?.role === 'bloodBank' ? handleProfile : () => setShowDropdown(!showDropdown)}>
                                    {user?.role === 'bloodBank' ? <>
                                        <Image src={user.avatar} alt="Profile" className='!w-full !h-full object-cover rounded-full' width={20} height={20}/>
                                    </> : <>
                                        {user?.avatar?.url ?
                                            <>
                                                <Image src={user?.avatar} alt="Profile" className='!w-full !h-full object-cover rounded-full' width={20} height={20} />
                                            </> :
                                            <User className='w-full h-full text-zinc-500' />
                                        }
                                    </>
                                    }
                                </div>
                            </div>
                            <div className={cx(`rounded-[14px] py-2 bg-white min-w-[200px] absolute top-7 right-0 flex flex-col gap-y-1.5 overflow-hidden`, { '!hidden': !showDropdown }, [shadow.lightShadow])}>
                                <Button onClick={handleProfile} variant={'ghost'} className='!py-1 !px-1 !rounded-[3px] !h-auto text-xs sm:text-sm font-LatoRegular uppercase tracking-[2px] !text-zinc-500'>Profile</Button>
                                <Button variant={'ghost'} className='!py-1 !px-1 !rounded-[3px] !h-auto text-xs sm:text-sm font-LatoRegular uppercase tracking-[2px] !text-zinc-500' onClick={handleLogout}>LogOut</Button>
                            </div>
                        </div>
                    }
                </>}
            </ClientOnly>
        </div>
    )
}

export default MainLinks