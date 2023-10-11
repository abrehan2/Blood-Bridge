"use client"

import React from 'react'
import { useBBSelector } from '@/redux/store'

const TestReduxUse = () => {
    const user = useBBSelector(state => state.authReducer.value.user)
    const isAuth = useBBSelector(state => state.authReducer.value.isAuth)
    return (
        <div>
            <p>{user?.name}</p>
            {isAuth && <p>Logged In</p>}
        </div>
    )
}

export default TestReduxUse