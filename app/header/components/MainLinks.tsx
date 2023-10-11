import { Button } from '@/components/ui/button'
import MapIcon from '@/globals/icons/map-icon'
import { useBBSelector } from '@/redux/store'
import Link from 'next/link'
import React from 'react'

const MainLinks = () => {
    const isAuth = useBBSelector(state => state.authReducer.value.isAuth)
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
            {!isAuth ? <>
                <Link href={'/auth/signIn'}>
                    <Button variant={'ghost'} className='!py-0 !px-1 !rounded-[3px] !h-auto text-xs sm:text-sm font-LatoRegular uppercase tracking-[2px] !text-zinc-500'>Login</Button>
                </Link>
            </> : <>
                Logged In
            </>}
        </div>
    )
}

export default MainLinks