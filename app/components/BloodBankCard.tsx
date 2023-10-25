"use client"
import React, { useState } from 'react'
import Image from 'next/image'
import shadow from '@/app/components/shadow.module.css'
import { BloodBankInterface } from '@/app/components/BloodBanks';
import cx from 'classnames'

const BloodBankCard = ({ bloodBank }: { bloodBank: BloodBankInterface }) => {
    const highestQuantityBlood = bloodBank.availableBloodGroups.reduce((prev, current) => (prev.quantity > current.quantity) ? prev : current)
    const [bloodBankGroup, setBloodBankGroup] = useState(highestQuantityBlood)
    return (
        <div className={`w-4/5 mx-auto sm:mx-0 sm:w-full bg-white flex flex-col lg:h-[95vh] xl:h-[82vh] ${shadow.lightShadow}`}>
            <Image className='w-full lg:h-1/2 xl:h-[55%] object-contain' src={bloodBank.image} alt='Blood Bank Logo' />
            <div className='w-full flex flex-col items-start px-4 pb-5 gap-y-0.5 pt-5 lg:h-1/2 xl:h-[45%]'>
                <h3 className='text-black text-xl font-PlayfairDisplaySemiBold'>{bloodBank.name}</h3>
                <p className='text-black font-PlayfairDisplaySemiBold'>{bloodBank.address}</p>
                <p className='text-black font-PlayfairDisplaySemiBold'>{bloodBank.location.lat}, {bloodBank.location.lng}</p>
                <div className='w-full px-3 mt-2 py-1 flex items-center bg-darkRed justify-between'>
                    <p className='text-white font-PlayfairDisplaySemiBold'>{bloodBankGroup.bloodType}</p>
                    <p className='text-white font-PlayfairDisplaySemiBold'>{bloodBankGroup.quantity} Bags</p>
                </div>
                <div className='w-full mt-2 flex items-center flex-wrap gap-x-4 gap-y-2'>
                    {bloodBank.availableBloodGroups.map((bloodGroup, groupIndex) => (
                        <span key={groupIndex} className={cx('text-black font-PlayfairDisplaySemiBold px-1 border border-darkRed min-w-[40px] text-center hover:bg-darkRed hover:text-white hover:cursor-pointer', {'!hidden': bloodGroup.quantity <= 0}, {'!bg-darkRed !text-white': bloodBankGroup.bloodType === bloodGroup.bloodType})} onClick={() => setBloodBankGroup(bloodGroup)}>
                            {bloodGroup.bloodType}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default BloodBankCard