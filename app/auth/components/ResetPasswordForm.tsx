"use client"
import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ZodType, z } from 'zod'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'
import HidePassword from '@/globals/icons/hide-password'
import ShowPassword from '@/globals/icons/show-password'
import Link from 'next/link'
import { axiosInstance as axios } from '@/app/axios-api/axios'
import { BASE } from '@/app/axios-api/Endpoint'
import { passwordStrength } from 'check-password-strength'
import cx from 'classnames'
import { useParams } from 'next/navigation'
import { useRouter } from 'next/navigation'

export interface SigninData {
    password: string;
    confirmPassword: string;
}

export type fieldTypes = "confirmPassword" | "password";

const ResetPasswordForm = () => {
    const { push } = useRouter();
    const { token, user } = useParams();
    const [isShowPassword, setIsShowPassword] = useState<boolean>(false)
    const [typedPasswordStrength, setTypedPasswordStrength] = useState<string>('')

    const schema: ZodType<SigninData> = z.object({
        password: z.string().nonempty({ message: 'Password is required' }).min(8, 'Password must be at least 8 characters long'),
        confirmPassword: z.string().nonempty({ message: 'Confirm Password is required' }).min(8, 'Confirm Password must be at least 8 characters long')
    }).refine(data => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    });

    const { register, handleSubmit, formState: { errors } } = useForm<SigninData>({
        resolver: zodResolver(schema)
    })

    const submitData = (data: SigninData) => {
        if (typedPasswordStrength !== 'Strong') {
            toast.error('Password Must be Strong');
            return
        }

        const url = `${BASE}auth/${user}/reset/${token}`

        axios.put(url, data).then((res) => {
            toast.success(res.data.message);
            push('/');
        }).catch((err) => {
            toast.error(err!.response!.data!.message!);
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
            <h1 className='text-zinc-500 text-xl font-LatoBold uppercase mb-6 tracking-[4px]'>Reset your Password</h1>
            <form className='w-full' onSubmit={handleSubmit(submitData)}>
                <div className='w-3/4 grid mx-auto gap-x-32 gap-y-6'>
                    <div className='w-full relative'>
                        <div className='w-full flex flex-col-reverse'>
                            <label htmlFor="password" className='text-zinc-500 text-xs font-normal font-LatoRegular capitalize tracking-[3.50px] pl-3 pt-0.5'>Combination of alphanumerics & symbols</label>
                            <input {...register("password", {
                                onChange: (e) => {
                                    setTypedPasswordStrength(passwordStrength(e.target.value).value);
                                }
                            }
                            )} type={isShowPassword ? 'text' : 'password'} placeholder="New Password" className='placeholder:uppercase placeholder:font-LatoRegular placeholder:text-zinc-500 placeholder:text-base md:placeholder:text-lg focus:outline-0 focus:border-b focus:shadow-none border-b outline-0 shadow-none border-black w-full py-[5px] px-3 tracking-[3px]' />
                        </div>
                        <div className='absolute top-2 my-auto right-2 cursor-pointer' onClick={() => setIsShowPassword(!isShowPassword)}>
                            {isShowPassword ? <ShowPassword /> : <HidePassword />}
                        </div>
                        {typedPasswordStrength !== '' &&
                            <div className='absolute left-2 -bottom-6'>
                                <p className='pl-1.5 text-zinc-500 text-sm font-LatoRegular tracking-[1px]'>Password is <span className={cx('text-green-600 uppercase', { '!text-red-500': typedPasswordStrength !== 'Strong' })}>{typedPasswordStrength}</span>
                                </p>
                            </div>
                        }
                    </div>
                    <div className='w-full relative mt-4'>
                        <div className='w-full flex flex-col-reverse'>
                            <label htmlFor="confirmPassword" className='text-zinc-500 text-xs font-normal font-LatoRegular capitalize tracking-[3.50px] pl-3 pt-0.5'>Combination of alphanumerics & symbols</label>
                            <input {...register("confirmPassword")} type={isShowPassword ? 'text' : 'password'} placeholder="Confirm Password" className='placeholder:uppercase placeholder:font-LatoRegular placeholder:text-zinc-500 placeholder:text-base md:placeholder:text-lg focus:outline-0 focus:border-b focus:shadow-none border-b outline-0 shadow-none border-black w-full py-[5px] px-3 tracking-[3px]' />
                        </div>
                        <div className='absolute top-2 my-auto right-2 cursor-pointer' onClick={() => setIsShowPassword(!isShowPassword)}>
                            {isShowPassword ? <ShowPassword /> : <HidePassword />}
                        </div>
                    </div>
                    <p className='text-zinc-500 text-xs font-normal font-LatoRegular capitalize tracking-[2px] mt-1.5 text-right'><span className='text-zinc-500 cursor-pointer capitalize underline'>Resend Code</span></p>
                </div>
                <div className='w-3/4 mx-auto'>
                    <Button className='w-full rounded-3xl bg-red-700 font-LatoBold uppercase tracking-[3.50px] hover:bg-red-800 mt-6 mb-5' type='submit'>Reset Password</Button>
                    <p className='text-zinc-500 text-xs font-normal font-LatoRegular capitalize tracking-[2px] mt-3'><Link href={'/auth/signIn?view=BloodRecipient'} className='text-blue-600 cursor-pointer capitalize underline'>Back to Login</Link></p>
                </div>
            </form>
        </div>
    )
}

export default ResetPasswordForm