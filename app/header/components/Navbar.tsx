"use client"
import Link from 'next/link'
import React from 'react'
import { usePathname } from 'next/navigation'
import cx from 'classnames'

const Navbar = ({ isMbl }: {isMbl?: boolean}) => {
    const path = usePathname()

    const isActive = (pathname: string) => {
        return path === pathname
    }

    return (
        <nav className='w-full'>
            <ul className={cx('flex items-center gap-x-3', {'flex-col': isMbl})}>
                <li><Link className={cx('text-zinc-500 font-medium font-LatoMedium uppercase tracking-[2px]', {'!text-red-700 pb-1 border-b border-red-700': isActive('/') && !isMbl}, {'bg-red-700  !text-white': isActive('/') && isMbl}, {'inline-block min-w-[180px] sm:min-w-[240px] !text-center rounded-sm py-1': isMbl}, {'hover:text-red-700': !isActive('/') && isMbl})} href='/'>Home</Link></li>
                <li><Link className={cx('text-zinc-500 font-medium font-LatoMedium uppercase tracking-[2px]', {'!text-red-700 pb-1 border-b border-red-700': isActive('/about-us') && !isMbl}, {'bg-red-700  !text-white': isActive('/about-us') && isMbl}, {'inline-block min-w-[180px] sm:min-w-[240px] !text-center rounded-sm py-1': isMbl}, {'hover:text-red-700': !isActive('/about-us') && isMbl})} href='/about-us'>About Us</Link></li>
                <li><Link className={cx('text-zinc-500 font-medium font-LatoMedium uppercase tracking-[2px]', {'!text-red-700 pb-1 border-b border-red-700': isActive('/blood-banks') && !isMbl}, {'bg-red-700  !text-white': isActive('/blood-banks') && isMbl}, {'inline-block min-w-[180px] sm:min-w-[240px] !text-center rounded-sm py-1': isMbl}, {'hover:text-red-700': !isActive('/blood-banks') && isMbl})} href='/blood-banks'>Blood Banks</Link></li>
                <li><Link className={cx('text-zinc-500 font-medium font-LatoMedium uppercase tracking-[2px]', {'!text-red-700 pb-1 border-b border-red-700': isActive('/event') && !isMbl}, {'!bg-red-700 !text-white': isActive('/event') && isMbl}, {'inline-block min-w-[180px] sm:min-w-[240px] !text-center rounded-sm py-1': isMbl}, {'hover:text-red-700': !isActive('/event') && isMbl})} href='/event'>Event</Link></li>
                <li><Link className={cx('text-zinc-500 font-medium font-LatoMedium uppercase tracking-[2px]', {'!text-red-700 pb-1 border-b border-red-700': isActive('/news') && !isMbl}, {'!bg-red-700  !text-white': isActive('/news') && isMbl}, {'inline-block min-w-[180px] sm:min-w-[240px] !text-center rounded-sm py-1': isMbl}, {'hover:text-red-700': !isActive('/news') && isMbl})} href='/news'>News</Link></li>
                <li><Link className={cx('text-zinc-500 font-medium font-LatoMedium uppercase tracking-[2px]', {'!text-red-700 pb-1 border-b border-red-700': isActive('/reviews') && !isMbl}, {'bg-red-700  !text-white': isActive('/reviews') && isMbl}, {'inline-block min-w-[180px] sm:min-w-[240px] !text-center rounded-sm py-1': isMbl}, {'hover:text-red-700': !isActive('/reviews') && isMbl})} href='/reviews'>Reviews</Link></li>
                <li><Link className={cx('text-zinc-500 font-medium font-LatoMedium uppercase tracking-[2px]', {'!text-red-700 pb-1 border-b border-red-700': isActive('/contact') && !isMbl}, {'bg-red-700  !text-white': isActive('/contact') && isMbl}, {'inline-block min-w-[180px] sm:min-w-[240px] !text-center rounded-sm py-1': isMbl}, {'hover:text-red-700': !isActive('/contact') && isMbl})} href='/contact'>Contact</Link></li>
            </ul>
        </nav>
    )
}

export default Navbar