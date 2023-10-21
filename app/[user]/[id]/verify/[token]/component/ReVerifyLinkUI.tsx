"use client"

import React, { useEffect, useState } from 'react'
import verified from "@/assets/verified.png"
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { axiosInstance as axios } from '@/app/axios-api/axios';
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation';
import { BadgeX } from 'lucide-react';

const ReVerifyLinkUI = ({ url }: { url: string }) => {
    const { push } = useRouter();
    const [isVerified, setIsVerified] = useState<boolean>(false)
    const [isError, setIsError] = useState<boolean>(false)
    useEffect(() => {
        axios.get(url, {
            withCredentials: true
        }).then(res => {
            setIsVerified(true);
            push('/profile/user/account')
        }).catch((err) => {
            toast.error(err!.response!.data!.message!);
            setIsError(true);
        })
    }, [])
    return (
        <>
            {isVerified ?
                <>
                    <Image className='w-28 h-28' src={verified} alt='Verified' />
                    <p className='text-lg uppercase text-zinc-500 tracking-[3.75px] font-LatoMedium mt-3.5 text-center max-w-[35%]'>You have succsuccessfully verified your email</p>
                    <Link href={"/profile/user/account"}>
                        <Button className='!bg-darkRed !text-white !tracking-[5px] !font-LatoBold !rounded-full !text-xl !px-8 !py-6 pl-[5px] mt-9 uppercase'>
                            Go to Dashboard
                        </Button>
                    </Link>
                </> : <>
                    {isError ? <>
                        <BadgeX size={130} color='darkRed'/>
                        <p className='text-lg uppercase text-red-600 tracking-[3.75px] font-LatoMedium mt-3.5 text-center max-w-[35%]'>Invalid Email Verification Link</p>
                    </> : <>
                        <p className='text-lg uppercase text-zinc-500 tracking-[3.75px] font-LatoMedium mt-3.5 text-center max-w-[35%]'>Please Wait, verifying...</p>
                    </>
                    }
                </>}
        </>
    )
}

export default ReVerifyLinkUI