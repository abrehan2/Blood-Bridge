import { Button } from '@/components/ui/button'
import React from 'react'
import Link from 'next/link'
import bloodBank1 from '@/assets/bloodBank1.png'
import bloodBank2 from '@/assets/bloodBank2.png'
import bloodBank3 from '@/assets/bloodBank3.png'
import BloodBankCard from '@/app/components/BloodBankCard'
import { StaticImageData } from 'next/image';

interface Location {
    lat: number;
    lng: number;
}

interface AvailableBloodGroups {
    bloodType: string;
    quantity: number;
}

export interface BloodBankInterface {
    image: StaticImageData;
    name: string;
    address: string;
    location: Location;
    availableBloodGroups: AvailableBloodGroups[];
}

const BloodBanks = () => {
    const bloodBanks: BloodBankInterface[] = [
        {
            image: bloodBank1,
            name: 'Rawal Blood Bank',
            address: '123 Main Street Anytown, Country 12345',
            location: {
                lat: 234567987,
                lng: 2345679876,
            } as Location,
            availableBloodGroups: [
                {
                    bloodType: 'A+',
                    quantity: 11
                },
                {
                    bloodType: 'B+',
                    quantity: 0
                },
                {
                    bloodType: 'AB+',
                    quantity: 3
                },
                {
                    bloodType: 'O+',
                    quantity: 0
                },
                {
                    bloodType: 'A-',
                    quantity: 9
                },
                {
                    bloodType: 'B-',
                    quantity: 0
                },
                {
                    bloodType: 'AB-',
                    quantity: 4
                },
                {
                    bloodType: 'O-',
                    quantity: 2
                }
            ] as AvailableBloodGroups[]
        } as BloodBankInterface,
        {
            image: bloodBank2,
            name: 'CMH Blood Bank',
            address: '123 Main Street Anytown, Country 12345',
            location: {
                lat: 234567987,
                lng: 2345679876,
            } as Location,
            availableBloodGroups: [
                {
                    bloodType: 'A+',
                    quantity: 16
                },
                {
                    bloodType: 'B+',
                    quantity: 0
                },
                {
                    bloodType: 'AB+',
                    quantity: 0
                },
                {
                    bloodType: 'O+',
                    quantity: 0
                },
                {
                    bloodType: 'A-',
                    quantity: 7
                },
                {
                    bloodType: 'B-',
                    quantity: 0
                },
                {
                    bloodType: 'AB-',
                    quantity: 1
                },
                {
                    bloodType: 'O-',
                    quantity: 6
                }
            ] as AvailableBloodGroups[]
        } as BloodBankInterface,
        {
            image: bloodBank3,
            name: 'PD & C Blood Bank',
            address: '123 Main Street Anytown, Country 12345',
            location: {
                lat: 234567987,
                lng: 2345679876,
            } as Location,
            availableBloodGroups: [
                {
                    bloodType: 'A+',
                    quantity: 15
                },
                {
                    bloodType: 'B+',
                    quantity: 2
                },
                {
                    bloodType: 'AB+',
                    quantity: 0
                },
                {
                    bloodType: 'O+',
                    quantity: 5
                },
                {
                    bloodType: 'A-',
                    quantity: 41
                },
                {
                    bloodType: 'B-',
                    quantity: 0
                },
                {
                    bloodType: 'AB-',
                    quantity: 5
                },
                {
                    bloodType: 'O-',
                    quantity: 6
                }
            ] as AvailableBloodGroups[]
        } as BloodBankInterface,
    ]
    return (
        <div className='w-full flex flex-col items-center pl-[6%] pr-[3%] my-6 gap-y-7'>
            <h1 className=' text-zinc-800 italic text-3xl md:text-4xl font-PlayfairDisplayBold'>Blood Banks</h1>
            <div className='grid gap-x-10 gap-y-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3'>
                {
                    bloodBanks.slice(0, 3).map((bloodBank, index) => (
                        <BloodBankCard key={index} bloodBank={bloodBank} />
                    ))
                }
            </div>
            <Link href={'/blood-banks'}>
                <Button className='!bg-darkRed !rounded-full !min-w-[150px] !text-base lg:!text-lg !py-2'>
                    View More
                </Button>
            </Link>
        </div>
    )
}

export default BloodBanks