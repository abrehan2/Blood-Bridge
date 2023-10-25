"use client"
import React, { useState, useRef } from 'react'
import Image from 'next/image'
import bloodDonationIcon from '@/assets/bloodDonationIcon.png'
import bloodDonationBlackIcon from '@/assets/bloodDonationBlackIcon.png'
import { useBBSelector } from '@/redux/store'
import { ChevronRight, MessagesSquare, Newspaper, User2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation'
import cx from 'classnames'
import { UploadCloud } from 'lucide-react'
import toast from 'react-hot-toast'
import { axiosInstance } from '@/app/axios-api/axios'
import { userUpdateDetailsUrl } from '@/app/axios-api/Endpoint'

const userInfo = () => {
    const [previewImage, setPreviewImage] = useState<any>();
    const { push } = useRouter();
    const path = usePathname();
    const isLoading = useBBSelector(state => state.authReducer.value.isLoading)
    const user = useBBSelector(state => state.authReducer.value.user)

    const handleRedirect = (path: string) => {
        push(path);
    }

    const isCurrentPath = (pathCheck: string) => {
        return pathCheck === path
    }

    const isDonationsActive = isCurrentPath("/profile/user/donations")
    const isRequestsActive = isCurrentPath("/profile/user/requests")
    const isAccountActive = isCurrentPath("/profile/user/account")
    const isFeedbackActive = isCurrentPath("/profile/user/feedback")

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileSelect = (event: any) => {
        const reader = new FileReader();
        const selectedFile = event.target.files[0];
        if (selectedFile && selectedFile.type.startsWith('image/')) {
            const dataURL = reader.result;
            reader.onload = () => {
                setPreviewImage(dataURL);
            };
            reader.readAsDataURL(selectedFile);

            const profileData = new FormData();
            profileData.set('avatar', dataURL as any);

            const url = userUpdateDetailsUrl();
            axiosInstance.put(url, profileData, {
                withCredentials: true,
                headers: {
                    "Content-Type": ["multipart/form-data"]
                }
            }).then((res) => {
                console.log(res)
                // toast.success("Profile Picture Changed Successfully")
            }).catch((err) => {
                console.log(err)
                toast.error(err.response.data.message)
            })
        } else {
            toast.error('Please select a valid image file');
        }
    };

    return (
        <div className='w-[30%] mb-5'>
            {isLoading ? <>
                <div className='w-full bg-[#EEEBEB] flex flex-col justify-center items-center min-h-[80vh] rounded-[33px]'>
                    <div className='w-24 h-24 animate-spin border-t-[3px] border-darkRed rounded-full' />
                </div>
            </> :
                <>
                    <div className='relative w-full bg-[#EEEBEB] flex flex-col justify-center items-center gap-y-4 py-4 rounded-[33px]'>
                        <span className='absolute left-3.5 top-3.5 bg-bloodBankNavRed max-w-[32px] max-h-[32px] rounded-full p-2 font-RobotoBold text-white text-sm'>{user?.bloodGroup}</span>
                        <p className='capitalize text-black text-4xl font-LateefRegular'>Profile</p>
                        <div onClick={isAccountActive ? handleUpload : () => { }}
                            className={cx('relative w-44 h-44', { 'group cursor-pointer': isAccountActive })}>
                            <Image
                                className='!w-44 !h-44 object-cover rounded-full'
                                src={previewImage ? previewImage : user?.avatar.url}
                                alt='User Profile'
                                width={176}
                                height={176} />
                            <div className='hidden group-hover:flex absolute top-0 left-0 w-full h-full bg-zinc-100 bg-opacity-80 rounded-full flex-col items-center justify-center'>
                                <input
                                    type="file"
                                    accept="image/*"
                                    ref={fileInputRef}
                                    className='hidden'
                                    onChange={handleFileSelect}
                                />
                                <UploadCloud strokeWidth={3} size={40} />
                                <p className='text-black font-RobotoMedium'>Upload Profile Picture</p>
                            </div>
                        </div>
                        <p className='capitalize text-black text-3xl font-LateefRegular'>{`${user?.firstName} ${user?.lastName}`}</p>
                    </div>
                    <div className='w-full mt-6 flex flex-col gap-y-3'>

                        <div className='w-full bg-[#EEEBEB] rounded-[10px] py-5 flex items-center justify-between px-6 cursor-pointer' onClick={() => handleRedirect("/profile/user/donations")}>
                            <div className='flex gap-x-3 items-center'>
                                <Image className='w-5 object-contain' src={isDonationsActive ? bloodDonationIcon : bloodDonationBlackIcon} alt='Blood Donations' />
                                <p className={cx('text-black font-LatoBold text-lg', { '!text-[#CB5C52]': isDonationsActive })}>Blood Donation</p>
                            </div>
                            <ChevronRight size={20} color={isDonationsActive ? '#CB5C52' : 'black'} />
                        </div>

                        <div className='w-full bg-[#EEEBEB] rounded-[10px] py-5 flex items-center justify-between px-6 cursor-pointer' onClick={() => handleRedirect("/profile/user/requests")}>
                            <div className='flex gap-x-3 items-center'>
                                <Newspaper size={20} color={isRequestsActive ? '#CB5C52' : 'black'} />
                                <p className={cx('text-black font-LatoBold text-lg', { '!text-[#CB5C52]': isRequestsActive })}>Blood Requests</p>
                            </div>
                            <ChevronRight size={20} color={isRequestsActive ? '#CB5C52' : 'black'} />
                        </div>

                        <div className='w-full bg-[#EEEBEB] rounded-[10px] py-5 flex items-center justify-between px-6 cursor-pointer' onClick={() => handleRedirect("/profile/user/account")}>
                            <div className='flex gap-x-3 items-center'>
                                <User2 size={20} color={isAccountActive ? '#CB5C52' : 'black'} />
                                <p className={cx('text-black font-LatoBold text-lg', { '!text-[#CB5C52]': isAccountActive })}>Account</p>
                            </div>
                            <ChevronRight size={20} color={isAccountActive ? '#CB5C52' : 'black'} />
                        </div>

                        <div className='w-full bg-[#EEEBEB] rounded-[10px] py-5 flex items-center justify-between px-6 cursor-pointer' onClick={() => handleRedirect("/profile/user/feedback")}>
                            <div className='flex gap-x-3 items-center'>
                                <MessagesSquare size={20} color={isFeedbackActive ? '#CB5C52' : 'black'} />
                                <p className={cx('text-black font-LatoBold text-lg', { '!text-[#CB5C52]': isFeedbackActive })}>Feedback</p>
                            </div>
                            <ChevronRight size={20} color={isFeedbackActive ? '#CB5C52' : 'black'} />
                        </div>

                    </div>
                </>
            }
        </div>
    )
}

export default userInfo