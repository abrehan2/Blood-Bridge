"use client"
import React, { useState, useRef, ChangeEvent } from 'react'
import { GoogleMap, InfoWindow, Marker, useJsApiLoader } from '@react-google-maps/api';
import cx from 'classnames';

interface MapProps {
    bloodBanks: any[],
    userLocation: { lat: number, lng: number },
    selectedSector: string,
    setSelectedSector: React.Dispatch<React.SetStateAction<string>>,
    selectedBloodGroup: string,
    setSelectedBloodGroup: React.Dispatch<React.SetStateAction<string>>,
}

const Map = ({ bloodBanks, userLocation, selectedBloodGroup, setSelectedBloodGroup, selectedSector, setSelectedSector }: MapProps) => {
    const [map, setMap] = useState<any | undefined>()
    const infowindow = useRef<any>(null)
    const [showInfoWindowIndex, setShowInfoWindowIndex] = useState<number>()

    const defaultProps = {
        center: {
            lat: 33.6844,
            lng: 73.0479
        },
        zoom: 13,
    };

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: "AIzaSyBRnn1F5XcwJm4nLv-vXz6UUNu-VXXx7uU"
    })

    const onLoad = React.useCallback(function callback(map: any) {
        map.setHeading(90);
        setMap(map)
    }, [])

    const onUnmount = React.useCallback(function callback() {
        setMap(null)
    }, [])

    const handleSectorChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setSelectedSector(e.target.value)
        setShowInfoWindowIndex(undefined)
    }

    const handleBloodGroupChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setSelectedBloodGroup(e.target.value)
        setShowInfoWindowIndex(undefined)
    }

    const islamabadSectors = ['D-12', 'E-7', 'E-8', 'E-9', 'E-10', 'E-11',
        'F-5', 'F-6', 'F-7', 'F-8', 'F-9', 'F-10', 'F-11',
        'G-5', 'G-6', 'G-7', 'G-8', 'G-9', 'G-10', 'G-11', 'G-12', 'G-13', 'G-14', 'G-15', 'G-16',
        'H-8', 'H-9', 'H-11', 'H-13', 'H-14',
        'I-8', 'I-9', 'I-10', 'I-11', 'I-13', 'I-14', 'I-15', 'I-16',]

    const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

    return (
        <div className='relative w-full h-[70vh]'>
            <div className='absolute z-[999] left-0 top-8 w-full grid grid-cols-2 gap-x-12 px-[6%]'>
                <select className='bg-darkRed text-white rounded-[5px] w-full py-2 px-3.5 focus:outline-0'
                    onChange={handleSectorChange} value={selectedSector}>
                    <option value="">Select Your Area/Sector</option>
                    {islamabadSectors.map((sector) => (
                        <option key={sector} value={sector}>{sector}</option>
                        ))}
                </select>
                <select className='bg-darkRed text-white rounded-[5px] w-full py-2 px-3.5 focus:outline-0'
                    onChange={handleBloodGroupChange} value={selectedBloodGroup}>
                    <option value="">Select Your Blood Group</option>
                    {bloodGroups.map((bloodGroup) => (
                        <option key={bloodGroup} value={bloodGroup}>{bloodGroup}</option>
                    ))}
                </select>
            </div>
            {isLoaded &&
                <GoogleMap
                    mapContainerStyle={{ width: '100%', height: '100%' }}
                    center={defaultProps.center}
                    zoom={defaultProps.zoom}
                    onLoad={onLoad}
                    onUnmount={onUnmount}
                    options={
                        {
                            zoomControl: false,
                            mapTypeControl: false,
                            fullscreenControl: false,
                            streetViewControl: false,
                        }
                    }>
                    <Marker
                        position={{ lat: userLocation.lat, lng: userLocation.lng }}
                    >
                    </Marker>
                    {bloodBanks.map((BB_Data, index) => (
                        <Marker
                            key={index}
                            position={{ lat: BB_Data?.bloodBank?.location?.latitude, lng: BB_Data?.bloodBank?.location?.longitude }}
                            icon={"https://uploadthing.com/f/f800f3eb-bdde-4a93-ae9d-7ff4cef35f02-dth3ms.png"}
                            onClick={() => {
                                map.setCenter({ lat: BB_Data?.bloodBank?.location?.latitude, lng: BB_Data?.bloodBank?.location?.longitude });
                                map.setZoom(14);
                                setShowInfoWindowIndex(index)
                            }}
                        >
                            {showInfoWindowIndex === index &&
                                <InfoWindow ref={infowindow} options={
                                    {
                                        minWidth: 236.5,
                                    }
                                } onCloseClick={() => {
                                    setShowInfoWindowIndex(undefined)
                                    map.setZoom(14);
                                    map.setCenter({ lat: BB_Data?.bloodBank?.location?.latitude, lng: BB_Data?.bloodBank?.location?.longitude });
                                }}>
                                    <div className='flex flex-col gap-y-1'>
                                        <div className='flex items-center gap-x-1'>
                                            <h3 className='text-red-800 text-xs font-bold font-LatoBold'>Name: </h3>
                                            <p className='text-black text-xs font-LatoRegular'>{BB_Data?.bloodBank?.name}</p>
                                        </div>
                                        <div className='flex items-center gap-x-1'>
                                            <h3 className='text-red-800 text-xs font-bold font-LatoBold'>Address: </h3>
                                            <p className='text-black text-xs font-LatoRegular'>{BB_Data?.bloodBank?.address}</p>
                                        </div>
                                        <div className='flex items-center gap-x-1'>
                                            <h3 className='text-red-800 text-xs font-bold font-LatoBold'>Contact: </h3>
                                            <p className='text-black text-xs font-LatoRegular'>{BB_Data?.bloodBank?.contact}</p>
                                        </div>
                                        <div className='flex items-center gap-x-1'>
                                            <h3 className='text-red-800 text-xs font-bold font-LatoBold'>Distance: </h3>
                                            <p className='text-black text-xs font-LatoRegular'>{BB_Data?.distance} km</p>
                                        </div>
                                        <h3 className='text-red-800 text-xs font-LatoBold'>Blood Groups: </h3>
                                        {BB_Data?.bloodGroups === null &&
                                            <p className='text-black text-xs font-LatoRegular'>No Blood Types in Stock</p>
                                        }
                                        <div className='grid grid-cols-4 gap-y-2 mb-2'>
                                            {BB_Data?.bloodGroups?.map((BG_Data: any, index: any) => (
                                                <div key={index} className={cx('flex flex-col items-center justify-between w-full bg-white py-0.5 border-r border-red-800', { '!border-none': (BB_Data?.bloodGroups.length >= 4 ? ((index + 1) === BB_Data?.bloodGroups.length || (index + 1) === 4) : ((index + 1) === BB_Data?.bloodGroups.length)) })}>
                                                    <div>
                                                        <p className='font-LatoBold text-black text-xs'>{BG_Data.bloodGroup}</p>
                                                    </div>
                                                    <p className=' font-LatoRegular text-black text-xs'>{BG_Data.stock}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </InfoWindow>
                            }
                        </Marker>
                    ))}
                </GoogleMap>
            }
        </div>
    )
}

export default Map