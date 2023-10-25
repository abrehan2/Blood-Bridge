import React from 'react'
import shadow from '@/app/components/shadow.module.css'
import ForgotPassword from '@/app/auth/components/ForgotPassword'

const page = () => {
  return (
    <div className={`'w-full mt-8 relative z-[3] min-h-[76vh] bg-white flex items-center justify-center ${shadow.lightShadow}`}>
        <ForgotPassword />
    </div>
  )
}

export default page