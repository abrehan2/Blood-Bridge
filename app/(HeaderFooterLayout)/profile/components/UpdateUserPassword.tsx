"use client"

import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { ZodType, z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Constants } from '@/globals/constants';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button'
import { useBBSelector } from '@/redux/store'
import { axiosInstance as axios } from '@/app/axios-api/axios'
import { userUpdatePasswordUrl } from '@/app/axios-api/Endpoint'
import { passwordStrength } from 'check-password-strength'
import ShowPassword from '@/globals/icons/show-password'
import HidePassword from '@/globals/icons/hide-password'
import cx from 'classnames'

interface UpdateUserData {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
}

interface UpdateUserPasswordProps {
    changeDetails: boolean;
    setChangeDetails: React.Dispatch<React.SetStateAction<boolean>>;
    url: string;
    isForBloodBank?: boolean;
}

const UpdateUserPassword = ({ changeDetails, setChangeDetails, url, isForBloodBank }: UpdateUserPasswordProps) => {
    const [isShowPassword, setIsShowPassword] = useState<boolean>(false)
    const [typedPasswordStrength, setTypedPasswordStrength] = useState<string>('')
    const schema: ZodType<UpdateUserData> = z.object({
        oldPassword: z.string().nonempty({ message: 'Current Password must not be empty' }),
        newPassword: z.string().nonempty({ message: 'New Password is required' }).min(8, 'Last Name must be at least 8 characters long'),
        confirmPassword: z.string().nonempty({ message: 'Confirm Password is required' }).min(8, 'Last Name must be at least 8 characters long'),
    }).refine(data => data.newPassword === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    });

    const { register, handleSubmit, formState: { errors } } = useForm<UpdateUserData>({
        resolver: zodResolver(schema)
    })

    const SubmitData = (data: UpdateUserData) => {
        const updateData = new FormData();

        updateData.append('oldPassword', data.oldPassword);
        updateData.append('newPassword', data.newPassword);
        updateData.append('confirmPassword', data.confirmPassword);

        axios.put(url, updateData, {
            withCredentials: true,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }).then((res) => {
            console.log(res)
            toast.success("Password Changed Successfully")
            setChangeDetails(false)
        }).catch((err) => {
            console.log(err)
            toast.error(err.response.data.message)
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
        <form onSubmit={handleSubmit(SubmitData)} className='w-full flex flex-col gap-y-2'>
            <div className='flex flex-col'>
                <label className='text-black font-RobotoMedium mb-0.5 ps-3 capitalize' htmlFor="oldPassword">Current Password</label>
                <input {...register("oldPassword")} className={cx('bg-white rounded-3xl w-full py-2 px-3.5 focus:outline-0', {'!rounded-[5px]': isForBloodBank})} type="password" readOnly={!changeDetails ? true : false}/>
            </div>

            <div className='relative mb-5'>
                <div className='w-full flex flex-col'>
                    <label htmlFor="password" className='text-black font-RobotoMedium mb-0.5 ps-3 capitalize'>New Password</label>
                    <input {...register("newPassword", {
                        onChange: (e) => {
                            setTypedPasswordStrength(passwordStrength(e.target.value).value);
                        }
                    }
                    )} type={isShowPassword ? 'text' : 'password'} placeholder="New Password" className={cx('bg-white rounded-3xl w-full py-2 px-3.5 focus:outline-0 text-red-500', { '!text-black': typedPasswordStrength === 'Strong' }, {'!rounded-[5px]': isForBloodBank})} readOnly={!changeDetails ? true : false}/>
                </div>
                <div className='absolute bottom-3 my-auto right-3 cursor-pointer' onClick={() => setIsShowPassword(!isShowPassword)}>
                    {isShowPassword ? <ShowPassword /> : <HidePassword />}
                </div>
                {typedPasswordStrength !== '' &&
                    <div className='absolute left-2 -bottom-6'>
                        <p className='pl-1.5 text-zinc-500 text-sm font-LatoRegular tracking-[1px]'>Password is <span className={cx('text-green-600 uppercase text-xs', { '!text-red-500': typedPasswordStrength !== 'Strong' })}>{typedPasswordStrength}</span>
                        </p>
                    </div>
                }
            </div>

            <div className='relative'>
                <div className='w-full flex flex-col'>
                    <label htmlFor="confirmPassword" className='text-black font-RobotoMedium mb-0.5 ps-3 capitalize'>Confirm Password</label>
                    <input {...register("confirmPassword")} type={isShowPassword ? 'text' : 'password'} placeholder="Confirm Password" className={cx('bg-white rounded-3xl w-full py-2 px-3.5 focus:outline-0', {'!rounded-[5px]': isForBloodBank})} readOnly={!changeDetails ? true : false}/>
                </div>
                <div className='absolute bottom-3 my-auto right-3 cursor-pointer' onClick={() => setIsShowPassword(!isShowPassword)}>
                    {isShowPassword ? <ShowPassword /> : <HidePassword />}
                </div>
            </div>

            {changeDetails &&
            <>
                {isForBloodBank ? 
                <Button type='submit' className='!w-max !rounded-3xl !bg-darkRed hover:!bg-red-800 mt-1 !h-auto !py-1.5 min-w-[140px] !text-sm'>
                    Change Password
                </Button> : <Button type='submit' className='!w-max !rounded-3xl !bg-darkRed hover:!bg-red-800 mt-1 !h-auto !py-2 min-w-[140px] !text-base'>
                    Change Password
                </Button>
                }
                </>}
        </form>
    )
}

export default UpdateUserPassword