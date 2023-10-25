"use client"

import React, { useState } from 'react'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import UpdateUserForm from '@/app/(HeaderFooterLayout)/profile/components/UpdateUserForm'
import UpdateUserPassword from '@/app/(HeaderFooterLayout)/profile/components/UpdateUserPassword'

const UpdateUserProfile = () => {
    const [isEdit, setIsEdit] = useState<boolean>(false)
    return (
        <div className='flex flex-col justify-between w-full relative'>
            <h3 className='text-black font-RobotoBold text-xl mb-6'>Account</h3>
            {!isEdit &&
                <span className='absolute top-2 right-2 w-max rounded-3xl bg-darkRed hover:bg-red-800 px-5 py-0.5 text-white text-center cursor-pointer' onClick={() => setIsEdit(true)}>Edit</span>
            }
            <UpdateUserForm changeDetails={isEdit} setChangeDetails={setIsEdit} />
            <Accordion type="single" collapsible>
                <AccordionItem className='!border-none' value="showPassword">
                    <AccordionTrigger className='text-black font-RobotoBold text-xl mb-4 hover:no-underline bg-white !py-1.5 mt-4 px-3 rounded-md'>Password</AccordionTrigger>
                    <AccordionContent>
                        <UpdateUserPassword changeDetails={isEdit} setChangeDetails={setIsEdit} />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    )
}

export default UpdateUserProfile