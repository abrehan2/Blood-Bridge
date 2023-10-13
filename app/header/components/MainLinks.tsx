"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import MapIcon from '@/globals/icons/map-icon'
import { useBBSelector } from '@/redux/store'
import Link from 'next/link'
import { axiosInstance as axios } from '@/app/axios-api/axios'
import React from 'react'
import { logOutUserUrl } from '@/app/axios-api/Endpoint'
import { logOut } from '@/redux/features/authSlice'
import { useDispatch } from 'react-redux'
import toast from 'react-hot-toast'
import ClientOnly from '@/app/components/ClientOnly'
import { User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import cx from 'classnames'
import shadow from '@/app/components/shadow.module.css'

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
            toast.success(res.data.message);
            push("/")
        }).catch((err) => {
            toast.error(err!.response!.data!.message!);
        })
    }

    const handleProfile = () => {
        push('/user/profile')
    }

    const isAuth = useBBSelector(state => state.authReducer.value.isAuth)
    const isLoading = useBBSelector(state => state.authReducer.value.isLoading)
    return (
        <div className='flex items-center justify-center'>
            <Button variant={'ghost'} className='!py-0 !px-1 !rounded-[3px] !h-auto flex items-center gap-x-1.5'>
                <MapIcon svgClass='w-5 h-5' />
                <p className='text-zinc-500 text-xs sm:text-sm font-LatoRegular uppercase tracking-[2px]'>
                    locate
                </p>
            </Button>
            <div className='border-r-2 border-zinc-500 h-3 mx-2' />
            <Button className='!bg-red-700 !bg-opacity-70 !py-0 !px-1 !rounded-[3px] !h-auto text-xs sm:text-sm font-LatoRegular uppercase tracking-[2px]'>Donate</Button>
            <div className='border-r-2 border-zinc-500 h-3 mx-2' />
            <Button className='!bg-red-700 !bg-opacity-70 !py-0 !px-1 !rounded-[3px] !h-auto text-xs sm:text-sm font-LatoRegular uppercase tracking-[2px]'>Request</Button>
            <div className='border-r-2 border-zinc-500 h-3 mx-2' />
            <ClientOnly>
                {isLoading ? <div className='w-5 h-5 border-t-2 border-zinc-500 rounded-full animate-spin' /> : <>
                    {!isAuth ? <>
                        <Link href={'/auth/signIn'}>
                            <Button variant={'ghost'} className='!py-0 !px-1 !rounded-[3px] !h-auto text-xs sm:text-sm font-LatoRegular uppercase tracking-[2px] !text-zinc-500'>Login</Button>
                        </Link>
                    </> :
                        <div className='relative'>
                            <div className='w-5 h-5 cursor-pointer' onClick={() => setShowDropdown(!showDropdown)}>
                                <User className='w-full h-full text-zinc-500' />
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