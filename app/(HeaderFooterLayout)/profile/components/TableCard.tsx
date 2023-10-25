import React from 'react'
import cx from 'classnames'

type TableCardProps = {
    type: 'data' | 'heading';
    bags: string;
    bloodBank: string;
    city: string;
    contactNo: string;
    date: string;
}

const TableCard = (props: TableCardProps) => {
    return (
        <div className='w-full grid grid-cols-8 items-stretch gap-x-0.5'>
            <div className={cx('w-full bg-[#F3EDED] py-2.5 flex items-center justify-center', { '!bg-[#D9D9D9] border border-stone-200': props.type === 'heading' })}>
                <p className={cx('text-black font-LatoRegular text-sm text-center', {'!font-RobotoMedium': props.type === 'heading'})}>{props.bags}</p>
            </div>
            <div className={cx('w-full bg-[#F3EDED] py-2.5 flex items-center justify-center col-span-2', { '!bg-[#D9D9D9] border border-stone-200': props.type === 'heading' })}>
                <p className={cx('text-black font-LatoRegular text-sm text-center', {'!font-RobotoMedium': props.type === 'heading'})}>{props.bloodBank}</p>
            </div>
            <div className={cx('w-full bg-[#F3EDED] py-2.5 flex items-center justify-center', { '!bg-[#D9D9D9] border border-stone-200': props.type === 'heading' })}>
                <p className={cx('text-black font-LatoRegular text-sm text-center', {'!font-RobotoMedium': props.type === 'heading'})}>{props.city}</p>
            </div>
            <div className={cx('w-full bg-[#F3EDED] py-2.5 flex items-center justify-center col-span-2', { '!bg-[#D9D9D9] border border-stone-200': props.type === 'heading' })}>
                <p className={cx('text-black font-LatoRegular text-sm text-center', {'!font-RobotoMedium': props.type === 'heading'})}>{props.contactNo}</p>
            </div>
            <div className={cx('w-full bg-[#F3EDED] py-2.5 flex items-center justify-center col-span-2', { '!bg-[#D9D9D9] border border-stone-200': props.type === 'heading' })}>
                <p className={cx('text-black font-LatoRegular text-sm text-center', {'!font-RobotoMedium': props.type === 'heading'})}>{props.date}</p>
            </div>
        </div>
    )
}

export default TableCard