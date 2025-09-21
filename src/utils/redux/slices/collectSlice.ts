import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { cloneDeep } from "lodash";
import { StoreCollect } from "../../types/common";


const collectReducerInitialState: StoreCollect = {
    selectedPaymentId: null,
}

export const collectSlice = createSlice({
    name: 'auth',
    initialState: cloneDeep(collectReducerInitialState),
    reducers: {
        updateCollect(state, action: PayloadAction<Partial<StoreCollect>>) {
            return {
                ...state,
                ...action.payload
            }
        },
        resetCollect() {
            return cloneDeep(collectReducerInitialState)
        },
    },
});

export const { updateCollect, resetCollect } = collectSlice.actions;
export default collectSlice.reducer;
