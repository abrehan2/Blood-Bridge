import React from 'react'
import { FieldValues, UseFormRegister } from 'react-hook-form'
import cx from 'classnames'
import { SignupData, fieldTypes } from './ClientSignupForm'

interface InputFieldProps {
    fieldTitle: string;
    fieldLabel: string;
    fieldName: fieldTypes;
    fieldType: string;
    setMethod?: React.Dispatch<React.SetStateAction<any>>;
    fieldValue?: any;
    register: UseFormRegister<SignupData>;
    titleCase?: 'lowercase' | 'capitalize';
}

const InputField = ({ fieldTitle, fieldLabel, fieldName, fieldType, titleCase, fieldValue, register, setMethod }: InputFieldProps) => {
    return (
        <div className='w-full flex flex-col-reverse'>
            <label htmlFor="firstName" className={cx('text-zinc-500 text-xs font-normal font-LatoRegular uppercase tracking-[3.50px] pl-3 pt-0.5', [titleCase])}>{fieldLabel}</label>
            <>
                {!setMethod ?
                    <input type={fieldType} placeholder={fieldTitle} className='placeholder:uppercase placeholder:font-LatoRegular placeholder:text-zinc-500 placeholder:text-base md:placeholder:text-lg focus:outline-0 focus:border-b focus:shadow-none border-b outline-0 shadow-none border-black w-full py-[5px] px-3 tracking-[3px]' {...register(fieldName)} />
                    :
                    <input onChange={(e) => setMethod(e.target.value)} type={fieldType} placeholder={fieldTitle} className='placeholder:uppercase placeholder:font-LatoRegular placeholder:text-zinc-500 placeholder:text-base md:placeholder:text-lg focus:outline-0 focus:border-b focus:shadow-none border-b outline-0 shadow-none border-black w-full py-[5px] px-3 tracking-[3px]' value={fieldValue} />
                }
            </>
        </div>
    )
}

export default InputField