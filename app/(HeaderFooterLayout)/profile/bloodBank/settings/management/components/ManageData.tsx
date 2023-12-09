"use client"
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import cx from 'classnames'
import Image from 'next/image'
import { useBBSelector } from '@/redux/store'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { ChevronLeft, UploadCloud, X } from 'lucide-react'
import { 
    bloodBankUpdateDetailsUrl, 
    bloodBankUpdatePasswordUrl, 
    deactivateBloodBankUrl 
} from '@/app/axios-api/Endpoint'
import { axiosInstance as axios } from '@/app/axios-api/axios'
import toast from 'react-hot-toast'
import { FileUpload } from '@/app/components/FileUpload'
import { notFound, updateUser } from '@/redux/features/authSlice'
import { ZodType, z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import UpdateUserPassword from '@/app/(HeaderFooterLayout)/profile/components/UpdateUserPassword'
import { useRouter } from 'next/navigation'

interface UpdateBloodBankData {
    name: string;
    email: string;
}

const UserData = () => {
    const dispatch = useDispatch()
    const { push } = useRouter()
    const bloodBank = useBBSelector(state => state.authReducer.value.user)
    const [isShowUpload, setIsShowUplaod] = useState<boolean>(false);
    const [changeDetails, setChangeDetails] = useState<boolean>(false)
    const [changeProfilePic, setChangeProfilePic] = useState<boolean>(false)

    const handleUpload = () => {
        setChangeProfilePic(true)
    };

    const handleUploadBtnClick = () => {
        setIsShowUplaod(true)
    };

    const handleImageChange = (url?: string) => {
        const apiUrl = bloodBankUpdateDetailsUrl();
        axios.put(apiUrl, { avatar: url }, {
            withCredentials: true,
            headers: {
                "Content-Type": ["multipart/form-data"]
            }
        }).then((res) => {
            dispatch(updateUser({ user: res.data.updated_bloodBank } as any))
            toast.success("Profile Picture Changed Successfully")
            setIsShowUplaod(false)
        }).catch((err) => {
            toast.error(err.response.data.message)
            setIsShowUplaod(false)
        })
    }

    const handleCancel = () => {
        setIsShowUplaod(false)
    }

    const schema: ZodType<UpdateBloodBankData> = z.object({
        name: z.string().nonempty({ message: 'Name is required' }).min(3, 'Name must be at least 3 characters long'),
        email: z.string().email({ message: 'Email is invalid' }),
    });

    const { register, handleSubmit, formState: { errors } } = useForm<UpdateBloodBankData>({
        resolver: zodResolver(schema)
    })

    const findDifferentKeys = (obj1: any, obj2: any) => {
        const differentKeys: string[] = [];

        for (const key in obj1) {
            if (key === 'dob') {
                if (obj1[key].substring(0, 10) != obj2[key].substring(0, 10)) {
                    differentKeys.push(key);
                }
                continue;
            }
            if (obj1[key] !== obj2[key]) {
                differentKeys.push(key);
            }
        }

        return differentKeys;
    };

    const SubmitData = (data: UpdateBloodBankData) => {
        const url = bloodBankUpdateDetailsUrl();
        const changedFields = findDifferentKeys(data, bloodBank);
        const updateData = new FormData();
        changedFields.forEach((field) => {
            const value = data[field as keyof typeof data];
            updateData.append(field, value);
        });
        const isEmailChanged = changedFields.includes('email');

        if (changedFields.length === 0) {
            toast.error('Please Change any field to update')
            return;
        }

        axios.put(url, updateData, {
            withCredentials: true,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }).then((res) => {
            if (isEmailChanged) {
                toast.success('Changes Saved. Please Verify your new email address')
            }
            else {
                toast.success(res.data.message)
            }
            dispatch(updateUser({ user: res.data.updated_bloodBank } as any))
            setChangeDetails(false)
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

    const passUpdateUrl = bloodBankUpdatePasswordUrl();
    
    const handleDeactivate = () => {
        const deactivateBBUrl = deactivateBloodBankUrl();
        axios.put(deactivateBBUrl, {}, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((res) => {
            toast.success(res.data.message)
            dispatch(notFound())
            push('/')
        }).catch((err) => {
            toast.error(err.response.data.message)
        })
    }

    const changeActiveStatus = () => {
        if(changeDetails) {
            const Astatus = bloodBank?.status === 'close' ? 'open' : 'close'
            const url = bloodBankUpdateDetailsUrl();
            const updateData = new FormData();
            updateData.append('status', Astatus);
            axios.put(url, updateData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }).then((res) => {
                toast.success(res.data.message)
                dispatch(updateUser({ user: res.data.updated_bloodBank } as any))
            }).catch((err) => {
                toast.error(err.response.data.message)
            })
        }
    }

    return (
        <>
            <div className={cx('w-full h-full absolute left-0 top-0 z-10 bg-black bg-opacity-30 hidden items-center justify-center', { '!flex': isShowUpload })}>
                <div className='w-3/5 h-[60vh] bg-white rounded-3xl flex items-center justify-center relative'>
                    <X className='absolute top-2.5 right-2.5 cursor-pointer' size={20} color='#000' onClick={handleCancel} />
                    <FileUpload onChange={handleImageChange} value='abc' endpoint='serverImage' />
                </div>
            </div>
            {changeProfilePic ? <>
                <h1 className='text-lg font-RobotoBold pt-1'>Blood Bank Management</h1>
                <ChevronLeft size={22} className='mt-1.5 cursor-pointer relative -left-1.5' onClick={() => setChangeProfilePic(false)} />
                <div className='w-full flex flex-col items-center gap-y-2 my-1.5'>
                    <Image src={bloodBank?.avatar} alt='Profile' className='!w-[186px] !h-[186px] object-cover rounded-full' width={186} height={186} />
                    <div className='p-1.5 rounded-[5px]'>
                        <UploadCloud strokeWidth={3} size={32} />
                    </div>
                    <p className='text text-slate-950 text-opacity-80 font-LatoRegular'>To upload photo, click on Upload</p>
                    <Button type='submit' className='!w-max !rounded-[5px] !bg-darkRed hover:!bg-red-800 mt-1.5 !h-auto !py-1.5 min-w-[80px] !text-sm mb-2' onClick={handleUploadBtnClick}>
                        Upload
                    </Button>
                </div>
            </> : <>
                <div className='relative'>
                    {!changeDetails &&
                        <span className='absolute top-10 left-0 w-max rounded-3xl bg-darkRed hover:bg-red-800 px-4 py-0.5 text-sm text-white text-center cursor-pointer' onClick={() => setChangeDetails(true)}>Edit</span>
                    }
                </div>
                <div className='flex justify-between'>
                    <h1 className='text-lg font-RobotoBold pt-1'>Blood Bank Management</h1>
                    <div className='relative group' onClick={handleUpload}>
                        <Image src={bloodBank?.avatar} alt='Profile' className='!w-[75px] !h-[75px] object-cover rounded-full' width={75} height={75} />
                        <div className='hidden group-hover:flex absolute top-0 left-0 w-full h-full bg-zinc-100 bg-opacity-80 rounded-full flex-col items-center justify-center group-hover:cursor-pointer'>
                            <UploadCloud strokeWidth={3} size={32} />
                        </div>
                    </div>
                </div>
                <div className='w-full min-h-[55vh] pr-2 pt-1 pb-3'>
                    <div className='flex items-center gap-x-1.5'>
                        <Switch checked={bloodBank?.status === 'open'} onCheckedChange={changeActiveStatus} id='ativeStatus' className='data-[state=checked]:!bg-green-500' />
                        <Label htmlFor='activeStatus'>Active Status</Label>
                    </div>
                    <Accordion type="single" collapsible>
                        <AccordionItem value="Profile" className='!border-b-2 !border-slate-950 !border-opacity-60'>
                            <AccordionTrigger className='hover:!no-underline !py-2'>
                                <div className='flex flex-col items-start'>
                                    <h1 className='font-RobotoBold pt-1'>Profile</h1>
                                    <p className='text-sm text-slate-950 text-opacity-50 font-LatoRegular'>Name, Email Address</p>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <form onSubmit={handleSubmit(SubmitData)}>
                                    <div className='flex flex-col gap-y-2.5'>

                                        {changeDetails ?
                                            <input {...register("name", {
                                                value: bloodBank?.name,
                                            })} className='bg-white rounded-[5px] w-full py-2 px-3.5 focus:outline-0' type="text" /> :
                                            <input value={bloodBank?.name!} className='bg-white rounded-[5px] w-full py-2 px-3.5 focus:outline-0' type="text" readOnly />
                                        }
                                        {changeDetails ?
                                            <input {...register("email", {
                                                value: bloodBank?.email,
                                            })} className='bg-white rounded-[5px] w-full py-2 px-3.5 focus:outline-0' type="text" /> :
                                            <input value={bloodBank?.email!} className='bg-white rounded-[5px] w-full py-2 px-3.5 focus:outline-0' type="text" readOnly />
                                        }
                                    </div>
                                    {changeDetails &&
                                        <Button type='submit' className='!w-max !rounded-3xl !bg-darkRed hover:!bg-red-800 mt-3 !h-auto !py-1.5 min-w-[110px] !text-sm'>
                                            Update
                                        </Button>
                                    }
                                </form>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="Password" className='!border-b-2 !border-slate-950 !border-opacity-60'>
                            <AccordionTrigger className='hover:!no-underline !py-2'>
                                <div className='flex flex-col items-start'>
                                    <h1 className='font-RobotoBold pt-1'>Password</h1>
                                    <p className='text text-slate-950 text-opacity-50 font-LatoRegular'>* * * * * * * * * * *</p>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <UpdateUserPassword changeDetails={changeDetails} setChangeDetails={setChangeDetails} url={passUpdateUrl} isForBloodBank={true} />
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="LicenseNo" className='!border-b-2 !border-slate-950 !border-opacity-60'>
                            <AccordionTrigger className='hover:!no-underline !py-2'>
                                <div className='flex flex-col items-start'>
                                    <h1 className='font-RobotoBold pt-1'>License No.</h1>
                                    <p className='text text-slate-950 text-opacity-50 font-LatoRegular'>License Number</p>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                Your license number is <strong>{bloodBank?.licenseNo}</strong>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="Deactivate" className='!border-b-2 !border-slate-950 !border-opacity-60'>
                            <AccordionTrigger className='hover:!no-underline !py-2'>
                                <div className='flex flex-col items-start'>
                                    <h1 className='font-RobotoBold pt-1'>Deactivate Account</h1>
                                    <p className='text text-slate-950 text-opacity-50 font-LatoRegular'>if you no longer want to use this account</p>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <Button type='submit' className='!w-max !rounded-3xl !bg-darkRed hover:!bg-red-800 mt-3 !h-auto !py-1.5 min-w-[110px] !text-sm' onClick={handleDeactivate}>
                                    Deactivate
                                </Button>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            </>}
        </>
    )
}

export default UserData