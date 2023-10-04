"use client"
import Link from 'next/link'
import React from 'react'
import { usePathname } from 'next/navigation'
import cx from 'classnames'

const Navbar = () => {
    const path = usePathname()

    const isActive = (pathname: string) => {
        return path === pathname
    }

    return (
        <nav className='w-full'>
            <ul className='flex items-center gap-x-3'>
                <li><Link className={cx('text-zinc-500 font-medium font-LatoMedium uppercase tracking-[2px]', {'!text-red-700 pb-1 border-b border-red-700': isActive('/')})} href='/'>Home</Link></li>
                <li><Link className={cx('text-zinc-500 font-medium font-LatoMedium uppercase tracking-[2px]', {'!text-red-700 pb-1 border-b border-red-700': isActive('/about-us')})} href='/'>About Us</Link></li>
                <li><Link className={cx('text-zinc-500 font-medium font-LatoMedium uppercase tracking-[2px]', {'!text-red-700 pb-1 border-b border-red-700': isActive('/blood-banks')})} href='/'>Blood Banks</Link></li>
                <li><Link className={cx('text-zinc-500 font-medium font-LatoMedium uppercase tracking-[2px]', {'!text-red-700 pb-1 border-b border-red-700': isActive('/event')})} href='/'>Event</Link></li>
                <li><Link className={cx('text-zinc-500 font-medium font-LatoMedium uppercase tracking-[2px]', {'!text-red-700 pb-1 border-b border-red-700': isActive('/news')})} href='/'>News</Link></li>
                <li><Link className={cx('text-zinc-500 font-medium font-LatoMedium uppercase tracking-[2px]', {'!text-red-700 pb-1 border-b border-red-700': isActive('/reviews')})} href='/'>Reviews</Link></li>
                <li><Link className={cx('text-zinc-500 font-medium font-LatoMedium uppercase tracking-[2px]', {'!text-red-700 pb-1 border-b border-red-700': isActive('/contact')})} href='/'>Contact</Link></li>
            </ul>
        </nav>
    )
}

export default Navbar