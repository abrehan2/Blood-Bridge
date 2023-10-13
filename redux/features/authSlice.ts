import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type AuthState = {
    isLoading: boolean;
    isAuth: boolean;
    user: any;
};

type initialStateType = {
    value: AuthState,
};

const initialState = {
    value: {
        isLoading: true,
        isAuth: false,
        user: null,
    } as AuthState,
} as initialStateType;

interface LogInPayload {
    user: any;
}

export const auth = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logOut: () => {
            return { value: { ...initialState.value, isLoading: false } }
        },
        logIn: (state, action: PayloadAction<LogInPayload>) => {
            if (action.payload.user) {
                return {
                    value: {
                        isLoading: false,
                        isAuth: true,
                        user: action.payload.user,
                    },
                }
            }
        },
        notFound: () => {
            return { value: { ...initialState.value, isLoading: false } }
        },
    },
});

export const { logOut, logIn, notFound } = auth.actions;
export default auth.reducer;