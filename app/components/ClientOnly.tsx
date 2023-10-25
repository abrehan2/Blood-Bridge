"use client"
import React, { useEffect, useState } from 'react'

const ClientOnly = ({children}: {children: React.ReactNode}) => {
    const [isLoading, setIsLoading] = useState<boolean>(true)

    useEffect(() => {
        setIsLoading(false)
    }, [])

    if (isLoading) return null

    return (
        <>{children}</>
    )
}

export default ClientOnly