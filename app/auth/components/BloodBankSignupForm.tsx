"use client"
import React, { useState, useEffect, ChangeEvent } from 'react'
import InputField from '@/app/auth/components/inputField'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ZodType, z } from 'zod'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'
import HidePassword from '@/globals/icons/hide-password'
import ShowPassword from '@/globals/icons/show-password'
import ValidatePassword from './ValidatePassword'
import { axiosInstance as axios } from '@/app/axios-api/axios'
import cx from 'classnames'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation'
import { registerBloodBankUrl } from '@/app/axios-api/Endpoint'

export interface BloodBankSignupData {
    name: string;
    email: string;
    licenseNo: string;
    city: string;
    address: string;
    password?: string;
    confirmPassword?: string;
}

export type BloodBankfieldTypes = "email" | "password" | "name" | "address" | "licenseNo" | "confirmPassword";

const BloodBankSignupForm = () => {
    const token = useParams();

    const [isShowPassword, setIsShowPassword] = useState<boolean>(false)
    const [agreeConditions, setAgreeConditions] = useState<boolean>(false)
    const [password, setPassword] = useState<string>('')
    const [confirmPassword, setConfirmPassword] = useState<string>('')
    const [isPasswordValid, setIsPasswordValid] = useState<boolean>(false)

    const schema: ZodType<BloodBankSignupData> = z.object({
        name: z.string().nonempty({ message: 'First Name is required' }).min(3, 'First Name must be at least 3 characters long'),
        licenseNo: z.string().nonempty({ message: 'License Number is required' }),
        email: z.string().email({ message: 'Email is invalid' }),
        address: z.string().nonempty('Address is Required').min(5, 'Address must be at least 5 characters long').max(100, 'Address must be at most 100 characters long'),
        city: z.string().nonempty({ message: 'City is required' }),
    })

    const { register, handleSubmit, formState: { errors } } = useForm<BloodBankSignupData>({
        resolver: zodResolver(schema)
    })

    const onValidatorChangeHandler = (result: boolean) => {
        if (result) {
            setIsPasswordValid(true)
        }
        else {
            setIsPasswordValid(false)
        }
    }

    const { push } = useRouter();

    const SubmitData = (data: BloodBankSignupData) => {
        if (!agreeConditions) {
            toast.error('Please agree to the terms and conditions');
            return
        }
        if (!isPasswordValid) {
            toast.error('Password is invalid');
            return
        }
        data.password = password;
        console.log(data);
        const url = registerBloodBankUrl();
        axios.post(url, data)
            .then((res) => {
                toast.success(res.data.message);
            })
            .catch((err) => {
                console.log(err);
                toast.error(err.response.data.error);
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
                    fieldName='name' fieldType='text'
                    fieldTitle='Blood Bank' fieldLabel={"lifestream blood bank"}
                    register={register} isError={errors?.name && true}/>
                <InputField
                    fieldName='email' fieldType='email'
                    fieldTitle='Email' fieldLabel={"aliakbar@gmail.com"}
                    register={register} titleCase='lowercase' isError={errors?.email && true} />
                <InputField
                    fieldName='licenseNo' fieldType='text'
                    fieldTitle='License Number' fieldLabel={"bb-2032-13-001"}
                    register={register} titleCase='lowercase' isError={errors?.licenseNo && true} />
                
                <div className='w-full flex flex-col-reverse'>
                    <label htmlFor="firstName" className='text-zinc-500 text-xs font-normal font-LatoRegular uppercase tracking-[3.50px] pl-3 pt-0.5'>Islamabad</label>
                    <select className={cx('focus:outline-0 focus:border-b focus:shadow-none border-b outline-0 shadow-none border-black w-full py-[5px] px-3 tracking-[3px]', {'!border-red-500': errors?.city ? true : false})} {...register("city")}>
                        <option value="">Select City</option>
                        <option value="Islamabad">Islamabad</option>
                        <option value="Rawalpindi">Rawalpindi</option>
                    </select>
                </div>

                <InputField
                    fieldName='address' fieldType='text'
                    fieldTitle='Address' fieldLabel={"123 Main St, any street, 12345"}
                    register={register} titleCase='capitalize' isError={errors?.address && true}/>

                <div className='w-full relative'>
                    <div className='w-full flex flex-col-reverse'>
                        <label htmlFor="password" className='text-zinc-500 text-xs font-normal font-LatoRegular capitalize tracking-[3.50px] pl-3 pt-0.5'>Combination of alphanumerics & symbols</label>
                        <input onChange={(e) => setPassword(e.target.value)} type={isShowPassword ? 'text' : 'password'} placeholder="Password" className={cx('placeholder:uppercase placeholder:font-LatoRegular placeholder:text-zinc-500 placeholder:text-base md:placeholder:text-lg focus:outline-0 focus:border-b focus:shadow-none border-b outline-0 shadow-none border-black w-full py-[5px] px-3 tracking-[3px]')} value={password} id='password' />
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

                <p className='text-zinc-500 text-xs font-normal font-LatoRegular capitalize tracking-[2px] mt-4'>already have an account? <Link href={'/auth/signIn/?view=BloodBank'} className='text-blue-600 cursor-pointer'>Sign In</Link></p>
            </div>
        </form>
    )
}

export default BloodBankSignupForm