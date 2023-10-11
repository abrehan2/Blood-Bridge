import Commas from '@/globals/icons/commas'
import React from 'react'

const Quote = ({ quote }: { quote: string }) => {
    return (
        <div className='w-11/12 sm:w-9/12 lg:w-8/12 pl-[6%] pr-[3%] pb-[4%] md:pb-[3%]'>
            <div className='w-full relative'>
                <Commas svgClass='w-4 sm:w-5 h-3 sm:h-4 absolute left-0 top-0' />
                <p className='ms-6 text-lg md:text-xl lg:text-2xl text-zinc-800 font-PlayfairDisplayRegular italic'>
                    {quote}
                </p>
            </div>
        </div>
    )
}

export default Quote