import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type allBloodBanksState = {
    bloodBanks: any[];
}

type initialStateType = {
    value: allBloodBanksState;
};

const initialState = {
    value: {
        bloodBanks: []
    } as allBloodBanksState,
} as initialStateType

interface BloodBankPayload {
    bloodBanks: any[];
}

export const allBloodBanks = createSlice({
    name: 'allBloodBanks',
    initialState,
    reducers: {
        updateAllBloodBanks: (state, action: PayloadAction<BloodBankPayload>) => {
            return {
                value: {
                    bloodBanks: action.payload.bloodBanks
                }
            }
        }
    }
});

export const { updateAllBloodBanks } = allBloodBanks.actions;
export default allBloodBanks.reducer;