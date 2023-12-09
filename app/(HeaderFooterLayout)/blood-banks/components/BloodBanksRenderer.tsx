"use client"
import React, { useEffect } from 'react'
import Map from '@/app/components/Map'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { useBBSelector } from '@/redux/store'
import { getAllBloodBanksUrl } from '@/app/axios-api/Endpoint'
import { axiosInstance as axios } from '@/app/axios-api/axios'
import { updateAllBloodBanks } from '@/redux/features/allBloodBanks'
import BloodBankCard from '@/app/(HeaderFooterLayout)/blood-banks/components/BloodBankCard'

const BloodBanksRenderer = () => {
    const bloodBanks = useBBSelector((state) => state.allBloodBanks.value.bloodBanks)
    const dispatch = useDispatch()
    const isAuth = useBBSelector((state) => state.authReducer.value.isAuth)
    useEffect(() => {
        const url = getAllBloodBanksUrl();
        axios.get(url, {
          withCredentials: true
        }).then((res) => {
          dispatch(updateAllBloodBanks({ bloodBanks: res.data.result } as any))
        }).catch((err) => {
          console.log(err)
          toast.error(err!.response!.data!.message!);
        })
      }, [isAuth])
  return (
    <div>
      <BloodBankCard bloodBanks={bloodBanks}/>
      <Map bloodBanks={bloodBanks}/>
    </div>
  )
}

export default BloodBanksRenderer