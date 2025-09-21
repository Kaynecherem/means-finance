import { CARD_TYPE_BRAND_MAPPING } from '../contants/common';
import { BillTypeEnum, CustomerPayFrequency, PaymentType, QuoteFrequency } from '../enums/common';
import { CustomDirectusUser, DirectusBill } from './schema';
export type StoreQuote = {
    id?: number
    quoteType: BillTypeEnum
    quoteFrequency: QuoteFrequency
    quoteAmount: number | null
    isDownPaymentRequired: boolean
    downPaymentAmount: number | null
    dueDate: Array<number>
    dueMonth: string | null
    customerPayFrequency: CustomerPayFrequency
    weekDays: number | null
    customerPayFrequencyDays: Array<number>
    isCustomerGetPaidOnWeekend: boolean
    customerEmail: string | null
    customerFirstName: string | null
    customerLastName: string | null
    customerPhone: string | null
    policyId: string | null
    vins: VIN[]
    customerSelection: 'new' | 'existing' | null
    existingCustomerId: string | null
    existingCustomerDeluxeCustomerId: string | null
    existingCustomerDeluxeVaultId: string | null
}

export type StoreCollect = {
    customer?: CustomDirectusUser | null
    bill?: DirectusBill
    selectedPaymentId?: number | null
}
export type Agency = {
    id: number,
    accountNumber: string | null
    addressOne: string | null
    addressTwo: string | null
    agencyBankName: string | null
    agencyEmail: string | null
    agencyName: string | null
    agencyPhoneNumber: string | null
    city: string | null
    state: string | null
    country: string | null
    postalCode: string | null
    routingNumber: string | null
    deluxePartnerToken: string | null
}

export type User = {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    phone: string | null
}
export type VIN = {
    errorCode?: string;
    make?: string;
    model?: string;
    year?: string;
    vin?: string;
}

export type CalculatedQuoteInstallments = {
    isDownPaymentRequired: boolean;
    downPaymentAmount: number | null;
    installmentFrequency: CustomerPayFrequency;
    installmentDayValue: string;
    installmentAmount: number;
    installmentAmountWithoutCommission: number;
    quoteFrequency: QuoteFrequency;
    quoteAmount: number | null;
    calculatedQuoteAmount: number | null;
}
export type CountResponse = {
    due: number;
    paid: number;
    total: number;
}
export type Card = {
    id: string;
    is_default: 1 | 0;
    first6digit: number;
    last4digit: string;
    exp_month: string;
    exp_year: string;
    brand: keyof typeof CARD_TYPE_BRAND_MAPPING;
}

export type BankAccount = {
    id: string;
    is_default: 1 | 0;
    routing_number: number;
    account_type: string;
}
export type PaymentRecordingWith = { type: PaymentType | null, id: string | null }
