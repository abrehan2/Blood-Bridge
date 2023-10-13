"use client"
import { logIn, notFound } from '@/redux/features/authSlice';
import { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { axiosInstance as axios } from '@/app/axios-api/axios';
import { getUserDetailsUrl } from '@/app/axios-api/Endpoint';

const EnsureLogin = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        const url = getUserDetailsUrl();
        axios.get(url, {
            withCredentials: true
        }).then((res) => {
            dispatch(logIn({user: res.data.user} as any))
        }).catch((err) => {
            dispatch(notFound())
        })
    }, [])
    
    return (
        <></>
    )
}

export default EnsureLogin