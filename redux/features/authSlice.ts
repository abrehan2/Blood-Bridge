import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type AuthState = {
    isAuth: boolean;
    email: string;
    uid: string;
    isModerator: boolean;
};

type initialStateType = {
    value: AuthState,
};

const initialState = {
    value: {
        isAuth: false,
        email: '',
        uid: '',
        isModerator: false,
    } as AuthState,
} as initialStateType;

interface LogInPayload {
    email: string;
}

export const auth = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logOut: () => {
            return initialState
        },
        logIn: (state, action: PayloadAction<LogInPayload>) => {
            return {
                value: {
                    isAuth: true,
                    email: action.payload.email,
                    uid: 'HGafuhGDgAJjaADHa23543',
                    isModerator: false,
                },
            }
        },
        toggleModerator: (state) => {
            state.value.isModerator = !state.value.isModerator;
        }
    },
});

export const { logOut, logIn, toggleModerator } = auth.actions;
export default auth.reducer;