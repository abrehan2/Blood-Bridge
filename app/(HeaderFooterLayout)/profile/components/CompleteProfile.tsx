"use client"

import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { completeProfile } from '@/redux/features/authSlice';
import { axiosInstance as axios } from '@/app/axios-api/axios';
import { BBProfileCompleteUrl } from '@/app/axios-api/Endpoint';
import toast from 'react-hot-toast';
import { X } from 'lucide-react';
import cx from 'classnames';
import { Button } from '@/components/ui/button';
import { ZodType, z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Label } from '@radix-ui/react-label';

interface completeProfileData {
    sector: string,
    city: string,
    address: string,
}

interface CompleteProfileProps {
    popup: boolean,
    setPopup: React.Dispatch<React.SetStateAction<boolean>>
}


const CompleteProfile = ({ popup, setPopup }: CompleteProfileProps) => {
    const dispatch = useDispatch();
    
    const islamabadSectors = ['D-12', 'E-7', 'E-8', 'E-9', 'E-10', 'E-11',
                            'F-5', 'F-6', 'F-7', 'F-8', 'F-9', 'F-10', 'F-11',
                            'G-5', 'G-6', 'G-7', 'G-8', 'G-9', 'G-10', 'G-11', 'G-12', 'G-13', 'G-14', 'G-15', 'G-16',
                            'H-8', 'H-9', 'H-11', 'H-13', 'H-14',
                            'I-8', 'I-9', 'I-10', 'I-11', 'I-13', 'I-14', 'I-15', 'I-16',]
    const handleCancel = () => {
        setPopup(false)
    }

    const schema: ZodType<completeProfileData> = z.object({
        city: z.string().nonempty({ message: 'City is required' }),
        sector: z.string().nonempty({ message: 'Sector is invalid' }),
        address: z.string().nonempty({ message: 'Address is required' }).min(10, { message: 'Address is too short' }),
    });

    const { register, handleSubmit, formState: { errors } } = useForm<completeProfileData>({
        resolver: zodResolver(schema)
    })

    const submitData = (data: completeProfileData) => {
        const url = BBProfileCompleteUrl();
        axios.post(url, data, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((res) => {
            dispatch(completeProfile())
            toast.success(res.data.message)
            setPopup(false)
        }).catch((err) => {
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
        <div className={cx('w-full h-full absolute left-0 top-0 z-10 bg-black bg-opacity-30 hidden items-center justify-center', { '!flex': popup })}>
            <div className='w-3/5 h-[65vh] bg-white rounded-3xl flex flex-col items-center justify-center relative gap-y-8'>
                <X className='absolute top-2.5 right-2.5 cursor-pointer' size={20} color='#000' onClick={handleCancel} />
                <h1 className='text-xl font-RobotoBold'>Complete Your Profile</h1>
                <form onSubmit={handleSubmit(submitData)} className='w-full flex flex-col items-center'>
                    <div className='w-1/2 flex flex-col gap-y-2.5'>
                        <div className='flex flex-col gap-y-1.5'>
                            <Label className='font-RobotoBold'>City</Label>
                            <select className='bg-slate-100 rounded-[5px] w-full py-2 px-3.5 focus:outline-0'
                                {...register("city")}>
                                <option value="">Select City</option>
                                <option value="Islamabad">Islamabad</option>
                            </select>
                        </div>
                        <div className='flex flex-col gap-y-1.5'>
                            <Label className='font-RobotoBold'>Area/Sector</Label>
                            <select className='bg-slate-100 rounded-[5px] w-full py-2 px-3.5 focus:outline-0'
                                {...register("sector")}>
                                <option value="">Select Area/Sector</option>
                                {islamabadSectors.map((sector) => (
                                    <option key={sector} value={sector.toLocaleLowerCase()}>{sector}</option>
                                ))}
                            </select>
                        </div>
                        <div className='flex flex-col gap-y-1.5'>
                            <Label className='font-RobotoBold'>Address</Label>
                            <input {...register("address")} className='bg-slate-100 rounded-[5px] w-full py-2 px-3.5 focus:outline-0' type="text" />
                        </div>
                    </div>
                    <Button type='submit' className='!w-max !rounded-3xl !bg-darkRed hover:!bg-red-800 mt-6 !h-auto !py-1.5 min-w-[110px] !text-sm'>
                        Update
                    </Button>
                </form>
            </div>
        </div>
    )
}

export default CompleteProfile