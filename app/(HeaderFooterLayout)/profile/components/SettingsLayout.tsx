"use client"
import PolicyIcon from '@/globals/icons/policy-icon';
import { ChevronRight, User2 } from 'lucide-react';
import cx from 'classnames';
import { usePathname, useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useBBSelector } from '@/redux/store';
import CompleteProfile from './CompleteProfile';

const SettingsLayout = () => {
    const [showPopup, setShowPopup] = useState<boolean>(false);
    const { push } = useRouter();
    const path = usePathname();
    const bloodBank = useBBSelector(state => state.authReducer.value.user)

    const handleRedirect = (path: string) => {
        push(path);
    }

    const isCurrentPath = (pathCheck: string) => {
        return pathCheck === path
    }

    const isUserManagementActive = isCurrentPath("/profile/bloodBank/settings/management")
    const isPolicyActive = isCurrentPath("/profile/bloodBank/settings/policy")
    const percentage = bloodBank ? bloodBank?.profileVerified ? 100 : 85 : 0;

    const handleComplete = () => {
        setShowPopup(true)
    }

    return (
        <>
            {(!bloodBank?.profileVerified || showPopup) && <CompleteProfile popup={showPopup} setPopup={setShowPopup} />}
            <div className='w-full bg-bloodBankNavRed p-2.5 rounded-[10px] py-5'>
                <div className='flex items-center pl-[5%] gap-x-3.5'>
                    <CircularProgressbar
                        background={true}
                        className='!w-[86px] h-[86px]'
                        value={percentage}
                        text={`${percentage}%`}
                        strokeWidth={3}
                        styles={buildStyles({
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            textSize: '24px',
                            pathColor: '#fff',
                            textColor: '#fff',
                            trailColor: 'transparent',
                        })} />
                    <div className='flex flex-col gap-y-3'>
                        <h1 className='text-white font-LatoBold text-base text-[17px]'>Profile Informations</h1>
                        {percentage === 100 ?
                            <button className='bg-white text-bloodBankNavRed font-LatoBold px-4 py-1.5 rounded-[7px] cursor-pointer text-[15px]'>Profile {percentage}% Completed</button> :
                            <button className='bg-white text-bloodBankNavRed font-LatoBold px-4 py-1.5 rounded-[7px] cursor-pointer text-[15px]' onClick={() => handleComplete()}>Complete your profile</button>
                        }
                    </div>
                </div>
            </div>
            <div className='w-full mt-6 flex flex-col gap-y-3'>

                <div className='w-full bg-[#EEEBEB] rounded-[10px] py-5 flex items-center justify-between px-6 cursor-pointer' onClick={() => handleRedirect("/profile/bloodBank/settings/management")}>
                    <div className='flex gap-x-3 items-center'>
                        <User2 size={20} color={isUserManagementActive ? '#CB5C52' : 'black'} />
                        <p className={cx('text-black font-LatoBold', { '!text-[#CB5C52]': isUserManagementActive })}>User Management</p>
                    </div>
                    <ChevronRight size={20} color={isUserManagementActive ? '#CB5C52' : 'black'} />
                </div>

                <div className='w-full bg-[#EEEBEB] rounded-[10px] py-5 flex items-center justify-between px-6 cursor-pointer' onClick={() => handleRedirect("/profile/bloodBank/settings/policy")}>
                    <div className='flex gap-x-3 items-center'>
                        <PolicyIcon svgClass='w-[14px] h-[18px]' color={isPolicyActive ? '#CB5C52' : 'black'} />
                        <p className={cx('text-black font-LatoBold', { '!text-[#CB5C52]': isPolicyActive })}>Policy</p>
                    </div>
                    <ChevronRight size={20} color={isPolicyActive ? '#CB5C52' : 'black'} />
                </div>

            </div>
        </>
    )
}

export default SettingsLayout