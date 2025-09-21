import LoadingOutlined from '@ant-design/icons/LoadingOutlined'
import { Col, message, Row, Skeleton } from "antd"
import { ColumnsType } from "antd/es/table"
import moment from "moment"
import { useCallback, useEffect, useState } from "react"
import { LuDollarSign } from "react-icons/lu"
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from "react-router-dom"
import BillIcon from "../../../components/BillIcon"
import Box from "../../../components/Box"
import BoxWrapper from "../../../components/BoxWrapper"
import { useDirectUs } from '../../../components/DirectUs/DirectusContext'
import DueNow from "../../../components/DueNow"
import FormIcon from "../../../components/Form/FormIcon"
import { getBillPayments, getBillVins, stageCustomerPaymentMethod } from "../../../utils/apis/directus"
import { BillTypeEnum } from "../../../utils/enums/common"
import billTypeMapper from '../../../utils/helpers/billTypeMapper'
import { updateCollect } from "../../../utils/redux/slices/collectSlice"
import { RootState } from '../../../utils/redux/store'
import { InternalErrors } from "../../../utils/types/errors"
import { DirectusAgency, DirectusPayment, DirectusVin } from "../../../utils/types/schema"
import { PageSubHeader, StatusWrapper } from "../../style"
import { CustomerName } from "../style"
import { BillDueWrapper, PayButton, PaymentHistoryTable, PolicyInfo, StatusPill, SummaryWrapper, TableHelperText } from "./style"

const CustomerSummary = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const customer = useSelector(({ collect }: RootState) => collect.customer)
    const bill = useSelector(({ collect }: RootState) => collect.bill)
    const selectedPaymentId = useSelector(({ collect }: RootState) => collect.selectedPaymentId)
    const [vins, setVins] = useState<Array<DirectusVin>>([])
    const [vinsLoading, setVinsLoading] = useState(true)
    const [paymentsLoading, setPaymentsLoading] = useState(true)
    const [payments, setPayments] = useState<Array<DirectusPayment>>([])
    const [duePayment, setDuePayment] = useState<DirectusPayment | null>(null);
    const [statusPayment, setStatusPayment] = useState<DirectusPayment | null>(null);
    const { directusClient } = useDirectUs()
    const dispatch = useDispatch()
    const columns: ColumnsType<DirectusPayment> = [
        {
            title: "Status",
            key: 'status',
            dataIndex: "status",
            render: (text: string) => <StatusWrapper status={text}>{text}</StatusWrapper>,
            align: "left"
        },
        {
            title: "Due date",
            key: 'dueDate',
            dataIndex: "due_date",
            render: (text: string) => moment(text).format('MM/DD/YY'),
            align: "center"
        },
        {
            title: 'Amount',
            key: "amount",
            dataIndex: "value",
            align: 'right',
            render: (amount: string, record) => <div>
                ${Number(amount).toFixed(2)}
                {record.method === 'cash' &&
                    <TableHelperText>{`Cash Collected - $${Number(record.cash_payment).toFixed(2)}`}</TableHelperText>
                }
                {bill && record.status === 'upcoming' && Number(bill.credit_amount ?? 0) > 0 &&
                    <TableHelperText>{`Credit - $${Number(bill.credit_amount).toFixed(2)}`}</TableHelperText>

                }
            </div>
        }
    ]
    const fetchVins = useCallback(async () => {
        try {
            setVinsLoading(true);
            if (
                bill?.id &&
                (
                    bill.bill_type === BillTypeEnum.AUTO_INSURANCE ||
                    bill.bill_type === BillTypeEnum.AUTO_PAYMENT
                )
            ) {
                const vinsRes = await getBillVins(directusClient, bill.id)
                setVins(vinsRes)
            }
        } catch (error) {
            message.error((error as InternalErrors).message)
        } finally {
            setVinsLoading(false)
        }
    }, [bill?.bill_type, bill?.id, directusClient])

    useEffect(() => {
        fetchVins()
    }, [fetchVins])

    const locationPaymentId = (location.state as { paymentId?: number } | null)?.paymentId

    const fetchPayments = useCallback(async () => {
        try {
            setPaymentsLoading(true)
            if (bill?.id) {
                const directusPayments = await getBillPayments(directusClient, bill.id)

                const targetPaymentId = locationPaymentId ?? selectedPaymentId ?? null
                const selectedPayment = targetPaymentId
                    ? directusPayments.find(payment => payment.id === targetPaymentId) ?? null
                    : null

                const firstNonPaid = directusPayments.find(payment => payment.status !== 'paid') ?? null

                const hasUpcomingPayment = directusPayments.some(payment => (payment.status ?? '').toLowerCase() === 'upcoming')
                const upcomingPayment = !hasUpcomingPayment && bill.next_installment_date
                    ? {
                        status: "upcoming" as DirectusPayment['status'],
                        id: -1,
                        bill: null,
                        down_payment: false,
                        due_date: bill.next_installment_date,
                        paid_date: null,
                        method: null,
                        customer: null,
                        value: `${Number(bill.installments ?? 0) - Number(bill.credit_amount ?? 0)}`,
                        cash_payment: null,
                        agency: null
                    } as DirectusPayment
                    : null

                const normalizedPayments = upcomingPayment
                    ? [upcomingPayment, ...directusPayments]
                    : directusPayments

                const displayPayment = selectedPayment ?? firstNonPaid ?? (normalizedPayments.length > 0 ? normalizedPayments[0] : null)

                const isPayable = (payment: DirectusPayment | null) => {
                    if (!payment || payment.id <= 0) {
                        return false;
                    }

                    const normalizedStatus = (payment.status ?? '').toLowerCase();

                    if (!normalizedStatus || normalizedStatus === 'pending' || normalizedStatus === 'paid') {
                        return false;
                    }

                    return true;
                };

                const payablePayment = isPayable(selectedPayment)
                    ? selectedPayment
                    : directusPayments.find(payment => isPayable(payment)) ?? null

                setDuePayment(payablePayment);
                setStatusPayment(displayPayment ?? null);

                const normalizedSelectedId = payablePayment?.id ?? null
                if (selectedPaymentId !== normalizedSelectedId) {
                    dispatch(updateCollect({ selectedPaymentId: normalizedSelectedId }));
                }

                setPayments(normalizedPayments);
            } else {
                setPayments([])
                setDuePayment(null)
                setStatusPayment(null)
            }
        } catch (error) {
            message.error((error as InternalErrors).message)
        } finally {
            setPaymentsLoading(false)
        }
    }, [bill, directusClient, dispatch, locationPaymentId, selectedPaymentId])
    useEffect(() => {
        fetchPayments()
    }, [fetchPayments])

    const handlePay = async () => {
        try {
            if (customer?.id && bill?.agency) {
                const agencyId = typeof bill.agency === 'object' ? (bill.agency as DirectusAgency).id : bill.agency
                await stageCustomerPaymentMethod(directusClient, {
                    customer_id: customer.id,
                    agency: String(agencyId)
                })
            }
            dispatch(updateCollect({ selectedPaymentId: duePayment?.id ?? null }))
            navigate('/agency/collect/payment', {
                state: {
                    duePayment
                }
            })
        } catch (error) {
            message.error((error as InternalErrors).message)
        }
    }
    const getDueDuration = (date: string) => {
        const dueDate = moment(date).endOf('day')

        const diff = moment(dueDate).diff(moment.now())
        if (diff === 0) {
            return `${moment.utc(diff).format('h')} min`
        } else if (diff > 0) {
            return `${moment.utc(diff).format('h')} hrs - ${moment.utc(diff).format('m')} min`
        } else {
            return '0 min'
        }
    }
    const isPaidStatus = statusPayment?.status === 'paid'

    return (
        <BoxWrapper>
            <Row gutter={[24, 24]}>
                <Col xs={24} lg={13}>
                    {bill && customer &&
                        <Box>
                            <SummaryWrapper>
                                <Row gutter={[0, 24]}>
                                    <Col span={24}>
                                        <CustomerName>
                                            <span>{customer.first_name} {customer.last_name}</span>
                                            {statusPayment?.status &&
                                                <StatusPill status={statusPayment.status}>{statusPayment.status}</StatusPill>
                                            }
                                            {/* <Button type='link'><LuPenSquare /></Button> */}
                                        </CustomerName>
                                    </Col>
                                    <Col span={24}>
                                        <BillDueWrapper>
                                            {statusPayment?.due_date && !isPaidStatus &&
                                                <>
                                                    <div className='text'>Bill due in</div>
                                                    <div className='time'>{getDueDuration(statusPayment.due_date)}</div>
                                                </>
                                            }
                                        </BillDueWrapper>
                                    </Col>
                                    <Col span={24}>
                                        <PolicyInfo>
                                            <div className='info-row'>
                                                <div className='info-title'>
                                                    Carrier
                                                </div>
                                                <div className='info-value'>
                                                    <FormIcon icon={<BillIcon type={bill.bill_type} />} />{billTypeMapper(bill.bill_type)}
                                                </div>
                                            </div>
                                            {/* <div className='info-row'>
                                                <div className='info-title'>
                                                    All State
                                                </div>
                                                <div className='info-value'>
                                                    2013 Nissan Altima
                                                </div>
                                            </div> */}
                                            {
                                                (bill.bill_type === BillTypeEnum.AUTO_INSURANCE || bill.bill_type === BillTypeEnum.AUTO_PAYMENT) &&
                                                <div className='info-row vins'>
                                                    <div className='info-title'>
                                                        VIN
                                                    </div>
                                                    <div className='info-value'>
                                                        {vinsLoading &&
                                                            <Skeleton.Input size="small" active />
                                                        }
                                                        {!vinsLoading &&
                                                            <>
                                                                {
                                                                    vins.map(vin => <div key={vin.vin}>{vin.vin}</div>)
                                                                }
                                                            </>
                                                        }
                                                    </div>
                                                </div>
                                            }
                                            <div className='info-row'>
                                                <div className='info-title'>
                                                    Policy ID
                                                </div>
                                                <div className='info-value'>
                                                    {bill.policy_id}
                                                </div>
                                            </div>
                                        </PolicyInfo>
                                    </Col>
                                    {paymentsLoading &&
                                        <Col span={24} style={{ paddingTop: "16px", textAlign: 'center' }}>
                                            <Skeleton.Node active style={{ width: '350px', height: "117px" }}><LuDollarSign /></Skeleton.Node>
                                        </Col>
                                    }
                                    {!paymentsLoading && statusPayment?.value && !isPaidStatus &&
                                        <Col span={24} style={{ paddingTop: "16px" }}>
                                            <DueNow amount={Number(statusPayment.value)} type="danger" />
                                        </Col>
                                    }
                                    <Col span={24}>
                                        <PayButton onClick={handlePay} disabled={!duePayment || duePayment.status === 'pending'}>Pay</PayButton>
                                    </Col>
                                </Row>
                            </SummaryWrapper>
                        </Box>
                    }
                </Col>
                <Col xs={24} lg={11}>
                    <Box>
                        <SummaryWrapper>
                            <Row gutter={[0, 24]}>
                                <Col span={24}>
                                    <PageSubHeader style={{ textAlign: "left", margin: 0 }}>
                                        Payment History
                                    </PageSubHeader>
                                </Col>
                                <Col span={24}>
                                    <PaymentHistoryTable
                                        dataSource={payments}
                                        columns={columns}
                                        pagination={false}
                                        loading={{
                                            spinning: paymentsLoading,
                                            indicator: <LoadingOutlined />
                                        }}
                                    />
                                </Col>
                            </Row>
                        </SummaryWrapper>
                    </Box>
                </Col>
            </Row>
        </BoxWrapper>

    )
}

export default CustomerSummary
