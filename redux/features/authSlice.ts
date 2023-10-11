import storageHelper from '@/lib/storage-helper';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type AuthState = {
    isAuth: boolean;
    user: any;
};

type initialStateType = {
    value: AuthState,
};

const initialState = {
    value: {
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
            storageHelper.removeItem(storageHelper.StorageKeys.User_Data);
            return initialState
        },
        logIn: (state, action: PayloadAction<LogInPayload>) => {
            storageHelper.saveItem(storageHelper.StorageKeys.User_Data, initialState.value.user);
            return {
                value: {
                    isAuth: true,
                    user: action.payload.user,
                },
            }
        },
        // toggleModerator: (state) => {
        //     state.value.isModerator = !state.value.isModerator;
        // }
    },
});

export const { logOut, logIn } = auth.actions;
export default auth.reducer;