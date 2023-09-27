"use client";

import React, { useState } from 'react'
import { logIn, logOut, toggleModerator } from '@/redux/features/authSlice'
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { Button } from '@/components/ui/button';

const TestRedux = () => {
    const dispatch = useDispatch<AppDispatch>()
    const [email, setEmail] = useState<string>('')

    const handleLogin = () => {
        dispatch(logIn({ email }))
    }

    const handleLogOut = () => {
        dispatch(logOut())
    }

    const handleToggleModerator = () => {
        dispatch(toggleModerator())
    }
    return (
        <>
            <div>
                <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <Button onClick={handleLogin}>Login</Button>
            <Button onClick={handleLogOut}>Log Out</Button>
            <Button onClick={handleToggleModerator}>Toggle Moderator</Button>
        </>
    )
}

export default TestRedux