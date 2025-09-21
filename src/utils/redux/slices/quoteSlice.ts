import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { cloneDeep } from "lodash";
import moment from "moment";
import { BillTypeEnum, CustomerPayFrequency, QuoteFrequency } from "../../enums/common";
import { StoreQuote } from "../../types/common";


const quoteReducerInitialState: StoreQuote = {
    quoteType: BillTypeEnum.AUTO_INSURANCE,
    quoteFrequency: QuoteFrequency.MONTHLY,
    quoteAmount: null,
    isDownPaymentRequired: false,
    downPaymentAmount: null,
    dueDate: [],
    dueMonth: moment().format('MMMM').toLowerCase(),
    customerPayFrequency: CustomerPayFrequency.WEEKLY,
    weekDays: moment().add(1, 'day').day(),
    customerPayFrequencyDays: [],
    isCustomerGetPaidOnWeekend: false,
    customerEmail: null,
    customerFirstName: null,
    customerLastName: null,
    customerPhone: null,
    policyId: null,
    vins: [],
    customerSelection: null,
    existingCustomerId: null,
    existingCustomerDeluxeCustomerId: null,
    existingCustomerDeluxeVaultId: null,
    isRenewal: false
}
export const quoteSlice = createSlice({
    name: 'auth',
    initialState: cloneDeep(quoteReducerInitialState),
    reducers: {
        updateQuote(state, action: PayloadAction<Partial<StoreQuote>>) {
            return {
                ...state,
                ...action.payload
            }
        },
        resetQuote() {
            return cloneDeep(quoteReducerInitialState)
        },
    },
});

export const { updateQuote, resetQuote } = quoteSlice.actions;
export default quoteSlice.reducer;
