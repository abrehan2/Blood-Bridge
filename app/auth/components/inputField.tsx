import React from 'react'
import { UseFormRegister } from 'react-hook-form'
import cx from 'classnames'
import { fieldTypes } from './ClientSignupForm'
import { BloodBankfieldTypes } from './BloodBankSignupForm'

interface InputFieldProps {
    fieldTitle: string;
    fieldLabel: string;
    fieldName: fieldTypes | BloodBankfieldTypes;
    fieldType: string;
    register: UseFormRegister<any>;
    titleCase?: 'lowercase' | 'capitalize';
    isError?: boolean;
}

const InputField = ({ fieldTitle, fieldLabel, fieldName, fieldType, titleCase, register, isError }: InputFieldProps) => {
    return (
        <div className='w-full flex flex-col-reverse'>
            <label htmlFor="firstName" className={cx('text-zinc-500 text-xs font-normal font-LatoRegular uppercase tracking-[3.50px] pl-3 pt-0.5', [titleCase])}>{fieldLabel}</label>
            <input type={fieldType} placeholder={fieldTitle} className={cx('placeholder:uppercase placeholder:font-LatoRegular placeholder:text-zinc-500 placeholder:text-base md:placeholder:text-lg focus:outline-0 focus:border-b focus:shadow-none border-b outline-0 shadow-none border-black w-full py-[5px] px-3 tracking-[3px]', {'!border-red-500': isError})} {...register(fieldName)} />
        </div>
    )
}

export default InputField