import { Col, Form, message, Row } from "antd";
import { useCallback, useEffect, useMemo, useState } from 'react';
import { LuArrowLeft, LuArrowRight } from "react-icons/lu";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import Box from "../../../components/Box";
import BoxWrapper from "../../../components/BoxWrapper";
import { useDirectUs } from "../../../components/DirectUs/DirectusContext";
import DueNow from "../../../components/DueNow";
import FormItem from "../../../components/Form/FormItem";
import SubmitButton from "../../../components/Form/SubmitButton";
import TabRadioSelection from "../../../components/Form/TabRadioSelection";
import { recordCashPayment, captureDeluxeACHPayment, captureDeluxeCardPayment, stageCustomerPaymentMethod, fetchCustomerAgencyFlowNew, deluxeCreateNewACH, deluxeCreateNewCard } from '../../../utils/apis/directus';
import { PaymentType, Roles } from "../../../utils/enums/common";
import { RootState } from "../../../utils/redux/store";
import { BankAccount, Card, PaymentRecordingWith } from '../../../utils/types/common';
import { CARD_TYPE_BRAND_MAPPING } from '../../../utils/contants/common';
import { InternalErrors } from "../../../utils/types/errors";
import { DirectusPayment, DirectusAgency } from '../../../utils/types/schema';
import { PageBackButton, PageSubHeader } from "../../style";
import CardPayment from "./CardPayment";
import CashPayment from "./CashPayment";
import DirectDebitPayment from "./DirectDebitPayment";
import { PaymentWrapper } from "./style";
import DeluxePaymentModal, { DeluxeTokenData } from '../../../components/DeluxePaymentModal';
type PaymentFormValues = {
    paymentType: PaymentType
    amount?: number
    cardNumber?: string
    expiry?: {
        month: string,
        year: string
    },
    cvv?: string,
    account?: string,
    routing?: string
}
const Payment = () => {
    const navigate = useNavigate()
    const { directusClient } = useDirectUs()
    const userRole = useSelector((state: RootState) => state.auth.role)
    const { state: { duePayment } }: { state: { duePayment: DirectusPayment | null } } = useLocation()
    const [form] = Form.useForm<PaymentFormValues>()
    const [paymentRecording, setPaymentRecording] = useState(false)
    const [enableAutoPayment, setEnableAutoPayment] = useState(true)
    const [paymentRecordingWith, setPaymentRecordingWith] = useState<PaymentRecordingWith>({
        type: null,
        id: null
    })
    const [isPaymentSourceLoading, setIsPaymentSourceLoading] = useState(true)
    const [cards, setCards] = useState<Array<Card>>([])
    const [bankAccounts, setBankAccounts] = useState<Array<BankAccount>>([])
    const [showAddPaymentMethod, setShowAddPaymentMethod] = useState(false)
    const [deluxePaymentType, setDeluxePaymentType] = useState<PaymentType | null>(null)
    const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<string | null>(null)
    const successUrl = useMemo(() => userRole === Roles.AGENCY ? "/agency/collect/success" : "/payment/success", [userRole])
    const errorUrl = useMemo(() => userRole === Roles.AGENCY ? "/agency/collect/error" : "/payment/error", [userRole])
    const backUrl = useMemo(() => userRole === Roles.AGENCY ? "/agency/collect/customer-summary" : "my-bills", [userRole])
    const fetchCardInfo = useCallback(
        async () => {
            if (duePayment?.agency && duePayment.customer) {
                try {
                    setIsPaymentSourceLoading(true)
                    const agencyId = typeof duePayment.agency === 'object' ? (duePayment.agency as DirectusAgency).id : duePayment.agency
                    // ensure directus stages latest payment methods before fetching them
                    await stageCustomerPaymentMethod(directusClient, {
                        customer_id: duePayment.customer as string,
                        agency: String(agencyId)
                    })
                    const res: any[] = await fetchCustomerAgencyFlowNew(directusClient, {
                        agency: String(agencyId),
                        customer_id: duePayment.customer as string
                    })
                    const customerMethods = res.filter(pm => pm.owner === duePayment.customer)
                    const fetchedCards: Card[] = customerMethods
                        .filter(pm => pm.expiry)
                        .map(pm => ({
                            id: pm.payment_method_id,
                            is_default: 0,
                            first6digit: Number(pm.masked_pan?.slice(0, 6)),
                            last4digit: pm.masked_pan?.slice(-4),
                            exp_month: pm.expiry.split('/')[0],
                            exp_year: pm.expiry.split('/')[1],
                            brand: pm.card_type?.[0]?.toUpperCase() as keyof typeof CARD_TYPE_BRAND_MAPPING
                        }))
                    const fetchedAccounts: BankAccount[] = customerMethods
                        .filter(pm => pm.routing_number)
                        .map(pm => ({
                            id: pm.payment_method_id,
                            is_default: 0,
                            routing_number: Number(pm.routing_number),
                            account_type: pm.account_type
                        }))
                    setCards(fetchedCards)
                    setBankAccounts(fetchedAccounts)
                } catch (error) {
                    message.error((error as InternalErrors).message)
                } finally {
                    setIsPaymentSourceLoading(false)
                }
            }
        },
        [directusClient, duePayment],
    )
    useEffect(() => {
        if (!duePayment) {
            navigate(backUrl, { replace: true })
        } else {
            fetchCardInfo()
        }
    }, [backUrl, duePayment, fetchCardInfo, navigate])

    const handlePaymentMethodAdd = async (tokenData?: DeluxeTokenData) => {
        if (duePayment?.agency && duePayment.customer) {
            try {
                const agencyId = typeof duePayment.agency === 'object' ? (duePayment.agency as DirectusAgency).id : duePayment.agency;
                if (tokenData) {
                    const payload = {
                        ...tokenData,
                        customer_id: duePayment.customer as string,
                        agency: String(agencyId)
                    };
                    if (deluxePaymentType === PaymentType.CARD) {
                        await deluxeCreateNewCard(directusClient, payload);
                    } else if (deluxePaymentType === PaymentType.DIRECT_DEBIT) {
                        await deluxeCreateNewACH(directusClient, payload);
                    }
                }
                await stageCustomerPaymentMethod(directusClient, {
                    customer_id: duePayment.customer as string,
                    agency: String(agencyId)
                });
                await fetchCardInfo();
            } catch (error) {
                message.error((error as InternalErrors).message);
            }
        }
    }

    const cashCollection = async (payment: DirectusPayment, values: PaymentFormValues) => {

        if (values.amount && Number(values.amount) > Number(payment.value)) {
            navigate('/agency/collect/changes-due', {
                replace: true,
                state: {
                    duePayment: payment,
                    collectedAmount: values.amount
                }
            })
        } else if (values.amount && Number(values.amount) === Number(payment.value)) {
            try {
                setPaymentRecording(true)
                await recordCashPayment(directusClient, payment.id, {
                    amount: Number(payment.value),
                    cash_credit: 0
                })
                navigate(successUrl, { replace: true })
            } catch (error) {
                message.error((error as InternalErrors).message)
                navigate(errorUrl, { replace: true })
            } finally {
                setPaymentRecording(false)
            }
        } else {
            message.error("Please enter collected amount which should be at least due amount.")
        }
    }
    const cardCollectionById = async (cardId: string) => {
        try {
            setPaymentRecordingWith({
                type: PaymentType.CARD,
                id: cardId
            })
            setPaymentRecording(true)
            const agencyId = typeof duePayment?.agency === 'object' ? (duePayment.agency as DirectusAgency).id : duePayment?.agency
            await captureDeluxeCardPayment(
                directusClient,
                {
                    customer_id: duePayment?.customer as string,
                    agency: String(agencyId),
                    bill_payment_id: duePayment?.id as number,
                    payment_method_id: cardId
                }
            )
            navigate(successUrl, { replace: true })
        } catch (error) {
            message.error((error as InternalErrors).message)
            navigate(errorUrl, {
                replace: true, state: {
                    message: (error as InternalErrors).message
                }
            })

        } finally {
            setPaymentRecordingWith({
                type: null,
                id: null
            })
            setPaymentRecording(false)
        }
    }
    const directDebitCollectionById = async (accountId: string) => {
        try {
            setPaymentRecordingWith({
                type: PaymentType.DIRECT_DEBIT,
                id: accountId
            })
            setPaymentRecording(true)
            const agencyId = typeof duePayment?.agency === 'object' ? (duePayment.agency as DirectusAgency).id : duePayment?.agency
            await captureDeluxeACHPayment(
                directusClient,
                {
                    customer_id: duePayment?.customer as string,
                    agency: String(agencyId),
                    bill_payment_id: duePayment?.id as number,
                    payment_method_id: accountId
                }
            )
            navigate(successUrl, { replace: true })
        } catch (error) {
            message.error((error as InternalErrors).message)
            navigate(errorUrl, {
                replace: true,
                state: {
                    message: (error as InternalErrors).message
                }
            })

        } finally {
            setPaymentRecordingWith({
                type: null,
                id: null
            })
            setPaymentRecording(false)
        }
    }
    const handleCashSubmit = async (values: PaymentFormValues) => {
        if (duePayment) {
            await cashCollection(duePayment, values)
        } else {
            message.error("Something went wrong.")
            navigate(backUrl, { replace: true })
        }
    }
    const handlePayment = async () => {
        if (!duePayment) {
            message.error("Something went wrong.")
            navigate(backUrl, { replace: true })
            return
        }
        const paymentType = form.getFieldValue('paymentType')
        switch (paymentType) {
            case PaymentType.CASH:
                form.submit()
                break
            case PaymentType.CARD:
                if (selectedPaymentMethodId) {
                    await cardCollectionById(selectedPaymentMethodId)
                } else {
                    message.error("Please select a card.")
                }
                break
            case PaymentType.DIRECT_DEBIT:
                if (selectedPaymentMethodId) {
                    await directDebitCollectionById(selectedPaymentMethodId)
                } else {
                    message.error("Please select an account.")
                }
                break
            default:
                break
        }
    }
    return (
        <>
        <BoxWrapper type='large'>
            <Row gutter={[24, 24]}>
                <Col xs={24} lg={24}>
                    <Box>
                        <Form form={form} requiredMark={false} layout="vertical" onFinish={handleCashSubmit}>
                            <PaymentWrapper>
                                <PageBackButton
                                    onClick={() => navigate(backUrl)}
                                >
                                    <LuArrowLeft />
                                </PageBackButton>
                                {duePayment &&
                                    <Row gutter={[0, 24]} justify={'center'}>
                                        <Col span={24}>
                                            <DueNow amount={Number(duePayment?.value)} type="danger" />
                                        </Col>
                                        <Col span={24}>
                                            {userRole === Roles.AGENCY &&
                                                <PageSubHeader>
                                                    How is the customer paying?
                                                </PageSubHeader>
                                            }
                                            {userRole === Roles.CLIENT &&
                                                <PageSubHeader>
                                                    How you are paying?
                                                </PageSubHeader>
                                            }
                                        </Col>
                                        <Col span={24} style={{ textAlign: 'center' }}>
                                            <FormItem
                                                name="paymentType"
                                                initialValue={userRole === Roles.AGENCY ? PaymentType.CASH : PaymentType.CARD}
                                            >
                                                <TabRadioSelection
                                                    options={[
                                                        ...(userRole === Roles.AGENCY ? [{
                                                            value: PaymentType.CASH,
                                                            label: "Cash"
                                                        }] : []),
                                                        {
                                                            value: PaymentType.CARD,
                                                            label: 'Card'
                                                        },
                                                        {
                                                            value: PaymentType.DIRECT_DEBIT,
                                                            label: "Direct Debit"
                                                        }
                                                    ]}
                                                    onChange={() => setSelectedPaymentMethodId(null)}
                                                />
                                            </FormItem>
                                        </Col>
                                        <Col xs={24} lg={8}>
                                            <Form.Item
                                                noStyle
                                                shouldUpdate={(prevValues, currentValues) => prevValues.paymentType !== currentValues.paymentType}
                                            >
                                                {
                                                    ({ getFieldValue }) => {
                                                        switch (getFieldValue('paymentType')) {
                                                            case PaymentType.CASH:
                                                                return <CashPayment duePayment={duePayment} />
                                                            case PaymentType.CARD:
                                                                return <CardPayment
                                                                    autoPayment={enableAutoPayment}
                                                                    onAutoPaymentChange={setEnableAutoPayment}
                                                                    loading={isPaymentSourceLoading}
                                                                    cards={cards}
                                                                    onCardSelect={setSelectedPaymentMethodId}
                                                                    paymentRecordingWith={paymentRecordingWith}
                                                                    selectedCardId={selectedPaymentMethodId ?? undefined}
                                                                    amount={Number(duePayment?.value)}
                                                                    onAddCard={() => {
                                                                        setDeluxePaymentType(PaymentType.CARD)
                                                                        setShowAddPaymentMethod(true)
                                                                    }}
                                                                />
                                                            case PaymentType.DIRECT_DEBIT:
                                                                return <DirectDebitPayment
                                                                    autoPayment={enableAutoPayment}
                                                                    onAutoPaymentChange={setEnableAutoPayment}
                                                                    loading={isPaymentSourceLoading}
                                                                    bankAccounts={bankAccounts}
                                                                    onAccountSelect={setSelectedPaymentMethodId}
                                                                    paymentRecordingWith={paymentRecordingWith}
                                                                    selectedAccountId={selectedPaymentMethodId ?? undefined}
                                                                    amount={Number(duePayment?.value)}
                                                                    onAddAccount={() => {
                                                                        setDeluxePaymentType(PaymentType.DIRECT_DEBIT)
                                                                        setShowAddPaymentMethod(true)
                                                                    }}
                                                                />

                                                            default:
                                                                return null;
                                                        }
                                                    }
                                                }
                                            </Form.Item>
                                        </Col>
                                        <Col span={24} style={{ textAlign: 'center' }}>
                                            <SubmitButton
                                                htmlType="button"
                                                icon={<LuArrowRight />}
                                                style={{ marginTop: "16px" }}
                                                loading={paymentRecording}
                                                onClick={handlePayment}
                                            >
                                                {userRole === Roles.AGENCY ? "Collect Payment" : "Pay"}
                                            </SubmitButton>
                                        </Col>
                                    </Row>
                                }
                            </PaymentWrapper>
                        </Form>
                    </Box>
                </Col>
            </Row>
        </BoxWrapper>
        <DeluxePaymentModal
            open={showAddPaymentMethod}
            onClose={() => {
                setShowAddPaymentMethod(false)
                setDeluxePaymentType(null)
            }}
            onPaymentAdd={handlePaymentMethodAdd}
            paymentType={deluxePaymentType}
        />
        </>

    )
}

export default Payment
