import React from 'react'
import PasswordValidattor from 'react-password-validattor';

const ValidatePassword = ({ password, confirmPassword, onValidatorChangeHandler }: { password: string, confirmPassword: string, onValidatorChangeHandler: (result: boolean) => void }) => {
    return (
        <PasswordValidattor
            rules={['minLength',
                'maxLength',
                'specialChar',
                'number',
                'capital',
                'matches',
                'lowercase',
                'notEmpty']}
            minLength={8}
            maxLength={32}
            password={password}
            confirmedPassword={confirmPassword}
            iconSize={16}
            onValidatorChange={onValidatorChangeHandler}
            config={{ showProgressBar: true }} />
    )
}

export default ValidatePassword