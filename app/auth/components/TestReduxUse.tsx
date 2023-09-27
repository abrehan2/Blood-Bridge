"use client"

import React from 'react'
import { useBBSelector } from '@/redux/store'

const TestReduxUse = () => {
    const email = useBBSelector(state => state.authReducer.value.email)
    const isModerator = useBBSelector(state => state.authReducer.value.isModerator)
    return (
        <div>
            <p>{email}</p>
            {isModerator && <p>Moderator</p>}
        </div>
    )
}

export default TestReduxUse