import React from 'react'

const Loader = () => {
    return (
        <div className='w-full h-screen bg-white flex items-center justify-center'>
            <div className='bg-transparent w-[70px] h-[70px] rounded-full border-t-[3px] border-red-700 animate-spin' />
        </div>
    )
}

export default Loader