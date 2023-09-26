"use client"
import React, { useState, useEffect, ChangeEvent } from 'react'
import InputField from '@/app/auth/components/inputField'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ZodType, z } from 'zod'
import { Constants } from '@/globals/constants'
import { Button } from '@/components/ui/button'
import { toast } from 'react-toastify'
import HidePassword from '@/globals/icons/hide-password'
import ShowPassword from '@/globals/icons/show-password'

export interface SignupData {
    firstName: string;
    lastName: string;
    email: string;
    dateOfBirth: string;
    city: string;
    password: string;
    confirmPassword: string;
    cnic?: string;
}

export type fieldTypes = "email" | "password" | "firstName" | "lastName" | "dateOfBirth" | "confirmPassword" | "cnic";

const ClientSignupForm = () => {

    const [cnic, setCnic] = useState<string>('')
    const [isShowPassword, setIsShowPassword] = useState<boolean>(false)
    const [agreeConditions, setAgreeConditions] = useState<boolean>(false)

    const today = new Date();
    const formattedDate = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;

    const schema: ZodType<SignupData> = z.object({
        firstName: z.string().nonempty({ message: 'First Name is required' }).min(3, 'First Name must be at least 3 characters long'),
        lastName: z.string().nonempty({ message: 'Last Name is required' }).min(3, 'Last Name must be at least 3 characters long'),
        email: z.string().email({ message: 'Email is invalid' }),
        dateOfBirth: z.string().nonempty('Date of Birth is Required').refine((data) => {
            const dateOfBirth = new Date(data);
            return dateOfBirth < today && data !== formattedDate
        }, {
            message: `Date of Birth must not exceed ${formattedDate}`
        }),
        city: z.string().nonempty({ message: 'City is required' }),
        password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
        confirmPassword: z.string().min(8, { message: 'Password must be at least 8 characters long' })
    }).refine(data => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    })

    const { register, handleSubmit, formState: { errors } } = useForm<SignupData>({
        resolver: zodResolver(schema)
    })

    const handleCNIC = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.value.length > 15) {
            return
        }
        if (cnic.length === 4 || cnic.length === 12) {
            setCnic(e.target.value + '-')
        } else {
            setCnic(e.target.value)
        }
    }

    const SubmitData = (data: SignupData) => {
        if (cnic.length === 0) {
            toast.error('CNIC is required', {
                position: toast.POSITION.TOP_LEFT,
            });
            return
        }
        if (!agreeConditions) {
            toast.error('Please agree to the terms and conditions', {
                position: toast.POSITION.TOP_LEFT,
            });
            return
        }
        const regex = new RegExp(Constants.CNIC_REGEXP);
        if (regex.test(cnic)) {
            data.cnic = cnic.replaceAll("-", "");
            console.log(data)
        }
        else {
            toast.error('CNIC is invalid', {
                position: toast.POSITION.TOP_LEFT,
            });
        }
    }

    useEffect(() => {
        const allErrors = Object.values(errors);
        allErrors.map((error) => (
            notifyError(error?.message)
        ))
    }, [errors]);

    const notifyError = (errorMessage: any) => {
        toast.error(errorMessage, {
            position: toast.POSITION.TOP_LEFT,
        });
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
                    fieldName='dateOfBirth' fieldType='date'
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

                {/* <InputField
                    fieldName='city' fieldType='text'
                    fieldTitle='City' fieldLabel={"Islamabad"}
                    register={register} /> */}

                {/* CNIC field */}
                <div className='w-full flex flex-col-reverse'>
                    <label htmlFor="firstName" className='text-zinc-500 text-xs font-normal font-LatoRegular uppercase tracking-[3.50px] pl-3 pt-0.5'>12345-6582314-2</label>
                    <input onChange={handleCNIC} type="text" placeholder="CNIC" className='placeholder:uppercase placeholder:font-LatoRegular placeholder:text-zinc-500 placeholder:text-base md:placeholder:text-lg focus:outline-0 focus:border-b focus:shadow-none border-b outline-0 shadow-none border-black w-full py-[5px] px-3 tracking-[3px]' value={cnic} />
                </div>

                <div className='w-full relative'>
                    <InputField
                        fieldName='password' fieldType={isShowPassword ? 'text' : 'password'}
                        fieldTitle='Password' fieldLabel={"Combination of alphanumerics & symbols"}
                        register={register} titleCase='capitalize' />
                    <div className='absolute top-2 my-auto right-2 cursor-pointer' onClick={() => setIsShowPassword(!isShowPassword)}>
                        {isShowPassword ? <ShowPassword /> : <HidePassword />}
                    </div>
                </div>
                <div className='w-full relative'>
                    <InputField
                        fieldName='confirmPassword' fieldType={isShowPassword ? 'text' : 'password'}
                        fieldTitle='Confirm Password' fieldLabel={"Combination of alphanumerics & symbols"}
                        register={register} titleCase='capitalize' />
                    <div className='absolute top-2 my-auto right-2 cursor-pointer' onClick={() => setIsShowPassword(!isShowPassword)}>
                        {isShowPassword ? <ShowPassword /> : <HidePassword />}
                    </div>
                </div>
            </div>
            <div className='w-3/4 mx-auto'>
                <div className='flex items-center gap-x-2'>
                    <input id='agreeTerms' type="checkbox" onChange={(e) => setAgreeConditions(!agreeConditions)} checked={agreeConditions} />
                    <label htmlFor='agreeTerms' className='text-zinc-500 text-xs font-normal font-LatoRegular capitalize tracking-[2px] my-7'>I agree to <span className='text-blue-600 cursor-pointer'>terms & conditions</span></label>
                </div>
                <Button className='w-full rounded-3xl bg-red-700 font-LatoBold uppercase tracking-[3.50px] hover:bg-red-800' type='submit'>Sign Up</Button>
            </div>
        </form>
    )
}

export default ClientSignupForm