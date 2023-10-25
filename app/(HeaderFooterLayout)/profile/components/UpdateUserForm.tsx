"use client"

import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { ZodType, z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Constants } from '@/globals/constants';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button'
import { useBBSelector } from '@/redux/store'
import { useDispatch } from 'react-redux'
import { axiosInstance as axios } from '@/app/axios-api/axios'
import { userUpdateDetailsUrl } from '@/app/axios-api/Endpoint'
import { updateUser } from '@/redux/features/authSlice'

interface UpdateUserData {
    firstName: string;
    lastName: string;
    email: string;
    dob: string;
    city: string;
    bloodGroup: string;
    contact: string;
    cnic: string;
}

interface UpdateUserFormProps {
    changeDetails: boolean;
    setChangeDetails: React.Dispatch<React.SetStateAction<boolean>>;
}

const UpdateUserForm = ({changeDetails, setChangeDetails}: UpdateUserFormProps) => {
    const dispatch = useDispatch();
    const today = new Date();
    const formattedDate = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;

    const schema: ZodType<UpdateUserData> = z.object({
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
    })

    const { register, handleSubmit, formState: { errors } } = useForm<UpdateUserData>({
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

    const SubmitData = (data: UpdateUserData) => {
        const url = userUpdateDetailsUrl();
        const changedFields = findDifferentKeys(data, user);
        const updateData = new FormData();
        changedFields.forEach((field) => {
            const value = data[field as keyof typeof data];
            updateData.append(field, value);
        });
        const isEmailChanged = changedFields.includes('email');

        if(changedFields.length === 0) {
            toast.error('Please Change any field to update')
            return;
        }

        axios.put(url, updateData, {
            withCredentials: true,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }).then((res) => {
            console.log(res)
            dispatch(updateUser({user: res.data.updated_user} as any))
            if(isEmailChanged) {
                toast.success('Changes Saved. Please Verify your new email address')
            }
            else {
                toast.success(res.data.message)
            }
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

    const user = useBBSelector(state => state.authReducer.value.user)
    return (
        <form onSubmit={handleSubmit(SubmitData)} className='w-full flex flex-col gap-y-2'>
            <div className='flex flex-col'>
                <label className='text-black font-RobotoMedium mb-0.5 ps-3 capitalize' htmlFor="firstName">First Name</label>
                {changeDetails ?
                    <input {...register("firstName")} className='bg-white rounded-3xl w-full py-2 px-3.5 focus:outline-0' type="text" /> :
                    <input value={user?.firstName!} className='bg-white rounded-3xl w-full py-2 px-3.5 focus:outline-0' type="text" readOnly />
                }
            </div>

            <div className='flex flex-col'>
                <label className='text-black font-RobotoMedium mb-0.5 ps-3 capitalize' htmlFor="lastName">Last Name</label>
                {changeDetails ?
                    <input {...register("lastName")} className='bg-white rounded-3xl w-full py-2 px-3.5 focus:outline-0' type="text" /> :
                    <input value={user?.lastName!} className='bg-white rounded-3xl w-full py-2 px-3.5 focus:outline-0' type="text" readOnly />
                }
            </div>

            <div className='flex flex-col'>
                <label className='text-black font-RobotoMedium mb-0.5 ps-3 capitalize' htmlFor="email">Email Address</label>
                {changeDetails ?
                    <input {...register("email")} className='bg-white rounded-3xl w-full py-2 px-3.5 focus:outline-0' type="email" /> :
                    <input value={user?.email!} className='bg-white rounded-3xl w-full py-2 px-3.5 focus:outline-0' type="email" readOnly />
                }
            </div>

            <div className='flex flex-col'>
                <label className='text-black font-RobotoMedium mb-0.5 ps-3 capitalize' htmlFor="dob">Date of Birth</label>
                {changeDetails ?
                    <input {...register("dob")} className='bg-white rounded-3xl w-full py-2 px-3.5 focus:outline-0' type="date" /> :
                    <input value={user?.dob!.substring(0, 10)} className='bg-white rounded-3xl w-full py-2 px-3.5 focus:outline-0' type="date" readOnly />
                }
            </div>

            <div className='flex flex-col'>
                <label className='text-black font-RobotoMedium mb-0.5 ps-3 capitalize' htmlFor="city">City</label>
                {changeDetails ?
                    <select className='bg-white rounded-3xl w-full py-2 px-3.5 focus:outline-0'
                        {...register("city")}>
                        <option value="">Select City</option>
                        <option value="Islamabad">Islamabad</option>
                        <option value="Rawalpindi">Rawalpindi</option>
                    </select> :
                    <select className='bg-white rounded-3xl w-full py-2 px-3.5 focus:outline-0'
                        value={user?.city!}>
                        <option value="">Select City</option>
                        <option value="Islamabad">Islamabad</option>
                        <option value="Rawalpindi">Rawalpindi</option>
                    </select>
                }
            </div>

            <div className='flex flex-col'>
                <label className='text-black font-RobotoMedium mb-0.5 ps-3 capitalize' htmlFor="bloodGroup">Blood Group</label>
                {changeDetails ?
                    <select className='bg-white rounded-3xl w-full py-2 px-3.5 focus:outline-0'
                        {...register("bloodGroup")}>
                        <option value="">Select Blood Group</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                    </select> :
                    <select className='bg-white rounded-3xl w-full py-2 px-3.5 focus:outline-0'
                        value={user?.bloodGroup!}>
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
                }
            </div>

            <div className='flex flex-col'>
                <label className='text-black font-RobotoMedium mb-0.5 ps-3 capitalize' htmlFor="contact">Contact No.</label>
                {changeDetails ?
                    <input {...register("contact")} className='bg-white rounded-3xl w-full py-2 px-3.5 focus:outline-0' type="text" /> :
                    <input value={user?.contact!} className='bg-white rounded-3xl w-full py-2 px-3.5 focus:outline-0' type="text" readOnly />
                }
            </div>

            <div className='flex flex-col'>
                <label className='text-black font-RobotoMedium mb-0.5 ps-3 uppercase' htmlFor="cnic">CNIC</label>
                {changeDetails ?
                    <input {...register("cnic")} className='bg-white rounded-3xl w-full py-2 px-3.5 focus:outline-0' type="text" /> :
                    <input value={user?.cnic!} className='bg-white rounded-3xl w-full py-2 px-3.5 focus:outline-0' type="text" readOnly />
                }
            </div>

            {changeDetails &&
                <Button type='submit' className='!w-max !rounded-3xl !bg-darkRed hover:!bg-red-800 mt-1 !h-auto !py-2 min-w-[150px] !text-base'>
                    Save Changes
                </Button>}
        </form>
    )
}

export default UpdateUserForm