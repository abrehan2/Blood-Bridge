import React from 'react'
import TableCard from './TableCard'

const UserDonationsMain = () => {
    return (
        <div className='w-full flex flex-col gap-y-0.5'>
            <TableCard type='heading' bags='Bags' bloodBank='Blood Bank' city='City' contactNo='Contact No.' date='Date' />
            <TableCard type='data' bags='2' bloodBank='Ali Pur Blood' city='Islamabad' contactNo='03335472637' date='August 20,2023' />
            <TableCard type='data' bags='2' bloodBank='Rawal Blood Bank Enterprise Pvt. Ltd.' city='Islamabad' contactNo='03335472637' date='August 20,2023' />
            <TableCard type='data' bags='2' bloodBank='Ali Pur Blood' city='Islamabad' contactNo='03335472637' date='August 20,2023' />
            <TableCard type='data' bags='2' bloodBank='Ali Pur Blood' city='Gujranwala' contactNo='03335472637' date='August 20,2023' />
            <TableCard type='data' bags='2' bloodBank='Ali Pur Blood' city='Islamabad' contactNo='03335472637' date='August 20,2023' />
            <TableCard type='data' bags='2' bloodBank='Rawal Blood Bank Enterprise Pvt. Ltd.' city='Islamabad' contactNo='03335472637' date='August 20,2023' />
            <TableCard type='data' bags='2' bloodBank='Ali Pur Blood' city='Islamabad' contactNo='03335472637' date='August 20,2023' />
            <TableCard type='data' bags='2' bloodBank='Ali Pur Blood' city='Islamabad' contactNo='03335472637' date='August 20,2023' />
        </div>
    )
}

export default UserDonationsMain