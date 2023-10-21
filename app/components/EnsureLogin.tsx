"use client"
import { updateUser, notFound } from '@/redux/features/authSlice';
import { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { axiosInstance as axios } from '@/app/axios-api/axios';
import { getUserDetailsUrl, getBloodBankDetailsUrl } from '@/app/axios-api/Endpoint';
import storageHelper from '@/lib/storage-helper';
import toast from 'react-hot-toast';

const EnsureLogin = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        const reloadData = async () => {
            let user: any = null;
            const role = await storageHelper.getItem(storageHelper.StorageKeys.Role);
            const url = role === 'user' ? getUserDetailsUrl() : role === 'bloodBank' ? getBloodBankDetailsUrl() : '';
            if (url !== '') {
                axios.get(url, {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then((res) => {
                    user = role === 'user' ? res.data.user : res.data.bloodBank
                    dispatch(updateUser({ user } as any))
                }).catch(() => {
                    dispatch(notFound())
                }).finally(() => {
                    if (role === 'bloodBank') {
                        if (user) {
                            if (!user.profileVerified) {
                                toast.error('Your profile is not Completed yet. We will redirect you.')
                            }
                        }
                    }
                })
            }
            else {
                dispatch(notFound())
            }
        }
        reloadData()
    }, [])

    return (
        <></>
    )
}

export default EnsureLogin