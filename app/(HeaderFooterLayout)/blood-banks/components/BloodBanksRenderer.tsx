"use client"
import React, { useState, useEffect, useCallback, useMemo } from 'react'
import Map from '@/app/components/Map'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { useBBSelector } from '@/redux/store'
import { getAllBloodBanksUrl } from '@/app/axios-api/Endpoint'
import { axiosInstance as axios } from '@/app/axios-api/axios'
import { updateAllBloodBanks } from '@/redux/features/allBloodBanks'
import BloodBankCard from '@/app/(HeaderFooterLayout)/blood-banks/components/BloodBankCard'
import { useRouter } from 'next/navigation';

type UseDistanceTypes = {
  from: { latitude: number; longitude: number };
  to: { latitude: number; longitude: number };
};

const BloodBanksRenderer = () => {
  const dispatch = useDispatch()
  const { push } = useRouter()
  const isAuth = useBBSelector((state) => state.authReducer.value.isAuth)
  const [userLocation, setUserLocation] = useState<{ lat: number, lng: number }>({ lat: 0, lng: 0 })
  const [selectedSector, setSelectedSector] = useState<string>('')
  const [selectedBloodGroup, setSelectedBloodGroup] = useState<string>('')
  const bloodBanks = useBBSelector((state) => state.allBloodBanks.value.bloodBanks)
  const user = useBBSelector((state) => state.authReducer.value.user)

  //get all blood banks from backend and update redux store
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

  //set default values for sector and blood group
  useMemo(() => {
    if (user) {
      setSelectedBloodGroup(user?.bloodGroup);
    }
  }, [user])

  //get user location
  const getUserCoordinates = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
        },
        (err) => {
          toast.error("Allow Location Access to Continue");
          push('/')
        }
      );
    } else {
      toast.error('Geolocation is not supported in this browser.');
    }
  };

  useEffect(() => {
    if (userLocation.lat === 0 && userLocation.lng === 0) {
      getUserCoordinates();
    }
  }, []);

  //get address from lat long
  async function reverseGeocode(latitude: any, longitude: any, apiKey: any): Promise<string | null> {
    const apiUrl = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`;

    try {
      const response = await axios.get(apiUrl);
      const result = response.data;

      if (result.status && result.status.message === 'OK' && result.results.length > 0) {
        const address = result.results[0].components.suburb;
        return address;
      } else {
        console.error('Error in reverse geocoding:', result.status.message);
        return null;
      }
    } catch (error) {
      console.error('Error in reverse geocoding');
      return null;
    }
  }

  // calculate distance between two coordinates
  const earthRadius = 6378137;
  const toRadius = (value: number): number => (value * Math.PI) / 180;

  const useDistance = ({ from, to }: UseDistanceTypes): number => {
    const distance =
      Math.acos(
        Math.sin(toRadius(to.latitude)) * Math.sin(toRadius(from.latitude)) +
        Math.cos(toRadius(to.latitude)) * Math.cos(toRadius(from.latitude)) * Math.cos(toRadius(from.longitude) - toRadius(to.longitude)),
      ) * earthRadius;
    return convertDistance(distance, 'km').toFixed(2) as any;
  };

  // Convert to a different unit 
  const convertDistance = (meters: number, targetUnit: keyof typeof distanceConversion = 'm'): number => {
    return distanceConversion[targetUnit] * meters;
  };

  const distanceConversion = {
    m: 1,
    mi: 1 / 1609.344,
    km: 0.001,
    cm: 100,
    mm: 1000
  };

  //get distance between user and blood banks and add it to blood banks array
  const bloodBanksWithDistance = [...bloodBanks]

  bloodBanks.forEach((BB_Data, index) => {
    const distance = useDistance({
      from: {
        latitude: userLocation.lat,
        longitude: userLocation.lng
      },
      to: {
        latitude: BB_Data?.bloodBank?.location?.coordinates?.[1],
        longitude: BB_Data?.bloodBank?.location?.coordinates?.[0]
      }
    })
    bloodBanksWithDistance[index] = {
      ...BB_Data,
      distance
    }
  })

  //filter blood banks according to selected sector and blood group
  const filteredBloodBanks = bloodBanksWithDistance.filter((BB_Data) => (
    BB_Data?.bloodBank?.sector === selectedSector && BB_Data?.bloodGroups?.some((BG_Data: any) => BG_Data.bloodGroup === selectedBloodGroup)
  ))

  useMemo(() => {
    if (userLocation.lat !== 0 && userLocation.lng !== 0) {
      const address = reverseGeocode(userLocation.lat, userLocation.lng, "66a04f2311294362a82cbfc1f33d860c")
      address.then((res) => {
        if (res) {
          setSelectedSector(`${res.split('/')[0]}`)
        }
      }).catch((err) => {
        console.log(err)
      })
    }
  }, [userLocation])

  useEffect(() => {

  }, [userLocation, bloodBanks])

  return (
    <div>
      <BloodBankCard bloodBanks={filteredBloodBanks} />
      <Map bloodBanks={filteredBloodBanks} userLocation={userLocation} selectedSector={selectedSector} setSelectedSector={setSelectedSector} selectedBloodGroup={selectedBloodGroup} setSelectedBloodGroup={setSelectedBloodGroup} />
    </div>
  )
}

export default BloodBanksRenderer