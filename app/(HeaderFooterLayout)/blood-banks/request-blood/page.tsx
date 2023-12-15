import React from 'react'
import RequestDonateBlood from '../components/RequestDonateBlood'

type SearchParamsType = {
    searchParams: {
        [key: string]: string | string[] | undefined
    }
}

const page = ({searchParams}: SearchParamsType) => {
  return (
    <RequestDonateBlood callType='request' bloodBankId={searchParams?.id} />
  )
}

export default page