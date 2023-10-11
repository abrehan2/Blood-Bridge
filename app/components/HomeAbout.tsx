import React from 'react'
import Image from 'next/image'
import homeAboutLower from '@/assets/homeAboutLower.png'
import homeAboutUpper from '@/assets/homeAboutUpper.png'

const HomeAbout = () => {
    return (
        <div className='w-full pl-[6%] pr-[3%] pt-[2%] pb-[4%] lg:pb-[3%]'>
            <div className='w-full px-4 sm:px-10 !md:pr-0 pt-6 sm:pt-8 pb-10 bg-neutral-100 flex gap-x-6 flex-col md:flex-row'>
                <div className='w-full md:w-3/5'>
                    <h1 className='text-red-700 italic text-3xl md:text-4xl font-PlayfairDisplayBold pb-3 md:pb-6'>About BLood Bridge</h1>
                    <p className='text-neutral-500 leading-relaxed font-LatoRegular text-xs sm:text-sm md:text-xs lg:text-sm'>
                        At Blood Bridge, we are committed to saving lives by connecting blood donors with those in need. We understand the critical importance of blood transfusions and the impact they can have on patients and their families. Our mission is to make the process of donating and receiving blood as easy and accessible as possible.
                    </p>
                    <p className='text-neutral-500 leading-relaxed font-LatoRegular text-xs sm:text-sm md:text-xs lg:text-sm mt-0.5'>
                        We have created a user-friendly platform that allows donors to easily find blood drives and schedule appointments, while also providing resources to educate and encourage people to donate. For those in need of blood transfusions, our platform offers a simple way to connect with potential donors and request blood donations.
                    </p>
                    <p className='text-neutral-500 leading-relaxed font-LatoRegular text-xs sm:text-sm md:text-xs lg:text-sm mt-0.5'>
                        Our team is made up of dedicated professionals who are passionate about making a difference. We believe that every person has the power to save a life through blood donation, and we are committed to spreading awareness and increasing access to this life-saving resource. Join us in our mission to bridge the gap between blood donors and those in need, and help us make a positive impact on the world.
                    </p>
                    <p className='text-neutral-500 leading-relaxed font-LatoRegular text-xs sm:text-sm md:text-xs lg:text-sm mt-0.5'>
                        Join us in our mission to bridge the gap between blood donors and those in need, and help us make a positive impact on the world.
                    </p>
                </div>
                <div className='w-full md:w-2/5 mt-5 md:mt-0 relative'>
                    <Image className="ms-auto w-[85%] object-contain max-h-[48vh] sm:max-h-[53vh] md:max-h-[62vh] xl:max-h-[57vh]" src={homeAboutLower} alt="About Visual 1" />
                    <Image className="absolute top-7 left-0 w-[85%] object-contain max-h-[45vh] sm:max-h-[50vh] md:max-h-[59vh] xl:max-h-[54vh]" src={homeAboutUpper} alt="About Visual 2" />
                </div>
            </div>
        </div>
    )
}

export default HomeAbout