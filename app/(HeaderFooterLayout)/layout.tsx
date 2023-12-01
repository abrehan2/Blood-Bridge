import React from 'react'
import Header from '@/app/header/Header';

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className='relative'>
            <Header />
            {children}
        </div>
    );
}