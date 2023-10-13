"use client"
import React, { useEffect } from 'react'
import InputField from '@/app/auth/components/inputField'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ZodType, z } from 'zod'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { axiosInstance as axios } from '@/app/axios-api/axios'
import { userForgotPasswordUrl, bloodBankForgotPasswordUrl } from '@/app/axios-api/Endpoint'
import { useSearchParams } from 'next/navigation'

export interface SigninData {
    email: string;
}

export type fieldTypes = "email";

const ForgotPassword = () => {
    const userType = useSearchParams().get('type');
    const schema: ZodType<SigninData> = z.object({
        email: z.string().nonempty('Email is required').email({ message: 'Email is invalid' }),
    })

    const { register, handleSubmit, formState: { errors } } = useForm<SigninData>({
        resolver: zodResolver(schema)
    })

    const submitData = (data: SigninData) => {
        const url = userType === 'user' ? userForgotPasswordUrl() : userType === 'bloodBank' ? bloodBankForgotPasswordUrl() : '';
        axios.post(url, data).then((res) => {
            toast.success(res.data.message);
        }).catch((err) => {
            if(url === '') {
                toast.error('Invalid Link');
            }
            else {
                toast.error(err!.response!.data!.message!);
            }
        })
    }

    useEffect(() => {
        const allErrors = Object.values(errors);
        allErrors.map((error) => (
            notifyError(error?.message)
        ))
    }, [errors]);

    const notifyError = (errorMessage: any) => {
        toast.error(errorMessage);
    };

    return (
        <div className='flex flex-col items-center justify-center w-full'>
            <h1 className='text-zinc-500 text-xl font-LatoBold uppercase mb-6 tracking-[4px]'>Forgot your Password</h1>
            <form className='w-full' onSubmit={handleSubmit(submitData)}>
                <div className='w-3/4 grid mx-auto gap-x-32 gap-y-6'>
                    <InputField
                        fieldName='email' fieldType='email'
                        fieldTitle='Email' fieldLabel={"aliakbar@gmail.com"}
                        register={register} titleCase='lowercase' />
                    
                    <p className='text-zinc-500 text-xs font-normal font-LatoRegular capitalize tracking-[2px] mt-3 text-right'><span className='text-blue-600 cursor-pointer capitalize underline'>Resend Code</span></p>
                </div>
                <div className='w-3/4 mx-auto'>
                    <Button className='w-full rounded-3xl bg-red-700 font-LatoBold uppercase tracking-[3.50px] hover:bg-red-800 mt-6 mb-5' type='submit'>Send Code</Button>
                    <p className='text-zinc-500 text-xs font-normal font-LatoRegular capitalize tracking-[2px] mt-3'><Link href={`/auth/signIn?view=${userType === 'user' ? 'BloodRecipient': userType === 'bloodBank' ? 'BloodBank' : 'BloodRecipient'}`} className='text-blue-600 cursor-pointer capitalize underline'>Back to Login</Link></p>
                </div>
            </form>
        </div>
    )
}

export default ForgotPassword