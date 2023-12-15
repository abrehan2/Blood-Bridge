"use client"
import React, { useEffect } from 'react'
import shadow from '@/app/components/shadow.module.css'
import { Constants } from '@/globals/constants'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { ZodType, z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-hot-toast'
import { useBBSelector } from '@/redux/store'
import { addBloodGroup } from '@/app/axios-api/Endpoint'
import { axiosInstance as axios } from '@/app/axios-api/axios'

interface BloodGroupForm {
    bloodGroup: string,
    stock: number,
    bloodBankId?: string,
}

const BloodGroupForm = () => {
    const bloodBank = useBBSelector(state => state.authReducer.value.user);
    const schema: ZodType<BloodGroupForm> = z.object({
        bloodGroup: z.string().min(1, "Blood group is required"),
        stock: z.number().positive("Stock must be greater than 0").min(1, "Stock is required"),
    })

    const { register, handleSubmit, formState: { errors } } = useForm<BloodGroupForm>({
        resolver: zodResolver(schema)
    })

    const submitData = (data: BloodGroupForm) => {
        data.bloodBankId = bloodBank?._id
        const url = addBloodGroup();
        axios.post(url, data, {
            withCredentials: true,
        }).then((res) => {
            toast.success(res.data.message);
        }).catch((err) => {
            toast.error(err.response.data.message);
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
        <div className={`bg-white rounded-3xl w-3/5 min-h-[50vh] px-8 flex flex-col justify-center ${shadow.lightShadow}`}>
            <h1 className='text-xl font-DMSansSemiBold mb-3'>Add new blood type</h1>
            <form onSubmit={handleSubmit(submitData)} className='flex flex-col gap-y-3 w-full'>
                <div className='flex flex-col gap-y-1.5'>
                    <Label htmlFor="bloodGroup" className="block font-DMSansSemiBold text-gray-700">
                        Blood Group
                    </Label>
                    <select className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none" {...register('bloodGroup')}>
                        <option value="">Select Blood Group</option>
                        {Constants.bloodGroups.map((bloodGroup) => (
                            <option key={bloodGroup} value={bloodGroup}>
                                {bloodGroup}
                            </option>
                        ))}
                    </select>
                </div>
                <div className='flex flex-col gap-y-1.5'>
                    <Label htmlFor="bloodGroup" className="block font-DMSansSemiBold text-gray-700">
                        Stock
                    </Label>
                    <input type='number' className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none" defaultValue={0} {...register('stock', {
                        valueAsNumber: true,
                    })}/>
                </div>
                <div className='w-full flex justify-end mt-3.5'>
                    <Button className='!h-auto !font-RobotoRegular !text-white !bg-darkRed hover:!bg-red-800 !rounded-[48px] !text-lg !pb-1.5 !pt-1 !px-4 w-max'>Create Type</Button>
                </div>
            </form>
        </div>
    )
}

export default BloodGroupForm