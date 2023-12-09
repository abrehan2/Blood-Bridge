"use client"
import React, { useCallback, useEffect, useState, useRef } from 'react'
import { GoogleMap, InfoWindow, Marker, useJsApiLoader } from '@react-google-maps/api';
import cx from 'classnames';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const Map = ({ bloodBanks }: { bloodBanks: any[] }) => {
    const { push } = useRouter()
    const [userLocation, setUserLocation] = useState<{ lat: number, lng: number }>({ lat: 0, lng: 0 })
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

    const getLocation = useCallback(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    let userLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };
                    setUserLocation(userLocation);
                },
                (error) => {
                    console.error('Error getting location:', error.message);
                    toast.error(`Location Denied, Please Allow location access to continue`)
                    push('/')
                }, {
                enableHighAccuracy: true,
            }
            );
        } else {
            toast.error('Geolocation is not supported by this browser.');
        }
    }, []);

    useEffect(() => {
        getLocation();
    }, [getLocation]);

    useEffect(() => {
    }, [userLocation, bloodBanks])

    return (
        <div className='w-full h-[60vh]'>
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
                                <InfoWindow ref={infowindow} onCloseClick={() => {
                                    setShowInfoWindowIndex(undefined)
                                    map.setZoom(14);
                                    map.setCenter({ lat: BB_Data?.bloodBank?.location?.latitude, lng: BB_Data?.bloodBank?.location?.longitude });
                                }}>
                                    <div>
                                        <p>{BB_Data?.bloodBank?.name}</p>
                                        <p>{BB_Data?.bloodBank?.address}</p>
                                        <p>{BB_Data?.bloodBank?.contact}</p>
                                        <div className='grid grid-cols-4 gap-y-2 my-2'>
                                            {BB_Data?.bloodGroups?.map((BG_Data: any, index: any) => (
                                                <div key={index} className={cx('flex flex-col items-center justify-between w-full bg-white py-0.5 border-r border-red-800', {'!border-none': (BB_Data?.bloodGroups / 2 === 0 ? ((index + 1) === BB_Data?.bloodGroups.length || (index + 1) === (BB_Data?.bloodGroups.length / 2)) : ((index + 1) === BB_Data?.bloodGroups.length || (index + 1) === Math.ceil(BB_Data?.bloodGroups.length / 2)))})}>
                                                    <p className='font-LatoBold text-black text-xs'>{BG_Data.bloodGroup}</p>
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