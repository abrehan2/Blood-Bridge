import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type VerifyEmailState = {
    isVerified: boolean;
};

type initialStateType = {
    value: VerifyEmailState,
};

const initialState = {
    value: {
        isVerified: false,
    } as VerifyEmailState,
} as initialStateType;

interface VerifyPayload {
    isAuth: boolean;
}

export const auth = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // updateVerifyEmail: (state, action: PayloadAction<VerifyPayload>) => {
        //     return {
        //         value: {
        //             isVerified: action.payload.isAuth,
        //         },
        //     }
        // },
        updateVerifyEmail: (state) => {
            state.value.isVerified = !state.value.isVerified;
        }
    },
});

export const { updateVerifyEmail } = auth.actions;
export default auth.reducer;