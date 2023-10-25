"use client"
import React from 'react'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';

import 'react-circular-progressbar/dist/styles.css';

const SettingsLayout = () => {
    const percentage = 85;
    return (
        <div className='w-full bg-bloodBankNavRed p-2.5 rounded-[10px] py-5'>
            <div className='flex items-center pl-[5%] gap-x-3.5'>
                <CircularProgressbar
                    background={true}
                    className='!w-24 h-24'
                    value={percentage}
                    text={`${percentage}%`}
                    strokeWidth={3}
                    styles={buildStyles({
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        textSize: '24px',
                        pathColor: '#fff',
                        textColor: '#fff',
                        trailColor: 'transparent',
                    })} />;
                <div className='flex flex-col gap-y-3'>
                    <h1 className='text-white font-LatoBold text-lg'>Profile Informations</h1>
                    <span className='bg-white text-bloodBankNavRed font-LatoBold px-4 py-1.5 rounded-[7px] cursor-pointer'>Complete your profile</span>
                </div>
            </div>
        </div>
    )
}

export default SettingsLayout