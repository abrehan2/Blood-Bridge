"use client";

import React from 'react'
import { logIn, logOut } from '@/redux/features/authSlice'
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { Button } from '@/components/ui/button';

const TestRedux = () => {
    const dispatch = useDispatch<AppDispatch>()
    const user = null;

    const handleLogin = () => {
        dispatch(logIn({ user }))
    }

    const handleLogOut = () => {
        dispatch(logOut())
    }
    return (
        <>
            <Button onClick={handleLogin}>Login</Button>
            <Button onClick={handleLogOut}>Log Out</Button>
        </>
    )
}

export default TestRedux