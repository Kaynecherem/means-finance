import { DirectusUser } from "@directus/sdk";
import { BillTypeEnum, CustomerPayFrequency, QuoteFrequency } from '../enums/common';

export interface DirectusAgency {
    id: number,
    agency_manager: string | DirectusUser
    account_number: string | null
    address_one: string | null
    address_two: string | null
    agency_bank_name: string | null
    agency_email: string | null
    agency_name: string | null
    agency_phone_number: string | null
    city: string | null
    state: string | null
    country: string | null
    postal_code: string | null
    routing_number: string | null
    deluxe_partner_token: string | null
}

export interface DirectusBill {
    id: number,
    bill_type: BillTypeEnum
    bill_recurrency: QuoteFrequency
    bill_amount: number | null
    down_payment: boolean
    downpayment_value: number | null
    downpayment_value_without_commission: number | null
    due_date: string | null
    user_payrol_type: CustomerPayFrequency
    weekly: string | null
    biweekly: string | null
    monthly: number | null
    specific_days: string | null
    paid_on_weekends: boolean
    phone: string | null
    policy_id: string | null
    customer: string | CustomDirectusUser | null
    agency: number | DirectusAgency | null
    installments: number | null
    installments_without_commission: number | null
    next_installment_date: string | null
    status: string
    date_created: string
    credit_amount: string | null
}

export interface DirectusVin {
    id: number
    vin: string
    bill: number | DirectusBill | null
    make: string | null
    model: string | null
    year: string | null
}


interface CustomUser {
    phone: string | null
}

export interface CustomDirectusUser extends DirectusUser, CustomUser { }

export interface DirectusPayment {
    id: number
    bill: number | DirectusBill | null
    down_payment: boolean
    due_date: string | null
    paid_date: string | null
    method: string | null
    status: string | null
    customer: string | CustomDirectusUser | null
    value: string | null
    cash_payment: string | null
    agency: number | DirectusAgency | null
}

export interface DirectUsCommission {
    key: string
    value: string
}
export interface Schema {
    agency: DirectusAgency
    bill: DirectusBill
    vin: DirectusVin
    directus_user: CustomUser
    payments: DirectusPayment
    commission: DirectUsCommission
}
