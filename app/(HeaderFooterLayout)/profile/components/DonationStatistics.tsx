"use client"

import React, { useState, useEffect } from 'react'
import shadow from '@/app/components/shadow.module.css'
import { axiosInstance as axios } from '@/app/axios-api/axios'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { BBUpdateDonationStatus, BBgetAllBloodDonations } from '@/app/axios-api/Endpoint'
import toast from 'react-hot-toast'

const DonationStatistics = () => {
    const [bloodDonations, setbloodDonations] = useState<any[]>()

    useEffect(() => {
        const url = BBgetAllBloodDonations();
        axios.get(url, {
            withCredentials: true
        }).then(res => {
            setbloodDonations(res.data.bloodDonations)
        }).catch(err => {
            toast.error(err.response.data.message)
            console.log(err)
        })
    }, [])

    const handleUpdateStatus = (value: string, index: number) => {
        if(value === '') {
            return
        }
        const url = BBUpdateDonationStatus() + `${bloodDonations?.[index]._id}`;
        axios.put(url, {status: value, message: ''}, {
            withCredentials: true
        }).then(res => {
            toast.success("Status Updated Successfully")
            setbloodDonations(prev => {
                let updatedRequests = [...prev!]
                updatedRequests[index].donationStatus = value as string
                return updatedRequests
            })
        }).catch(err => {
            console.log(err)
            toast.error(err.response.data.message)
        })
    }
    return (
        <div className='w-full'>
            <div className='w-full flex gap-x-7 items-center'>
                <div className='py-3 px-4 rounded-xl bg-[#20283E] min-w-[155px]'>
                    <h3 className='font-PlayfairDisplayBold capitalize text-white text-lg leading-5'>Total Donations</h3>
                    <h3 className='font-PlayfairDisplayBold capitalize text-white text-lg leading-5'>{bloodDonations?.length}</h3>
                </div>
                <div className='py-3 px-4 rounded-xl bg-[#0A5620] min-w-[155px]'>
                    <h3 className='font-PlayfairDisplayBold capitalize text-white text-lg leading-5'>Completed</h3>
                    <h3 className='font-PlayfairDisplayBold capitalize text-white text-lg leading-5'>{bloodDonations?.filter((donation) => donation.donationStatus === 'Completed').length}</h3>
                </div>
                <div className='py-3 px-4 rounded-xl bg-[#B3C100] min-w-[155px]'>
                    <h3 className='font-PlayfairDisplayBold capitalize text-white text-lg leading-5'>Pending</h3>
                    <h3 className='font-PlayfairDisplayBold capitalize text-white text-lg leading-5'>{bloodDonations?.filter((donation) => donation.donationStatus === 'Pending').length}</h3>
                </div>
                <div className='py-3 px-4 rounded-xl bg-[#AC3E31] min-w-[155px]'>
                    <h3 className='font-PlayfairDisplayBold capitalize text-white text-lg leading-5'>Rejected</h3>
                    <h3 className='font-PlayfairDisplayBold capitalize text-white text-lg leading-5'>{bloodDonations?.filter((donation) => donation.donationStatus === 'Rejected').length}</h3>
                </div>
            </div>

            <div className={`bg-white w-full py-4 px-2.5 mt-4 rounded-lg ${shadow.lightShadow}`}>
                <p className='font-DMSansSemiBold text-slate-900 capitalize pb-1.5'>List of Blood Donations</p>
                <Table className='!rounded-lg overflow-hidden'>
                    <TableHeader>
                        <TableRow>
                            <TableHead className='!px-3 !py-1.5 w-[50px] bg-slate-50 !border !border-black !border-opacity-10 !h-auto !font-DMSansMedium'></TableHead>
                            <TableHead className='!px-3 !py-1.5 bg-slate-50 !border !border-black !border-opacity-10 !h-auto !font-DMSansMedium'>Name</TableHead>
                            <TableHead className='!px-3 !py-1.5 bg-slate-50 !border !border-black !border-opacity-10 !h-auto !font-DMSansMedium'>Donation On</TableHead>
                            <TableHead className='!px-3 !py-1.5 bg-slate-50 !border !border-black !border-opacity-10 !h-auto !font-DMSansMedium'>Phone</TableHead>
                            <TableHead className='!px-3 !py-1.5 bg-slate-50 !border !border-black !border-opacity-10 !h-auto !font-DMSansMedium'>Age</TableHead>
                            <TableHead className='!px-3 !py-1.5 bg-slate-50 !border !border-black !border-opacity-10 !h-auto !font-DMSansMedium'>Donation Type</TableHead>
                            <TableHead className='!px-3 !py-1.5 bg-slate-50 !border !border-black !border-opacity-10 !h-auto !font-DMSansMedium'>Disease</TableHead>
                            <TableHead className='!px-3 !py-1.5 bg-slate-50 !border !border-black !border-opacity-10 !h-auto !font-DMSansMedium'>Status</TableHead>
                            <TableHead className='!px-3 !py-1.5 bg-slate-50 !border !border-black !border-opacity-10 !h-auto w-[135px] !font-DMSansMedium'>Update Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className=''>

                        {bloodDonations && bloodDonations.map((donation, index) => (
                            <TableRow key={index}>
                                <TableCell className="text-center">{index + 1}</TableCell>
                                <TableCell>{donation.name}</TableCell>
                                <TableCell>{donation.donationDate.split('T')[0]}</TableCell>
                                <TableCell>{donation.contact}</TableCell>
                                <TableCell className='text-center'>{donation.age}</TableCell>
                                <TableCell className='text-center'>{donation.bloodGroup}</TableCell>
                                <TableCell className='text-center'>{donation.disease}</TableCell>
                                <TableCell>{donation.donationStatus}</TableCell>
                                <TableCell className='w-[135px]'>
                                    <select className='w-full rounded-md border border-black border-opacity-10 outline-none p-1' onChange={(e) => handleUpdateStatus(e.target.value, index)}>
                                        {donation?.donationStatus === 'Pending' && <>
                                            <option value="">update</option>
                                            <option value="Accepted">Accept</option>
                                            <option value="Rejected">Reject</option>
                                        </>}
                                        {donation?.donationStatus === 'Accepted' && <>
                                            <option value="">update</option>
                                            <option value="Completed">Complete</option>
                                        </>}
                                        {donation?.donationStatus === 'Rejected' && <>
                                            <option value="">Rejected</option>
                                        </>}
                                        {donation?.donationStatus === 'Completed' && <>
                                            <option value="">Completed</option>
                                        </>}
                                    </select>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

            </div>

        </div>
    )
}

export default DonationStatistics