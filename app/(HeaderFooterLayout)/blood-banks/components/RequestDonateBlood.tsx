"use client"

import React, { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import Image from 'next/image'
import mainImg from '@/assets/blood-request-main.png'
import mainDonationImg from '@/assets/blood-donation-main.png'
import { Label } from '@/components/ui/label'
import { z, ZodType } from 'zod'
import { Constants } from '@/globals/constants'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { donateBloodUrl, requestBloodUrl, viewSpecificBloodBank } from '@/app/axios-api/Endpoint'
import { axiosInstance as axios } from '@/app/axios-api/axios'
import { useBBSelector } from '@/redux/store'

interface RequestBloodProps {
    name?: string,
    contact?: string,
    bloodBank?: string,
    disease?: string,
    bloodBags?: number,
    age?: number,
    bloodGroup: string,
    bloodNeededOn: string,
    donationDate?: string,
    receivedBlood?: string[],
}

interface RequestDonateBloodProps {
    bloodBankId: string | string[] | undefined,
    callType: "request" | "donate",
}

const RequestDonateBlood = ({ bloodBankId, callType }: RequestDonateBloodProps) => {
    const [bloodBankOpen, setBloodBankOpen] = useState<any>(null)
    const [bloodBags, setBloodBags] = useState<any>(0)
    const user = useBBSelector((state) => state.authReducer.value.user)

    const isRequest = callType === "request" ? true : false;

    useEffect(() => {
        const url = viewSpecificBloodBank() + `${bloodBankId}`;
        axios.get(url, {
            withCredentials: true,
        }).then((res) => {
            setBloodBankOpen(res.data.bloodBank);
        }).catch((err) => {
            console.log(err);
            toast.error(err.response.data.message);
        })
    }, [])

    const schema: ZodType<RequestBloodProps> = z.object({
        bloodGroup: z.string().min(1, { message: 'Blood Group is required' }),
        bloodBags: z.number().refine((value) => !isNaN(value) && (Number(value) < 4 && Number(value) > 0), {
            message: 'No of selected blood bags must be in range 1-3',
        }).optional(),
        bloodNeededOn: z.string().min(1, { message: 'Selection of date is required' }),
        age: z.number().positive("Your must be atleast 18 years old to donate").min(18, { message: 'Your must be atleast 18 years old to donate' }).optional(),
        receivedBlood: z.array(z.string()).optional(),
        disease: z.string().optional(),
    })

    const { handleSubmit, register, formState: { errors } } = useForm<RequestBloodProps>({
        resolver: zodResolver(schema),
    })

    const submitForm = (data: RequestBloodProps) => {
        if (isRequest) {
            if (bloodBankOpen.giveBlood === "true") {
                if (data.receivedBlood?.length !== data.bloodBags) {
                    toast.error("You must provide blood groups in exchange in same quantity as requested blood bags")
                    return;
                }
            }

            // check if selected bloodgroup quantity is greater than requested blood bags
            const bloodGroup = bloodBankOpen?.bloodGroups.find((bloodGroup: any) => bloodGroup.bloodGroup === data.bloodGroup)
            if (bloodGroup?.stock < data?.bloodBags!) {
                toast.error("Requested Blood Bags are not available, please select less quantity")
                return;
            }

            if (data?.receivedBlood && data?.receivedBlood.every((bloodGroup) => bloodGroup !== "")) {

            } else {
                toast.error("Please select blood groups in exchange")
                return;
            }
        } else {
            if (data?.disease === "") {
                data.disease = "n/a";
            }
        }

        data.contact = user?.contact;
        data.name = user?.firstName + " " + user?.lastName;
        data.bloodBank = bloodBankOpen?.name;

        if (!isRequest) {
            data.donationDate = data.bloodNeededOn;
        }

        const url = isRequest ? requestBloodUrl() : donateBloodUrl();
        axios.post(url, data, {
            withCredentials: true,
        }).then((res) => {
            console.log(res);
            toast.success(res.data.message);
        }
        ).catch((err) => {
            console.log(err);
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

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfterTomorrow = new Date(today);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);

    return (
        <div className='w-full my-6'>
            <div className='w-full'>
                <Image src={isRequest ? mainImg: mainDonationImg} alt='Blood Request Image' className='w-full object-contain' />
                <div className='w-full px-[8%]'>
                    <h1 className='mt-8 mb-6 text-black text-2xl font-PlayfairDisplayBold'>{isRequest ? 'Need Blood?' : 'Donate Blood!'}</h1>
                    <div className='w-full flex items-start gap-x-[9%]'>
                        <div className='w-full'>
                            <form onSubmit={handleSubmit(submitForm)} className='flex flex-col gap-y-3'>
                                <div className='flex flex-col gap-y-1'>
                                    <Label className='!font-LatoMedium font-medium pl-1'>Name</Label>
                                    <input type='text' className='w-full focus:outline-0 outline-0 rounded-2xl bg-stone-200 py-1.5 px-3 text-black bg-opacity-60 text-opacity-80' value={user?.firstName + " " + user?.lastName} readOnly />
                                </div>
                                <div className='flex flex-col gap-y-1'>
                                    <Label className='!font-LatoMedium font-medium pl-1'>Contact</Label>
                                    <input type='text' className='w-full focus:outline-0 outline-0 rounded-2xl bg-stone-200 py-1.5 px-3 text-black bg-opacity-60 text-opacity-80' value={user?.contact} readOnly />
                                </div>
                                <div className='flex flex-col gap-y-1'>
                                    <Label className='!font-LatoMedium font-medium pl-1'>Blood Bank</Label>
                                    <input type='text' className='w-full focus:outline-0 outline-0 rounded-2xl bg-stone-200 py-1.5 px-3 text-black bg-opacity-60 text-opacity-80' value={bloodBankOpen?.name} readOnly />
                                </div>
                                <div className='flex flex-col gap-y-1'>
                                    <Label className='!font-LatoMedium font-medium pl-1'>Blood Type</Label>
                                    <select className={`w-full focus:outline-0 outline-0 rounded-2xl bg-stone-200 py-1.5 px-3`} {...register("bloodGroup")}>
                                        <option value=''>{isRequest ? 'Select Blood Group' : 'your blood type'}</option>
                                        {bloodBankOpen?.bloodGroups.map((BG_Data: any, index: number) => (
                                            <option key={index} value={BG_Data.bloodGroup}>{BG_Data.bloodGroup}</option>
                                        ))}
                                    </select>
                                </div>
                                {isRequest &&
                                    <div className='flex flex-col gap-y-1'>
                                        <Label className='!font-LatoMedium font-medium pl-1'>Blood Bags</Label>
                                        <input type='number' className='w-full focus:outline-0 outline-0 rounded-2xl bg-stone-200 py-1.5 px-3' value={bloodBags} {...register("bloodBags", {
                                            valueAsNumber: true,
                                            onChange: (e) => {
                                                if (e.target.value === "" || e.target.value < 0) {
                                                    e.target.value = "0";
                                                }
                                                if (Number(e.target.value) > 3) {
                                                    e.target.value = "3";
                                                }
                                                setBloodBags(e.target.value);
                                            }
                                        })} />
                                    </div>
                                }
                                {!isRequest &&
                                    <>
                                        <div className='flex flex-col gap-y-1'>
                                            <Label className='!font-LatoMedium font-medium pl-1'>Age</Label>
                                            <input type="number" className={`w-full focus:outline-0 outline-0 rounded-2xl bg-stone-200 py-1.5 px-3`} defaultValue={'0'} {...register("age", {
                                                valueAsNumber: true,
                                                onChange: (e) => {
                                                    if (e.target.value === "" || e.target.value < 0) {
                                                        e.target.value = "0";
                                                    }
                                                }
                                            })} />
                                        </div>
                                        <div className='flex flex-col gap-y-1'>
                                            <Label className='!font-LatoMedium font-medium pl-1'>Disease (if any)</Label>
                                            <input type="text" className={`w-full focus:outline-0 outline-0 rounded-2xl bg-stone-200 py-1.5 px-3`} {...register("disease")} />
                                        </div>
                                    </>
                                }
                                <div className='flex flex-col gap-y-1'>
                                    <Label className='!font-LatoMedium font-medium pl-1'>{isRequest ? 'Blood Needed On' : 'Donate On (Availability)'}</Label>
                                    <select className='w-full focus:outline-0 outline-0 rounded-2xl bg-stone-200 py-1.5 px-3' {...register("bloodNeededOn")} >
                                        <option value=''>Select Date</option>
                                        <option value={`${today.toLocaleDateString()}`}>{today.toDateString()}</option>
                                        <option value={`${tomorrow.toLocaleDateString()}`}>{tomorrow.toDateString()}</option>
                                        <option value={`${dayAfterTomorrow.toLocaleDateString()}`}>{dayAfterTomorrow.toDateString()}</option>
                                    </select>
                                </div>
                                {(isRequest && bloodBankOpen?.giveBlood === "true") &&
                                    <div className='grid grid-cols-3 gap-y-2 gap-x-2.5'>
                                        {
                                            //make array of length bloodBags and ask it
                                            Array.from({ length: bloodBags }, () => 0).map((_, index) => (
                                                <div key={index} className='flex flex-col gap-y-1.5'>
                                                    <Label className='!font-LatoMedium font-medium pl-1'>Exchange Type {index + 1}</Label>
                                                    <select className='w-full focus:outline-0 outline-0 rounded-2xl bg-stone-200 py-1.5 px-3' {...register(`receivedBlood.${index}`)} >
                                                        <option value=''>Select</option>
                                                        {Constants.bloodGroups.map((bloodGroup: string, index: number) => (
                                                            <option key={index} value={bloodGroup}>{bloodGroup}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            ))
                                        }
                                    </div>
                                }
                                <div>
                                    <Button variant={'outline'} className='!py-1 !pr-0 !h-auto !rounded-full !border-2 !border-[#AA2D30] !bg-[#AA2D30] !text-white w-full font-LatoMedium focus:!ring-0 text-sm md:text-base lg:text-lg !pl-1 mt-2.5'>{isRequest ? 'Place Request' : 'Donate'}</Button>
                                </div>
                            </form>
                        </div>
                        <div className='w-full'>
                            <h1 className='text-[28px] font-LatoBold !font-semibold'>{isRequest ? 'Need Blood Urgently?' : 'Donate Blood Toady!'}</h1>
                            <h3 className='text-xl font-LatoBold !font-semibold mt-3'>{bloodBankOpen?.name}</h3>
                            <p className='font-LatoRegular mt-3 mb-4'>We're Here to Help!</p>
                            {!isRequest ?
                                <p className='font-LatoRegular'>
                                    If you're looking to donate blood, we're here to help you. To address urgent blood requirements, please reach out to us by dialing our Unified Access Number (UAN). Alternatively, you can request a callback from our team to swiftly connect with you on your blood donation call. Your well-being is our priority, and we believe that by donating your blood you can remain in good health.</p> :
                                <p className='font-LatoRegular'>
                                    If you find yourself in a critical need for blood, we're here to offer our support. To address urgent blood requirements, please reach out to us by dialing our Unified Access Number (UAN). Alternatively, you can request a callback from our team to swiftly connect you with the assistance you require during emergencies. Your well-being is our priority, and we're committed to being there for you when you need it the most.</p>
                            }
                            <div className='flex items-center gap-x-2.5 mt-4'>
                                <h3 className='text-lg font-LatoBold !font-semibold'>Call us:</h3>
                                <h3 className='text-lg font-LatoBold !font-semibold'>{bloodBankOpen?.contact}</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RequestDonateBlood