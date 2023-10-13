import React from 'react'
import shadow from '@/app/components/shadow.module.css'
import ResetPasswordForm from '@/app/auth/components/ResetPasswordForm'

const page = () => {
  return (
    <div className={`'w-full mt-8 relative z-[3] min-h-[76vh] bg-white flex items-center justify-center ${shadow.lightShadow}`}>
        <ResetPasswordForm />
    </div>
  )
}

export default page