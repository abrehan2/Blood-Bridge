"use client"
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'

const UserFeedbackForm = () => {
    const [feedback, setFeedback] = useState<string>('')

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if(feedback === '') {
            toast.error('Feedback cannot be empty')
            return
        }
        if(feedback.length < 20) {
            toast.error('Feedback must be at least 20 characters long')
            return
        }
        //Call API Here
        toast.success('Feedback submitted successfully')
    }
    return (
        <div className='flex flex-col justify-between w-full relative'>
            <h3 className='text-black font-RobotoBold text-xl mb-4 capitalize'>Submit Feedback</h3>
            <form onSubmit={handleSubmit} className='w-full flex flex-col items-end'>
                <textarea className='w-full bg-white rounded-[14px] focus:outline-0 p-3 text-black font-RobotoRegular placeholder:text-black placeholder:font-RobotoMedium' placeholder='Type your feedback here...' style={{ resize: "none" }} name="userFeedback" id="userFeedback" rows={14} onChange={(e) => setFeedback(e.target.value)}/>
                <Button type='submit' className='!w-max !rounded-3xl !bg-darkRed hover:!bg-red-800 !h-auto !py-2 min-w-[130px] !text-base mt-4'>Submit</Button>
            </form>
        </div>
    )
}

export default UserFeedbackForm