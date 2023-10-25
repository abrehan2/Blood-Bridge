"use client"
import React, { useState, useEffect } from 'react'
import InputField from '@/app/auth/components/inputField'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ZodType, z } from 'zod'
import { Constants } from '@/globals/constants'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'
import HidePassword from '@/globals/icons/hide-password'
import ShowPassword from '@/globals/icons/show-password'
import { axiosInstance as axios } from '@/app/axios-api/axios'
import { registerUserUrl } from '@/app/axios-api/Endpoint'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import cx from 'classnames'
import { passwordStrength } from 'check-password-strength'

export interface SignupData {
    firstName: string;
    lastName: string;
    email: string;
    dob: string;
    city: string;
    bloodGroup: string;
    contact: string;
    password?: string;
    confirmPassword?: string;
    cnic?: string;
}

export type fieldTypes = "email" | "password" | "firstName" | "lastName" | "dob" | "confirmPassword" | "cnic" | "contact" | "bloodGroup";

const ClientSignupForm = () => {

    const [isShowPassword, setIsShowPassword] = useState<boolean>(false)
    const [agreeConditions, setAgreeConditions] = useState<boolean>(false)
    const [typedPasswordStrength, setTypedPasswordStrength] = useState<string>('')

    const today = new Date();
    const formattedDate = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;

    const schema: ZodType<SignupData> = z.object({
        firstName: z.string().nonempty({ message: 'First Name is required' }).min(3, 'First Name must be at least 3 characters long'),
        lastName: z.string().nonempty({ message: 'Last Name is required' }).min(3, 'Last Name must be at least 3 characters long'),
        email: z.string().email({ message: 'Email is invalid' }),
        dob: z.string().nonempty('Date of Birth is Required').refine((data) => {
            const dob = new Date(data);
            return dob < today && data !== formattedDate
        }, {
            message: `Date of Birth must not exceed ${formattedDate}`
        }),
        city: z.string().nonempty({ message: 'City is required' }),
        bloodGroup: z.string().nonempty({ message: 'Blood Group is required' }),
        contact: z.string().nonempty('Contact is Required').refine((value) => Constants.phoneRegExp.test(value), {
            message: 'Contact must be 11 digits long starting with 0',
        }),
        cnic: z.string().nonempty('CNIC is Required').refine((value) => Constants.CNIC_REGEXP.test(value), {
            message: 'CNIC must be 13 digits long with dashes',
        }),
        password: z.string().nonempty({ message: 'Password is required' }).min(8, 'Password must be at least 8 characters long'),
        confirmPassword: z.string().nonempty({ message: 'Confirm Password is required' }).min(8, 'Confirm Password must be at least 8 characters long')
    }).refine(data => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    });

    const { register, handleSubmit, formState: { errors } } = useForm<SignupData>({
        resolver: zodResolver(schema)
    })

    const { push } = useRouter();

    const SubmitData = (data: SignupData) => {
        if (!agreeConditions) {
            toast.error('Please agree to the terms and conditions');
            return
        }
        if (typedPasswordStrength !== 'Strong') {
            toast.error('Password Must be Strong');
            return
        }

        const url = registerUserUrl();
        axios.post(url, data)
            .then((res: any) => {
                toast.success(res.data.message);
                push('/auth/signIn?view=BloodRecipient')
            })
            .catch((err: any) => {
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
        <form className='w-full' onSubmit={handleSubmit(SubmitData)}>
            <div className='w-3/4 grid grid-cols-2 mx-auto gap-x-32 gap-y-6'>
                <InputField
                    fieldName='firstName' fieldType='text'
                    fieldTitle='First Name' fieldLabel={"Ali"}
                    register={register} />
                <InputField
                    fieldName='lastName' fieldType='text'
                    fieldTitle='Last Name' fieldLabel={"Akbar"}
                    register={register} />
                <InputField
                    fieldName='email' fieldType='email'
                    fieldTitle='Email' fieldLabel={"aliakbar@gmail.com"}
                    register={register} titleCase='lowercase' />
                <InputField
                    fieldName='dob' fieldType='date'
                    fieldTitle='Date of Birth' fieldLabel={`Must be older than ${formattedDate}`}
                    register={register} titleCase='capitalize' />

                <div className='w-full flex flex-col-reverse'>
                    <label htmlFor="firstName" className='text-zinc-500 text-xs font-normal font-LatoRegular uppercase tracking-[3.50px] pl-3 pt-0.5'>Islamabad</label>
                    <select className='focus:outline-0 focus:border-b focus:shadow-none border-b outline-0 shadow-none border-black w-full py-[5px] px-3 tracking-[3px]' {...register("city")}>
                        <option value="">Select City</option>
                        <option value="Islamabad">Islamabad</option>
                        <option value="Rawalpindi">Rawalpindi</option>
                    </select>
                </div>

                <div className='w-full flex flex-col-reverse'>
                    <label htmlFor="firstName" className='text-zinc-500 text-xs font-normal font-LatoRegular uppercase tracking-[3.50px] pl-3 pt-0.5'>Blood Group</label>
                    <select className='focus:outline-0 focus:border-b focus:shadow-none border-b outline-0 shadow-none border-black w-full py-[5px] px-3 tracking-[3px]' {...register("bloodGroup")}>
                        <option value="">Select Blood Group</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                    </select>
                </div>

                <InputField
                    fieldName='contact' fieldType='text'
                    fieldTitle='Contact' fieldLabel={`eg. 03001234567`}
                    register={register} titleCase='capitalize' />

                {/* CNIC field */}
                <div className='w-full flex flex-col-reverse'>
                    <label htmlFor="firstName" className='text-zinc-500 text-xs font-normal font-LatoRegular uppercase tracking-[3.50px] pl-3 pt-0.5'>12345-6582314-2</label>
                    <input {...register("cnic")} type="text" placeholder="CNIC" className='placeholder:uppercase placeholder:font-LatoRegular placeholder:text-zinc-500 placeholder:text-base md:placeholder:text-lg focus:outline-0 focus:border-b focus:shadow-none border-b outline-0 shadow-none border-black w-full py-[5px] px-3 tracking-[3px]' />
                </div>

                <div className='w-full relative'>
                    <div className='w-full flex flex-col-reverse'>
                        <label htmlFor="password" className='text-zinc-500 text-xs font-normal font-LatoRegular capitalize tracking-[3.50px] pl-3 pt-0.5'>Combination of alphanumerics & symbols</label>
                        <input {...register("password", {
                            onChange: (e) => {
                                setTypedPasswordStrength(passwordStrength(e.target.value).value);
                            }
                        }
                        )} type={isShowPassword ? 'text' : 'password'} placeholder="Password" className={cx('placeholder:uppercase placeholder:font-LatoRegular placeholder:text-zinc-500 placeholder:text-base md:placeholder:text-lg focus:outline-0 focus:border-b focus:shadow-none border-b outline-0 shadow-none border-black w-full py-[5px] px-3 tracking-[3px] text-red-500', { '!text-black': typedPasswordStrength === 'Strong' })} />
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
                <div className='w-full relative'>
                    <div className='w-full flex flex-col-reverse'>
                        <label htmlFor="confirmPassword" className='text-zinc-500 text-xs font-normal font-LatoRegular capitalize tracking-[3.50px] pl-3 pt-0.5'>Combination of alphanumerics & symbols</label>
                        <input {...register("confirmPassword")} type={isShowPassword ? 'text' : 'password'} placeholder="Confirm Password" className='placeholder:uppercase placeholder:font-LatoRegular placeholder:text-zinc-500 placeholder:text-base md:placeholder:text-lg focus:outline-0 focus:border-b focus:shadow-none border-b outline-0 shadow-none border-black w-full py-[5px] px-3 tracking-[3px]' />
                    </div>
                    <div className='absolute top-2 my-auto right-2 cursor-pointer' onClick={() => setIsShowPassword(!isShowPassword)}>
                        {isShowPassword ? <ShowPassword /> : <HidePassword />}
                    </div>
                </div>

            </div>
            <div className='w-3/4 mx-auto mt-4'>
                <div className='flex items-center gap-x-2'>
                    <input id='agreeTerms' type="checkbox"
                        onChange={() => setAgreeConditions(!agreeConditions)}
                        checked={agreeConditions} />
                    <label htmlFor='agreeTerms' className='text-zinc-500 text-xs font-normal font-LatoRegular capitalize tracking-[2px] my-7'>I agree to <Link href={'/terms-and-conditions'} className='text-blue-600 cursor-pointer'>terms & conditions</Link></label>
                </div>
                <Button className='w-full rounded-3xl bg-red-700 font-LatoBold uppercase tracking-[3.50px] hover:bg-red-800' type='submit'>Sign Up</Button>

                <p className='text-zinc-500 text-xs font-normal font-LatoRegular capitalize tracking-[2px] mt-4'>already have an account? <Link href={'/auth/signIn/?view=BloodRecipient'} className='text-blue-600 cursor-pointer'>Sign In</Link></p>
            </div>
        </form>
    )
}

export default ClientSignupForm