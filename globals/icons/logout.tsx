import React from 'react'

const LogoutIcon = ({svgClass}: {svgClass: string}) => {
    return (
        <svg className={`${svgClass}`} viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21.25 20L26.25 15M26.25 15L21.25 10M26.25 15H8.75M16.25 20V21.25C16.25 22.2446 15.8549 23.1984 15.1517 23.9017C14.4484 24.6049 13.4946 25 12.5 25H7.5C6.50544 25 5.55161 24.6049 4.84835 23.9017C4.14509 23.1984 3.75 22.2446 3.75 21.25V8.75C3.75 7.75544 4.14509 6.80161 4.84835 6.09835C5.55161 5.39509 6.50544 5 7.5 5H12.5C13.4946 5 14.4484 5.39509 15.1517 6.09835C15.8549 6.80161 16.25 7.75544 16.25 8.75V10" stroke="#BA5456" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

export default LogoutIcon