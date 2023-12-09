"use client"
import React, { useState, useEffect } from 'react'
import InputField from '@/app/auth/components/inputField'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ZodType, z } from 'zod'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'
import HidePassword from '@/globals/icons/hide-password'
import ShowPassword from '@/globals/icons/show-password'
import Link from 'next/link'
import { axiosInstance as axios } from '@/app/axios-api/axios'
import { loginUserUrl } from '@/app/axios-api/Endpoint'
import { useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux'
import { logIn } from '@/redux/features/authSlice'

export interface SigninData {
    email: string;
    password: string;
}

export type fieldTypes = "email" | "password";

const ClientSigninForm = () => {
    const { push } = useRouter();
    const dispath = useDispatch();
    const [isShowPassword, setIsShowPassword] = useState<boolean>(false)
    
    const schema: ZodType<SigninData> = z.object({
        email: z.string().nonempty('Email is required').email({ message: 'Email is invalid' }),
        password: z.string().nonempty({ message: 'Password is required' }),
    })

    const { register, handleSubmit, formState: { errors } } = useForm<SigninData>({
        resolver: zodResolver(schema)
    })

    const submitData = (data: SigninData) => {
        const url = loginUserUrl();
        axios.post(url, data, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((res) => {
            dispath(logIn({user: res.data.user} as any))
            toast.success('Login Successful');
            push("/")
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
        <form className='w-full' onSubmit={handleSubmit(submitData)}>
            <div className='w-3/4 grid mx-auto gap-x-32 gap-y-6'>
                <InputField
                    fieldName='email' fieldType='email'
                    fieldTitle='Email' fieldLabel={"aliakbar@gmail.com"}
                    register={register} titleCase='lowercase' />
                <div className='w-full relative'>
                    <div className='w-full flex flex-col-reverse'>
                        <label htmlFor="password" className='text-zinc-500 text-xs font-normal font-LatoRegular capitalize tracking-[3.50px] pl-3 pt-0.5'>Enter password set at creating account</label>
                        <input type={isShowPassword ? 'text' : 'password'} placeholder="Password" className='placeholder:uppercase placeholder:font-LatoRegular placeholder:text-zinc-500 placeholder:text-base md:placeholder:text-lg focus:outline-0 focus:border-b focus:shadow-none border-b outline-0 shadow-none border-black w-full py-[5px] px-3 tracking-[3px]' {...register("password")} />
                    </div>
                    <div className='absolute top-2 my-auto right-2 cursor-pointer' onClick={() => setIsShowPassword(!isShowPassword)}>
                        {isShowPassword ? <ShowPassword /> : <HidePassword />}
                    </div>
                </div>
                <p className='text-zinc-500 text-xs font-normal font-LatoRegular capitalize tracking-[2px] mt-3 text-right'>forgot Password? <Link href={'/auth/forgot-password?type=user'} className='text-blue-600 cursor-pointer capitalize underline'>reset Password</Link></p>
            </div>
            <div className='w-3/4 mx-auto'>
                <Button className='w-full rounded-3xl bg-red-700 font-LatoBold uppercase tracking-[3.50px] hover:bg-red-800 mt-6 mb-5' type='submit'>Sign In</Button>
                <p className='text-zinc-500 text-xs font-normal font-LatoRegular capitalize tracking-[2px] mt-3'>are you a new user? <Link href={'/auth/signUp?view=BloodRecipient'} className='text-blue-600 cursor-pointer capitalize underline'>Sign up</Link></p>
            </div>
        </form>
    )
}

export default ClientSigninForm