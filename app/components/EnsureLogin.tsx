"use client"
import { updateUser, notFound } from '@/redux/features/authSlice';
import { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { axiosInstance as axios } from '@/app/axios-api/axios';
import { getUserDetailsUrl, getBloodBankDetailsUrl } from '@/app/axios-api/Endpoint';
import storageHelper from '@/lib/storage-helper';
import toast from 'react-hot-toast';
import { useBBSelector } from '@/redux/store';
import { useRouter } from 'next/navigation';

const EnsureLogin = () => {
    const dispatch = useDispatch();
    const { push } = useRouter();
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
                })
            }
            else {
                dispatch(notFound())
            }
        }
        reloadData()
    }, [])

    const isLoading = useBBSelector(state => state.authReducer.value.isLoading)
    const user = useBBSelector(state => state.authReducer.value.user)
    useEffect(() => {
        if (user?.role === 'bloodBank') {
            if (user) {
                if (!user.profileVerified) {
                    push('/profile/bloodBank/settings/management')
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoading])

    return (
        <></>
    )
}

export default EnsureLogin