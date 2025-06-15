import { Col, Form, message, Row } from "antd";
import { useCallback, useEffect, useState } from 'react';
import { LuMail, LuPhone, LuUser } from 'react-icons/lu';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { useDirectUs } from '../../../components/DirectUs/DirectusContext';
import DateSelector from '../../../components/Form/DateSelector';
import FormItem from "../../../components/Form/FormItem";
import PhoneField from "../../../components/Form/PhoneField";
import SelectField from "../../../components/Form/SelectField";
import SubmitButton from "../../../components/Form/SubmitButton";
import TextField from "../../../components/Form/TextField";
import VinInput from "../../../components/Form/VinInput/VinInput";
import { createBill, createVins, findCustomerByEmail, findOrCreateCustomerSearchByEmail, getCustomerDueBillsByCustomerId, registerCustomerOnPayArc, saveDeluxeSession } from '../../../utils/apis/directus/index';
import { emailRegEx } from "../../../utils/contants/regex";
import { BillTypeEnum, CustomerPayFrequency, QuoteFrequency } from '../../../utils/enums/common';
import billDueCalculation from '../../../utils/helpers/billDueCalculation';
import { updateQuote } from "../../../utils/redux/slices/quoteSlice";
import { RootState } from '../../../utils/redux/store';
import { CalculatedQuoteInstallments, VIN } from "../../../utils/types/common";
import { InternalErrors } from "../../../utils/types/errors";
import { CustomDirectusUser } from "../../../utils/types/schema";
import phoneValidator from "../../../utils/validators/phoneValidator";
import { PageHeader, PageSubHeader } from "../../style";
import { monthDropDownOptions } from "./constants";
type CustomerInfoForm = {
    customerEmail: string
    customerFirstName?: string
    customerLastName?: string
    customerPhone?: string
    policyId?: string
    vins: VIN[],
}

const CustomerInfo: React.FC = () => {
    const dispatch = useDispatch()
    const [isSaving, setIsSaving] = useState<boolean>(false)
    const navigate = useNavigate()

    const { directusClient } = useDirectUs();
    const [form] = Form.useForm()
    const [selectedCustomer, setSelectedCustomer] = useState<CustomDirectusUser | null>(null)
    const [loading, setLoading] = useState(false)
    const quote = useSelector(
        ({ quote: stateQuote }: RootState) => stateQuote
    )
    const agencyId = useSelector(({ auth }: RootState) => auth.agency?.id)
    const [calenderDays, setCalenderDays] = useState<number>()
    const fetchUserInformation = useCallback(async (email: string) => {
        try {
            if ((new RegExp(emailRegEx)).test(email)) {
                setLoading(true)
                const customer = await findCustomerByEmail(directusClient, email)
                if (customer) {
                    setSelectedCustomer(customer)
                    form.setFields([
                        {
                            name: 'customerFirstName',
                            value: customer.first_name,
                            errors: []
                        },
                        {
                            name: 'customerLastName',
                            value: customer.last_name,
                            errors: []
                        },
                        {
                            name: 'customerPhone',
                            value: customer.phone
                        }
                    ])
                    return
                }
            }
            setSelectedCustomer(null)
            form.setFields([
                {
                    name: 'customerFirstName',
                    value: "",
                    errors: []
                },
                {
                    name: 'customerLastName',
                    value: "",
                    errors: []
                },
                {
                    name: 'customerPhone',
                    value: ""
                }
            ])
        } catch (error) {
            message.error((error as InternalErrors).message)
        } finally {
            setLoading(false)
        }

    }, [directusClient, form])

    const handleEmailBlur = (event: React.FocusEvent<HTMLInputElement, Element>) => {
        const email = event.target.value
        fetchUserInformation(email)
    }
    useEffect(() => {
        if (quote.customerEmail) {
            fetchUserInformation(quote.customerEmail)
        }
    }, [fetchUserInformation, quote.customerEmail])

    useEffect(() => {
        const month = monthDropDownOptions.find(options => options.value === quote.dueMonth)
        if (month) {
            setCalenderDays(month.days)
        }
    }, [quote.dueMonth])
    const getCustomer = useCallback(async (values: CustomerInfoForm) => {
        let customer: CustomDirectusUser
        if (selectedCustomer) {
            customer = selectedCustomer
        } else {
            customer = await findOrCreateCustomerSearchByEmail(directusClient, values.customerEmail, {
                first_name: values.customerFirstName,
                last_name: values.customerLastName,
                phone: values.customerPhone
            })
        }
        return customer
    }, [directusClient, selectedCustomer])

    const validateForm = useCallback((values: CustomerInfoForm) => {
        if (quote.quoteType === BillTypeEnum.AUTO_INSURANCE && values.vins.some(vin => vin.errorCode !== '0')) {
            message.error('Missing/Invalid VIN(s)')
            return false
        }
        return true
    }, [quote.quoteType])

    const generateBillPayload = useCallback((customer: CustomDirectusUser, values: CustomerInfoForm, calculatedQuoteInfo: CalculatedQuoteInstallments) => {
        return {
            bill_amount: quote.quoteAmount,
            bill_type: quote.quoteType,
            bill_recurrency: quote.quoteFrequency,
            down_payment: quote.isDownPaymentRequired,
            downpayment_value: calculatedQuoteInfo.downPaymentAmount,
            user_payrol_type: (quote.customerPayFrequency === CustomerPayFrequency.SPECIFIC_DAYS && quote.customerPayFrequencyDays.length === 1) ? CustomerPayFrequency.MONTHLY : quote.customerPayFrequency,
            weekly: quote.customerPayFrequency === CustomerPayFrequency.WEEKLY ? quote.weekDays?.toString() : null,
            biweekly: quote.customerPayFrequency === CustomerPayFrequency.BI_WEEKLY ? quote.customerPayFrequencyDays.join(',') : null,
            monthly: (quote.customerPayFrequency === CustomerPayFrequency.SPECIFIC_DAYS && quote.customerPayFrequencyDays.length === 1) ? quote.customerPayFrequencyDays[0] : null,
            specific_days: (quote.customerPayFrequency === CustomerPayFrequency.SPECIFIC_DAYS && quote.customerPayFrequencyDays.length > 1) ? quote.customerPayFrequencyDays.join(',') : null,
            paid_on_weekends: quote.isCustomerGetPaidOnWeekend,
            customer: customer.id,
            agency: agencyId,
            policy_id: values.policyId,
            installments: calculatedQuoteInfo.installmentAmount
        }
    }, [agencyId, quote.customerPayFrequency, quote.customerPayFrequencyDays, quote.isCustomerGetPaidOnWeekend, quote.isDownPaymentRequired, quote.quoteAmount, quote.quoteFrequency, quote.quoteType, quote.weekDays])
    const handleNextClick = useCallback(async (values: CustomerInfoForm) => {
        setIsSaving(true)
        try {
            if (!validateForm(values)) {
                return
            }


            if (values.customerEmail && agencyId) {
                const customer: CustomDirectusUser = await getCustomer(values)
                const alreadyDueBills = await getCustomerDueBillsByCustomerId(directusClient, customer.id)
                if (alreadyDueBills && alreadyDueBills.length > 0) {
                    message.error("Customer is already having one due policy.")
                    return
                }
                const calculatedQuoteInfo = billDueCalculation(quote)

                const deluxeDataStr = sessionStorage.getItem('deluxeData')
                if (deluxeDataStr) {
                    try {
                        const deluxeInfo = JSON.parse(deluxeDataStr)
                        const deluxeCustomerId = deluxeInfo.customerId || deluxeInfo.customer_id || deluxeInfo.CustomerId
                        const deluxeVaultId = deluxeInfo.vaultId || deluxeInfo.vault_id || deluxeInfo.VaultId
                        await saveDeluxeSession(directusClient, {
                            agency: agencyId,
                            customer: customer.id,
                            deluxeData: deluxeInfo,
                            deluxeCustomerId,
                            deluxeVaultId
                        })
                    } catch (err) {
                        console.error(err)
                    }
                }
                await registerCustomerOnPayArc(directusClient, {
                    agency: agencyId,
                    customer: customer.id
                })
                const bill = await createBill(directusClient, generateBillPayload(customer, values, calculatedQuoteInfo))

                if (values.vins?.length > 0) {
                    await createVins(directusClient, values.vins.map(vin => ({
                        vin: vin.vin,
                        bill: bill.id,
                        make: vin.make,
                        model: vin.model,
                        year: vin.year
                    })))
                }

                dispatch(updateQuote({ ...values, id: bill.id }))

                navigate('/agency/quote/summary')
            }

        } catch (error) {
            message.error((error as InternalErrors).message)
        } finally {
            setIsSaving(false)
        }
    }, [agencyId, directusClient, dispatch, generateBillPayload, getCustomer, navigate, quote, validateForm])

    return (
        <Form requiredMark={false} layout="vertical" initialValues={quote} onFinish={handleNextClick} form={form}>
            <Row gutter={[0, 20]} justify={"center"}>
                <Col span={24} style={{ textAlign: "center" }}>
                    <PageHeader level={2}>What is your customer info?</PageHeader>
                </Col>
                <Col xs={24} lg={8}>
                    <Row gutter={[16, 20]}>
                        <Col span={24}>
                            <FormItem
                                label="Email"
                                name="customerEmail"
                                rules={[
                                    { required: true },
                                    { type: 'email' },
                                ]}
                                icon={<LuMail />}
                            >
                                <TextField placeholder="Email" onBlur={handleEmailBlur} loading={loading} />
                            </FormItem>
                        </Col>
                        <Col span={14}>
                            <FormItem
                                label="First Name"
                                name="customerFirstName"
                                rules={[{ required: true, }, { min: 3 }]}
                                icon={<LuUser />}
                            >
                                <TextField placeholder="First Name" disabled={!!selectedCustomer} />
                            </FormItem>
                        </Col>
                        <Col span={10}>
                            <FormItem
                                label="Last Name"
                                name="customerLastName"
                                rules={[{ required: true }, { min: 3 }]}
                            >
                                <TextField placeholder="Last Name" disabled={!!selectedCustomer} />
                            </FormItem>
                        </Col>
                        <Col span={24}>
                            <FormItem
                                label="Phone Cell"
                                name="customerPhone"
                                rules={[
                                    { required: true },
                                    {
                                        validator: phoneValidator
                                    }
                                ]}
                                icon={<LuPhone />}
                            >
                                <PhoneField disabled={!!selectedCustomer} />
                            </FormItem>
                        </Col>
                        <Col span={24}>
                            <PageSubHeader level={3}>
                                {
                                    quote.quoteType === BillTypeEnum.AUTO_INSURANCE ? "Policy ID" : "Account Number"
                                }
                            </PageSubHeader>
                        </Col>
                        <Col span={24}>
                            <FormItem
                                name="policyId"
                                label={quote.quoteType === BillTypeEnum.AUTO_INSURANCE ? "Policy ID" : "Account Number"}
                                rules={[{ required: true, }]}
                                hideLabel
                            >
                                <TextField placeholder={quote.quoteType === BillTypeEnum.AUTO_INSURANCE ? "Policy ID" : "Account Number"} />
                            </FormItem>
                        </Col>
                        {(quote.quoteType === BillTypeEnum.AUTO_INSURANCE) &&
                            <>
                                <Col span={24}>
                                    <PageSubHeader level={3}>
                                        Vin # (s)
                                    </PageSubHeader>
                                </Col>
                                <Col span={24}>
                                    <FormItem name='vins'>
                                        <VinInput />
                                    </FormItem>
                                </Col>
                            </>
                        }
                    </Row>
                </Col>
                <Col span={24}>
                    <PageSubHeader level={3}>
                        What day of the {quote.quoteFrequency === QuoteFrequency.ANNUAL ? 'year' : 'month'} is the Bill Due?
                    </PageSubHeader>
                </Col>
                <Col xs={24} lg={8}>
                    <Row gutter={[16, 20]}>
                        {quote.quoteFrequency === QuoteFrequency.ANNUAL &&

                            <Col span={24}>
                                <FormItem
                                    name="dueMonth"
                                    rules={[{ required: true }]}
                                >
                                    <SelectField showSearch options={monthDropDownOptions} onSelect={(_, record) => {
                                        setCalenderDays(record.days)
                                    }} />
                                </FormItem>
                            </Col>
                        }

                        <Col span={24} style={{ textAlign: "center" }}>
                            <FormItem
                                name="dueDate"
                            >
                                <DateSelector days={calenderDays} />
                            </FormItem>
                        </Col>
                    </Row>
                </Col>
                <Col span={24} style={{ marginTop: "44px", textAlign: 'center', marginBottom: "10px" }}>
                    <SubmitButton htmlType="submit" loading={isSaving}>Sign Up</SubmitButton>
                </Col>
            </Row >
        </Form >
    )
}

export default CustomerInfo;
