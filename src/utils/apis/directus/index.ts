// @ts-nocheck
import { aggregate, createItem, createItems, createUser, DirectusRole, readItem, readItems, readMe, readRoles, readUsers, triggerFlow, updateItem, updateMe } from '@directus/sdk';
import moment from 'moment';
import { Roles } from '../../enums/common';
import InvalidCredentialsError from '../../errors/InvalidCredentials';
import parseDirectUsErrors from '../../errors/parseDirectUsErrors';
import SomethingWentWrongError from '../../errors/SomethingWentWrongError';
import agencyMapper from '../../mappers/agencyMapper';
import userMapper from '../../mappers/userMapper';
import { BankAccount, Card, CountResponse } from '../../types/common';
import { DirectusContextClient, DirectusError } from "../../types/directus";
import { CustomDirectusUser, DirectusAgency, DirectusBill, DirectUsCommission, DirectusPayment, DirectusVin } from '../../types/schema';
const formatError = (res: unknown) => {
    return { errors: [res] }
}
export const userLogin = async (client: DirectusContextClient, data: { email: string, password: string }) => {
    try {
        await client.login(data.email, data.password, { mode: 'json' });
    } catch (error) {
        throw parseDirectUsErrors(error as DirectusError)
    }

    const directusUser = await client.request(readMe({ fields: ['*', 'role.*'] })) as CustomDirectusUser

    const role = directusUser.role as DirectusRole
    if (role.name !== Roles.AGENCY && role.name !== Roles.CLIENT) {
        throw new InvalidCredentialsError()
    }


    let directusAgency: DirectusAgency

    if (role.name === Roles.AGENCY) {

        const agencies = await client.request(readItems('agency', {
            filter: {
                agency_manager: directusUser.id
            }
        }))
        if (agencies.length === 0) {
            throw new SomethingWentWrongError()
        }
        directusAgency = agencies[0] as DirectusAgency
    }

    return {
        agency: directusAgency ? agencyMapper(directusAgency) : null,
        user: userMapper(directusUser),
        role
    }
}

export const logout = async (client: DirectusContextClient) => {
    try {
        await client.logout();
    } catch {

    }
}

export const getAgencyDeluxePartnerToken = async (client: DirectusContextClient, agencyId: number) => {
    try {
        const agency = await client.request(readItem('agency', agencyId, { fields: ['deluxe_partner_token'] }));
        return (agency as DirectusAgency).deluxe_partner_token;
    } catch (error) {
        throw parseDirectUsErrors(error as DirectusError);
    }
}
export const findCustomerByEmail = async (client: DirectusContextClient, email: string) => {
    try {
        const users = await client.request(readUsers({
            filter: {
                email,
            },
            fields: ['*', 'role.*']
        }));
        if (userMapper.length > 0) {
            return users[0] as CustomDirectusUser
        }
        return null
    } catch (error) {
        throw parseDirectUsErrors(error as DirectusError)
    }
}
export const findCustomerByPhone = async (client: DirectusContextClient, phone: string) => {
    try {
        const users = await client.request(readUsers({
            filter: {
                phone,
            },
            fields: ['*', 'role.*']
        }));
        if (userMapper.length > 0) {
            return users[0] as CustomDirectusUser
        }
        return null
    } catch (error) {
        throw parseDirectUsErrors(error as DirectusError)
    }
}
export const findOrCreateCustomerSearchByEmail = async (client: DirectusContextClient, email: string, data?: Partial<CustomDirectusUser> = {}) => {
    const user = await findCustomerByEmail(client, email)
    if (user) {
        return user
    }

    try {

        const role = await client.request(readRoles({
            filter: { name: "Client" }
        }));

        if (role.length <= 0) {
            throw new SomethingWentWrongError()
        }
        const clientRole = role[0] as DirectusRole
        const newUserData = { ...data, email, role: clientRole.id };

        const newUser = await client.request(createUser(newUserData));

        return newUser as CustomDirectusUser;
    } catch (error) {
        throw parseDirectUsErrors(error as DirectusError)
    }

}

export const createBill = async (client: DirectusContextClient, data: Partial<DirectusBill>) => {
    try {
        const billData = await client.request(createItem("bill", data))
        return billData as DirectusBill
    } catch (error) {
        throw parseDirectUsErrors(error as DirectusError)
    }

}
export const createVins = async (client: DirectusContextClient, data: Array<Partial<DirectusVin>>) => {
    const vins = await client.request(createItems("vin", data))
    return vins as DirectusVin[]
}

export const getVinsByBill = async (client: DirectusContextClient, billId: number) => {
    const vins = await client.request(readItems("vin", {
        filter: {
            bill: {
                _eq: billId
            }
        }
    }))
    return vins as DirectusVin[]
}

export const getAgencyBillsCounts = async (client: DirectusContextClient, agency: number): Promise<CountResponse> => {
    try {
        const counts = await client.request(aggregate('bill', {
            query: {
                filter: {
                    agency: {
                        _eq: agency
                    }
                }
            },
            aggregate: {
                count: '*'
            },
            groupBy: ['status'],
        }))
        const due = Number(counts.find(count => count.status === 'confirmed')?.count ?? 0)
        const paid = Number(counts.find(count => count.status === 'paid')?.count ?? 0)
        const total = due + paid
        return {
            due, paid, total
        }

    } catch (error) {
        throw parseDirectUsErrors(error as DirectusError)
    }
}

export const getAgencyBills = async (client: DirectusContextClient, agency: number, status?: string, query?: string) => {
    try {
        let filter = {
            agency: {
                _eq: agency
            }
        }
        if (status) {
            filter = {
                ...filter,
                status: {
                    _eq: status
                }
            }
        } else {
            filter = {
                ...filter,
                status: {
                    _in: ['paid', 'confirmed']
                }
            }
        }
        if (query) {
            const nameSplit = query.split(" ")
            if (nameSplit.length > 1 && nameSplit[0] && nameSplit[1]) {
                filter = {
                    ...filter,
                    customer: {
                        first_name: {
                            "_icontains": nameSplit[0]
                        },
                        last_name: {
                            "_icontains": nameSplit[1]
                        }
                    },
                }
            } else {
                filter = {
                    ...filter,
                    "_or": [
                        {
                            policy_id: {
                                "_icontains": query
                            },
                        },
                        {
                            customer: {
                                first_name: {
                                    "_icontains": query
                                }
                            }
                        },
                        {
                            customer: {
                                last_name: {
                                    "_icontains": query
                                }
                            }
                        }
                    ]
                }
            }
        }
        const bills = await client.request(readItems('bill', {
            filter,
            fields: ['*', 'customer.*'],
            sort: ['-date_created']
        }))

        return bills as DirectusBill[]
    } catch (error) {
        throw parseDirectUsErrors(error as DirectusError)
    }
}

export const getAgencyDueBillsByCustomer = async (client: DirectusContextClient, agency: number, customerId: string) => {
    try {
        const bills = await client.request(readItems('bill', {
            filter: {
                agency: {
                    _eq: agency
                },
                customer: {
                    _eq: customerId
                },
                status: {
                    _eq: "confirmed"
                }
            },
            sort: ['-date_created']
        }))
        return bills as DirectusBill[]
    } catch (error) {
        throw parseDirectUsErrors(error as DirectusError)
    }
}
export const searchCustomerByName = async (client: DirectusContextClient, query: string) => {
    try {
        const nameSplit = query.split(" ")
        let filter = {}
        if (nameSplit.length > 1 && nameSplit[0] && nameSplit[1]) {
            filter = {
                first_name: {
                    _icontains: nameSplit[0]
                },
                last_name: {
                    _icontains: nameSplit[1]
                }
            }
        } else {
            filter = {
                _or: [
                    {
                        first_name: {
                            _icontains: query
                        }
                    },
                    {
                        last_name: {
                            _icontains: query
                        }
                    }
                ]
            }
        }
        const res = await client.request(readUsers({
            filter
        }))
        return res as CustomDirectusUser[]
    } catch (error) {
        throw parseDirectUsErrors(error as DirectusError)
    }
}

export const recordCashPayment = async (client: DirectusContextClient, paymentId: number, payload: { amount: number, cash_credit: number }) => {
    try {
        const res = await client.request(triggerFlow('POST', 'e32ada73-5fb1-4e10-a2f4-3eed7ee0a8c1', {
            paymentId,
            ...payload
        }));

        if (res.errors && res.errors.length > 0) {
            throw res
        } else if (!res.errors && res.status !== 200) {
            throw formatError(res)
        }
    } catch (error) {
        throw parseDirectUsErrors(error as DirectusError)
    }

}


export const getBillVins = async (client: DirectusContextClient, billId: number) => {
    try {
        const vins = await client.request(readItems('vin', {
            filter: {
                bill: {
                    _eq: billId
                }
            }
        }))
        return vins as DirectusVin[]
    } catch (error) {
        throw parseDirectUsErrors(error as DirectusError)

    }
}

export const getBillPayments = async (client: DirectusContextClient, billId: number) => {
    try {
        const payments = await client.request(readItems('payments', {
            filter: {
                bill: {
                    _eq: billId
                }
            },
            sort: ['-due_date']
        }))
        return payments as DirectusPayment[]
    } catch (error) {
        throw parseDirectUsErrors(error as DirectusError)

    }
}
export const getBillById = async (client: DirectusContextClient, billId: number) => {
    try {
        const bill = await client.request(readItem('bill', billId, { fields: ['*', 'customer.*'] }))
        return bill as DirectusBill
    } catch (error) {
        throw parseDirectUsErrors(error as DirectusError)

    }
}

export const getCommissionByKey = async (client: DirectusContextClient, key: string) => {
    try {
        const commission = await client.request(readItem('commission', key))
        return commission as DirectUsCommission
    } catch (error) {
        throw parseDirectUsErrors(error as DirectusError)

    }
}

export const getCommissions = async (client: DirectusContextClient) => {
    try {
        const commission = await client.request(readItems('commission', {
            filter: {
                key: {
                    _in: [
                        "card_payment",
                        "direct_debit_payment"
                    ]
                }
            }
        }))
        return commission as DirectUsCommission[]
    } catch (error) {
        throw parseDirectUsErrors(error as DirectusError)

    }
}

export const captureCardPayment = async (
    client: DirectusContextClient,
    payload: {
        paymentId: number,
        cardNumber?: string,
        expMonth?: string,
        expYear?: string,
        cvv?: string,
        cardId?: string,
        enableAutoPayment: boolean
    }) => {
    try {
        const res = await client.request(triggerFlow('POST', '40150a7b-c083-48f8-a2b9-cce82bf24104', payload));

        if (res.errors && res.errors.length > 0) {
            throw res
        } else if (!res.errors && res.status > 299) {
            throw formatError(res)
        }
    } catch (error) {
        throw parseDirectUsErrors(error as DirectusError)
    }

}
export const updateBillStatus = async (
    client: DirectusContextClient,
    billId: number,
    status: string
) => {
    try {
        await client.request(updateItem('bill', billId, {
            status
        }));
    } catch (error) {
        throw parseDirectUsErrors(error as DirectusError)
    }
}


export const getTodaysPaymentByAgency = async (client: DirectusContextClient, agencyId: number) => {
    try {
        const paymentTotal = await client.request(aggregate('payments', {
            aggregate: {
                sum: 'value',
            },
            query: {
                filter: {
                    'paid_date': moment().format("YYYY-MM-DD"),
                    agency: {
                        _eq: agencyId
                    }
                }
            }
        }))
        return Number(paymentTotal[0].sum.value)

    } catch (error) {
        throw parseDirectUsErrors(error as DirectusError)

    }
}

export const updateProfile = async (client: DirectusContextClient, data: Partial<CustomDirectusUser>) => {
    try {
        await client.request(updateMe(data))
    } catch (error) {
        throw parseDirectUsErrors(error as DirectusError)
    }
}

export const getCustomerDueBillsByCustomerId = async (client: DirectusContextClient, customer: string) => {
    try {
        const bills = await client.request(readItems('bill', {
            filter: {
                status: {
                    "_eq": "confirmed"
                },
                customer: {
                    "_eq": customer
                }
            },
            fields: ['*', 'agency.*'],
            sort: ['-date_created']
        }))

        return bills as DirectusBill[]
    } catch (error) {
        throw parseDirectUsErrors(error as DirectusError)
    }
}

export const getCustomerDueBills = async (client: DirectusContextClient) => {
    try {
        const bills = await client.request(readItems('bill', {
            filter: {
                status: {
                    "_eq": "confirmed"
                }
            },
            fields: ['*', 'agency.*'],
            sort: ['-date_created']
        }))

        return bills as DirectusBill[]
    } catch (error) {
        throw parseDirectUsErrors(error as DirectusError)
    }
}
export const getCustomerPaidBills = async (client: DirectusContextClient) => {
    try {
        const bills = await client.request(readItems('bill', {
            filter: {
                status: {
                    "_eq": "paid"
                }
            },
            fields: ['*', 'agency.*'],
            sort: ['-date_created']
        }))

        return bills as DirectusBill[]
    } catch (error) {
        throw parseDirectUsErrors(error as DirectusError)
    }
}
export const getCustomerPaymentSources = async (
    client: DirectusContextClient,
    payload: {
        agency: number
        customer_id?: string
    }) => {
    try {
        const res = await client.request(triggerFlow('GET', '7dc49ef5-ff4d-446f-bced-60cbe1f62110', payload));

        if (res.errors && res.errors.length > 0) {
            throw res
        } else if (!res.errors && res.status > 299) {
            throw formatError(res)
        }
        return res as {
            cards: Card[]
            bank_accounts: BankAccount[]
        }
    } catch (error) {
        throw parseDirectUsErrors(error as DirectusError)
    }

}

export const addUserCard = async (
    client: DirectusContextClient,
    payload: {
        agency: number,
        cardNumber: string,
        expMonth: string,
        expYear: string,
        cvv: string,
        customer_id?: string
    }) => {
    try {
        const res = await client.request(triggerFlow('POST', 'd720ee23-1e90-4a06-8eb1-b1165ce1654f', payload));

        if (res.errors && res.errors.length > 0) {
            throw res
        } else if (!res.errors && res.status > 299) {
            throw formatError(res)
        }
    } catch (error) {
        throw parseDirectUsErrors(error as DirectusError)
    }

}

export const addUserAccount = async (
    client: DirectusContextClient,
    payload: {
        agency: number,
        routingNumber: string,
        accountNumber: string
        customer_id?: string
    }) => {
    try {
        const res = await client.request(triggerFlow('POST', '2ca07167-9029-41b9-9cc5-fd7a8cf453b8', payload));

        if (res.errors && res.errors.length > 0) {
            throw res
        } else if (!res.errors && res.status > 299) {
            throw formatError(res)
        }
    } catch (error) {
        throw parseDirectUsErrors(error as DirectusError)
    }

}


export const deleteUserCard = async (
    client: DirectusContextClient,
    payload: {
        agency: number,
        cardId: string
    }) => {
    try {
        const res = await client.request(triggerFlow('POST', '2e95ae4c-0802-46f0-832b-4de88267bffd', payload));

        if (res.errors && res.errors.length > 0) {
            throw res
        } else if (!res.errors && res.status > 299) {
            throw formatError(res)
        }
    } catch (error) {
        throw parseDirectUsErrors(error as DirectusError)
    }

}
export const captureACHPayment = async (
    client: DirectusContextClient,
    payload: {
        paymentId: number,
        accountNumber?: string,
        routingNumber?: string,
        accountId?: string,
        enableAutoPayment: boolean
    }) => {
    try {
        const res = await client.request(triggerFlow('POST', '29bd6191-0720-44f3-83d4-35b45fafb651', payload));

        if (res.errors && res.errors.length > 0) {
            throw res
        } else if (!res.errors && res.status > 299) {
            throw formatError(res)

        }
    } catch (error) {
        throw parseDirectUsErrors(error as DirectusError)
    }

}
export const validateResetPasswordToken = async (
    client: DirectusContextClient,
    payload: {
        token: string
    }) => {
    try {
        const res = await client.request(triggerFlow('POST', '57eab0a2-49f1-4119-819c-73a59d7bd602', payload));

        if (res.errors && res.errors.length > 0) {
            throw res
        } else if (!res.errors && res.status > 299) {
            throw formatError(res)
        }
    } catch (error) {
        throw parseDirectUsErrors(error as DirectusError)
    }

}

export const resetPassword = async (
    client: DirectusContextClient,
    payload: {
        token: string,
        password: string
    }) => {
    try {
        const res = await client.request(triggerFlow('POST', 'e2bee49f-fcdc-42d8-8f30-9d55d84adb4c', payload));

        if (res.errors && res.errors.length > 0) {
            throw res
        } else if (!res.errors && res.status > 299) {
            throw formatError(res)

        }
    } catch (error) {
        throw parseDirectUsErrors(error as DirectusError)
    }

}

export const registerCustomerOnPayArc = async (
    client: DirectusContextClient,
    payload: {
        customer: string,
        agency: number
    }) => {
    try {
        const res = await client.request(triggerFlow('POST', '34dd08cf-a290-43bf-8e5f-3a1f7952865b', payload));

        if (res.errors && res.errors.length > 0) {
            throw res
        } else if (!res.errors && res.status > 299) {
            throw formatError(res)

        }
    } catch (error) {
        throw parseDirectUsErrors(error as DirectusError)
    }
}

export const resendQuoteConfirmation = async (
    client: DirectusContextClient,
    payload: {
        billId: number,
    }) => {
    try {
        const res = await client.request(triggerFlow('POST', 'b713455b-1b2b-42e4-9cbc-fb27f6e92ca1', payload));
        if (res.errors && res.errors.length > 0) {
            throw res
        } else if (!res.errors && res.status > 299) {
            throw formatError(res)

        }
    } catch (error) {
        throw parseDirectUsErrors(error as DirectusError)
    }
}

export const updateBillUserPayroll = async (
    client: DirectusContextClient,
    payload: {
        billId: number,
        user_payrol_type: CustomerPayFrequency
        weekly: string | null
        biweekly: string | null
        monthly: number | null
        specific_days: string | null
        paid_on_weekends: boolean
    }) => {
    try {
        const res = await client.request(triggerFlow('POST', '5828eb5e-4445-4ae4-ba7a-c59a058fa3d2', payload));
        if (res.errors && res.errors.length > 0) {
            throw res
        } else if (!res.errors && res.status > 299) {
            throw formatError(res)
        }
    } catch (error) {
        throw parseDirectUsErrors(error as DirectusError)
    }
}


export const forgotPassword = async (
    client: DirectusContextClient,
    payload: {
        email: string
    }) => {
    try {
        const res = await client.request(triggerFlow('POST', 'b5a388e0-a717-4189-8b18-c5c76b0d5f7e', payload));
        if (res.errors && res.errors.length > 0) {
            throw res
        } else if (!res.errors && res.status > 299) {
            throw formatError(res)
        }
    } catch (error) {
        throw parseDirectUsErrors(error as DirectusError)
    }
}


export const getLatestPaymentOfBill = async (client: DirectusContextClient, billId: number) => {
    try {
        const payments = await client.request(readItems('payments', {
            filter: {
                bill: {
                    _eq: billId
                }
            },
            sort: ['-due_date'],
            limit: 1,
        }))
        if (payments.length === 1) {
            return payments[0] as DirectusPayment
        }
        return null
    } catch (error) {
        throw parseDirectUsErrors(error as DirectusError)
    }
}
export const fetchPaymentWithToken = async (
    client: DirectusContextClient,
    token: string) => {
    try {
        const res = await client.request(triggerFlow('GET', '3849115a-9434-4137-b755-cea860391384', { token }));

        if (res.payment) {
            return res.payment as DirectusPayment
        }
        return null

    } catch (error) {
        throw parseDirectUsErrors(error as DirectusError)
    }

}
