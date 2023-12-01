import React from 'react'

const PolicyIcon = ({svgClass, color}: {svgClass: string, color: string}) => {
    return (
        <svg className={`${svgClass}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 18" fill="none">
            <path d="M0 0V18H14V9H6V0H0ZM8 0V6.75H14L8 0ZM2 4.5H4V6.75H2V4.5ZM2 9H4V11.25H2V9ZM2 13.5H10V15.75H2V13.5Z" fill={`${color}`} />
        </svg>
    )
}

export default PolicyIcon