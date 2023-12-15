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
import { BBUpdateRequestStatus, BBgetAllBloodRequestes } from '@/app/axios-api/Endpoint'
import toast from 'react-hot-toast'

const RequestStatistics = () => {
    const [bloodRequests, setBloodRequests] = useState<any[]>()

    useEffect(() => {
        const url = BBgetAllBloodRequestes();
        axios.get(url, {
            withCredentials: true
        }).then(res => {
            setBloodRequests(res.data.bloodRequests)
        }).catch(err => {
            toast.error(err.response.data.message)
            console.log(err)
        })
    }, [])

    const handleUpdateStatus = (value: string, index: number) => {
        if(value === '') {
            return
        }
        const url = BBUpdateRequestStatus() + `${bloodRequests?.[index]._id}`;
        axios.put(url, {status: value, message: ''}, {
            withCredentials: true
        }).then(res => {
            toast.success("Status Updated Successfully")
            setBloodRequests(prev => {
                let updatedRequests = [...prev!]
                updatedRequests[index].reqStatus = value as string
                return updatedRequests
            })
            // setBloodRequests(res.data.bloodRequests)
        }).catch(err => {
            console.log(err)
            toast.error(err.response.data.message)
        })
    }
    return (
        <div className='w-full'>
            <div className='w-full flex gap-x-7 items-center'>
                <div className='py-3 px-4 rounded-xl bg-[#20283E] min-w-[155px]'>
                    <h3 className='font-PlayfairDisplayBold capitalize text-white text-lg leading-5'>Total Requests</h3>
                    <h3 className='font-PlayfairDisplayBold capitalize text-white text-lg leading-5'>{bloodRequests?.length}</h3>
                </div>
                <div className='py-3 px-4 rounded-xl bg-[#0A5620] min-w-[155px]'>
                    <h3 className='font-PlayfairDisplayBold capitalize text-white text-lg leading-5'>Completed</h3>
                    <h3 className='font-PlayfairDisplayBold capitalize text-white text-lg leading-5'>{bloodRequests?.filter((request) => request.reqStatus === 'Completed').length}</h3>
                </div>
                <div className='py-3 px-4 rounded-xl bg-[#B3C100] min-w-[155px]'>
                    <h3 className='font-PlayfairDisplayBold capitalize text-white text-lg leading-5'>Pending</h3>
                    <h3 className='font-PlayfairDisplayBold capitalize text-white text-lg leading-5'>{bloodRequests?.filter((request) => request.reqStatus === 'Pending').length}</h3>
                </div>
                <div className='py-3 px-4 rounded-xl bg-[#AC3E31] min-w-[155px]'>
                    <h3 className='font-PlayfairDisplayBold capitalize text-white text-lg leading-5'>Rejected</h3>
                    <h3 className='font-PlayfairDisplayBold capitalize text-white text-lg leading-5'>{bloodRequests?.filter((request) => request.reqStatus === 'Rejected').length}</h3>
                </div>
            </div>

            <div className={`bg-white w-full py-4 px-2.5 mt-4 rounded-lg ${shadow.lightShadow}`}>
                <p className='font-DMSansSemiBold text-slate-900 capitalize pb-1.5'>List of Blood Requests</p>
                <Table className='!rounded-lg overflow-hidden'>
                    <TableHeader>
                        <TableRow>
                            <TableHead className='!px-3 !py-1.5 w-[50px] bg-slate-50 !border !border-black !border-opacity-10 !h-auto !font-DMSansMedium'></TableHead>
                            <TableHead className='!px-3 !py-1.5 bg-slate-50 !border !border-black !border-opacity-10 !h-auto !font-DMSansMedium'>Name</TableHead>
                            <TableHead className='!px-3 !py-1.5 bg-slate-50 !border !border-black !border-opacity-10 !h-auto !font-DMSansMedium'>Needed On</TableHead>
                            <TableHead className='!px-3 !py-1.5 bg-slate-50 !border !border-black !border-opacity-10 !h-auto !font-DMSansMedium'>Phone</TableHead>
                            <TableHead className='!px-3 !py-1.5 bg-slate-50 !border !border-black !border-opacity-10 !h-auto !font-DMSansMedium'>Requested</TableHead>
                            <TableHead className='!px-3 !py-1.5 bg-slate-50 !border !border-black !border-opacity-10 !h-auto !font-DMSansMedium'>Quantity</TableHead>
                            <TableHead className='!px-3 !py-1.5 bg-slate-50 !border !border-black !border-opacity-10 !h-auto !font-DMSansMedium'>Exchange Types</TableHead>
                            <TableHead className='!px-3 !py-1.5 bg-slate-50 !border !border-black !border-opacity-10 !h-auto !font-DMSansMedium'>Status</TableHead>
                            <TableHead className='!px-3 !py-1.5 bg-slate-50 !border !border-black !border-opacity-10 !h-auto w-[135px] !font-DMSansMedium'>Update Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className=''>

                        {bloodRequests && bloodRequests.map((request, index) => (
                            <TableRow key={index}>
                                <TableCell className="text-center">{index + 1}</TableCell>
                                <TableCell>{request.name}</TableCell>
                                <TableCell>{request.bloodNeededOn.split('T')[0]}</TableCell>
                                <TableCell>{request.contact}</TableCell>
                                <TableCell className='text-center'>{request.bloodGroup.bloodGroup}</TableCell>
                                <TableCell className='text-center'>{request.bloodBags}</TableCell>
                                <TableCell className='!grid !grid-cols-3 gap-x-1'>{request.receivedBlood.map((val: string, ind: number) => {
                                    return <span className='bg-slate-50 p-1 rounded-md text-center' key={ind}>{val}</span>
                                })}</TableCell>
                                <TableCell>{request.reqStatus}</TableCell>
                                <TableCell className='w-[135px]'>
                                    <select className='w-full rounded-md border border-black border-opacity-10 outline-none p-1' onChange={(e) => handleUpdateStatus(e.target.value, index)}>
                                        {request?.reqStatus === 'Pending' && <>
                                            <option value="">update</option>
                                            <option value="Accepted">Accept</option>
                                            <option value="Rejected">Reject</option>
                                        </>}
                                        {request?.reqStatus === 'Accepted' && <>
                                            <option value="">update</option>
                                            <option value="Completed">Complete</option>
                                        </>}
                                        {request?.reqStatus === 'Rejected' && <>
                                            <option value="">Rejected</option>
                                        </>}
                                        {request?.reqStatus === 'Completed' && <>
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

export default RequestStatistics