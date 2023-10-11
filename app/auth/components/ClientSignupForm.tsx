"use client"
import React, { useState, useEffect, ChangeEvent } from 'react'
import InputField from '@/app/auth/components/inputField'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ZodType, z } from 'zod'
import { Constants } from '@/globals/constants'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'
import HidePassword from '@/globals/icons/hide-password'
import ShowPassword from '@/globals/icons/show-password'
import ValidatePassword from './ValidatePassword'
import { axiosInstance as axios } from '@/app/axios-api/axios'
import { registerUserUrl } from '@/app/axios-api/Endpoint'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation'

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
    const token = useParams();

    const [cnic, setCnic] = useState<string>('')
    const [isShowPassword, setIsShowPassword] = useState<boolean>(false)
    const [agreeConditions, setAgreeConditions] = useState<boolean>(false)
    const [password, setPassword] = useState<string>('')
    const [confirmPassword, setConfirmPassword] = useState<string>('')
    const [isPasswordValid, setIsPasswordValid] = useState<boolean>(false)

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
        contact: z.string().nonempty({ message: 'Contact is required' }).min(11, 'Contact must be at least 11 characters long').max(11, 'Contact must be at most 11 characters long'),
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

    const onValidatorChangeHandler = (result: boolean) => {
        if (result) {
            setIsPasswordValid(true)
        }
        else {
            setIsPasswordValid(false)
        }
    }

    const { push } = useRouter();

    const SubmitData = (data: SignupData) => {
        if (cnic.length === 0) {
            toast.error('CNIC is required');
            return
        }
        if (!agreeConditions) {
            toast.error('Please agree to the terms and conditions');
            return
        }
        if (!isPasswordValid) {
            toast.error('Password is invalid');
            return
        }
        const regex = new RegExp(Constants.CNIC_REGEXP);
        if (regex.test(cnic)) {
            data.cnic = cnic;
            data.password = password;
            console.log(data);
            const url = registerUserUrl();
            axios.post(url, data)
            .then((res: any) => {
                console.log(res);
                toast.success(res.data.message);
            })
            .catch((err: any) => {
                console.log(err);
                toast.error(err!.response!.data!.message!);
            })
        }
        else {
            toast.error('CNIC is invalid');
        }
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
                    <input onChange={handleCNIC} type="text" placeholder="CNIC" className='placeholder:uppercase placeholder:font-LatoRegular placeholder:text-zinc-500 placeholder:text-base md:placeholder:text-lg focus:outline-0 focus:border-b focus:shadow-none border-b outline-0 shadow-none border-black w-full py-[5px] px-3 tracking-[3px]' value={cnic} />
                </div>

                <div className='w-full relative'>
                    <div className='w-full flex flex-col-reverse'>
                        <label htmlFor="password" className='text-zinc-500 text-xs font-normal font-LatoRegular capitalize tracking-[3.50px] pl-3 pt-0.5'>Combination of alphanumerics & symbols</label>
                        <input onChange={(e) => setPassword(e.target.value)} type={isShowPassword ? 'text' : 'password'} placeholder="Password" className='placeholder:uppercase placeholder:font-LatoRegular placeholder:text-zinc-500 placeholder:text-base md:placeholder:text-lg focus:outline-0 focus:border-b focus:shadow-none border-b outline-0 shadow-none border-black w-full py-[5px] px-3 tracking-[3px]' value={password} id='password' />
                    </div>
                    <div className='absolute top-2 my-auto right-2 cursor-pointer' onClick={() => setIsShowPassword(!isShowPassword)}>
                        {isShowPassword ? <ShowPassword /> : <HidePassword />}
                    </div>
                </div>
                <div className='w-full relative'>
                    <div className='w-full flex flex-col-reverse'>
                        <label htmlFor="confirmPassword" className='text-zinc-500 text-xs font-normal font-LatoRegular capitalize tracking-[3.50px] pl-3 pt-0.5'>Combination of alphanumerics & symbols</label>
                        <input onChange={(e) => setConfirmPassword(e.target.value)} type={isShowPassword ? 'text' : 'password'} placeholder="Confirm Password" className='placeholder:uppercase placeholder:font-LatoRegular placeholder:text-zinc-500 placeholder:text-base md:placeholder:text-lg focus:outline-0 focus:border-b focus:shadow-none border-b outline-0 shadow-none border-black w-full py-[5px] px-3 tracking-[3px]' value={confirmPassword} id='confirmPassword' />
                    </div>
                    <div className='absolute top-2 my-auto right-2 cursor-pointer' onClick={() => setIsShowPassword(!isShowPassword)}>
                        {isShowPassword ? <ShowPassword /> : <HidePassword />}
                    </div>
                </div>

                <div className='w-full col-span-2'>
                    <ValidatePassword password={password} confirmPassword={confirmPassword} onValidatorChangeHandler={onValidatorChangeHandler} />
                </div>
            </div>
            <div className='w-3/4 mx-auto'>
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