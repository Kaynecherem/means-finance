
import LoadingOutlined from '@ant-design/icons/LoadingOutlined'
import { Col, message, Popconfirm, Row } from "antd"
import { ColumnsType } from 'antd/es/table'
import { useCallback, useEffect, useState } from "react"
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import Box from "../../components/Box"
import BoxContainer from "../../components/BoxContainer"
import BoxWrapper from "../../components/BoxWrapper"
import CountBadge from "../../components/CountBadge"
import CustomizedTable from '../../components/CustomisedTable'
import { useDirectUs } from '../../components/DirectUs/DirectusContext'
import FormItem from "../../components/Form/FormItem"
import InlineButton from '../../components/Form/InlineButton'
import SearchBox from "../../components/Form/SearchBox"
import FullWidthTab from "../../components/FullWidthTab"
import { getAgencyBills, getAgencyBillsCounts, getVinsByBill, updateBillStatus } from "../../utils/apis/directus"
import { BillTypeEnum, CustomerPayFrequency } from '../../utils/enums/common'
import { updateQuote } from '../../utils/redux/slices/quoteSlice'
import { RootState } from '../../utils/redux/store'
import { castCustomer } from '../../utils/typeFilters/castCustomer'
import { CountResponse, VIN } from '../../utils/types/common'
import { InternalErrors } from '../../utils/types/errors'
import { DirectusBill } from '../../utils/types/schema'
import PaymentHistory from './PaymentHistory'
import { ActionWrapper, HelpText, ManageTableWrapper, TabLabelWrapper } from './style'

const Manage = () => {
    const param = useParams<{
        filter?: string
    }>()
    // const theme = useTheme()
    const { directusClient } = useDirectUs();
    const [searchparams] = useSearchParams()
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    const [bills, setBills] = useState<Array<DirectusBill>>([])
    const [counts, setCounts] = useState<CountResponse | null>(null)
    const [confirmingRecord, setConfirmingRecord] = useState<DirectusBill | null>(null)
    const [detailRecord, setDetailRecord] = useState<DirectusBill | null>(null)
    const agencyId = useSelector((state: RootState) => state.auth.agency?.id)
    const dispatch = useDispatch()
    const getPayDays = (bill: DirectusBill) => {
        if (bill.user_payrol_type === CustomerPayFrequency.BI_WEEKLY) {
            return bill.biweekly?.split(',').map(value => Number(value))
        } else if (bill.user_payrol_type === CustomerPayFrequency.MONTHLY) {
            return bill.monthly ? [bill.monthly] : []
        } else if (bill.user_payrol_type === CustomerPayFrequency.SPECIFIC_DAYS) {
            return bill.specific_days?.split(',').map(value => Number(value))
        }
        return []
    }



    const renewPolicy = async (bill: DirectusBill) => {
        let vins: VIN[] = []
        if (bill.bill_type === BillTypeEnum.AUTO_INSURANCE || bill.bill_type === BillTypeEnum.AUTO_PAYMENT) {
            const vinsRes = await getVinsByBill(directusClient, bill.id)
            vins = vinsRes.map(vin => ({
                vin: vin.vin ?? undefined,
                make: vin.make ?? undefined,
                model: vin.model ?? undefined,
                year: vin.year ?? undefined,
                errorCode: "0"
            }))

        }
        const userPayrollMapper = (type?: string) => {
            switch (type) {
                case "weekly":
                    return CustomerPayFrequency.WEEKLY
                case "biweekly":
                    return CustomerPayFrequency.BI_WEEKLY
                case "monthly":
                    return CustomerPayFrequency.SPECIFIC_DAYS
                case "specific_days":
                    return CustomerPayFrequency.SPECIFIC_DAYS
                default:
                    return CustomerPayFrequency.WEEKLY
            }
        }
        dispatch(updateQuote({
            quoteType: bill.bill_type,
            quoteFrequency: bill.bill_recurrency,
            quoteAmount: Number(bill.bill_amount),
            isDownPaymentRequired: bill.down_payment,
            downPaymentAmount: Number(bill.downpayment_value),
            customerPayFrequency: userPayrollMapper(bill.user_payrol_type),
            weekDays: bill.weekly !== null ? Number(bill.weekly) : null,
            customerPayFrequencyDays: getPayDays(bill),
            isCustomerGetPaidOnWeekend: bill.paid_on_weekends,
            customerEmail: castCustomer(bill.customer)?.email,
            customerFirstName: castCustomer(bill.customer)?.first_name,
            customerLastName: castCustomer(bill.customer)?.last_name,
            customerPhone: castCustomer(bill.customer)?.phone,
            policyId: bill.policy_id,
            vins
        }))
        navigate('/agency/quote/bill-type')
    }
    const columns: ColumnsType<DirectusBill> = [
        // {
        //     title: "Carrier",
        //     key: 'Carrier',
        //     dataIndex: "carrier",
        // },
        {
            title: "Name",
            key: 'Name',
            dataIndex: ["customer", "first_name"],
            render: (_, record) => `${castCustomer(record.customer)?.first_name} ${castCustomer(record.customer)?.last_name}`
        },
        {
            title: "Policy ID",
            key: 'PolicyId',
            dataIndex: "policy_id",
            ellipsis: true,
        },
        {
            title: "Amount",
            key: 'Amount',
            dataIndex: "bill_amount",
            render: amount => `$${Number(amount ?? 0).toFixed(2)}`,
            width: 100
        },
        // {
        //     title: "",
        //     key: "Progress",
        //     dataIndex: "progress",
        //     render: (progress) => <Progress percent={progress} showInfo={false} strokeColor={theme.systemDefaults.colorPrimary} />,
        //     width: 170,
        //     hidden: !param.filter || param.filter === 'all'
        // },
        {
            title: "Actions",
            key: 'Actions',
            dataIndex: "id",
            align: 'right',
            render: (_, record) => (
                <ActionWrapper>
                    <InlineButton onClick={() => { setDetailRecord(record) }}>Payment History</InlineButton>
                    {record.status === "confirmed" &&
                        <Popconfirm
                            title="Confirm Paid"
                            description="Are you sure to mark this policy as paid?"
                            onConfirm={() => markPolicyPaid(record)}
                            okText="Confirm"
                            cancelText="Cancel"
                            okButtonProps={{
                                loading: record.id === confirmingRecord?.id
                            }}
                        >
                            <InlineButton type="primary" style={{ minWidth: "114px" }}>Paid Policy</InlineButton>
                        </Popconfirm>
                    }
                    {record.status === "paid" &&
                        <InlineButton type="primary" style={{ minWidth: "114px" }} onClick={() => { renewPolicy(record) }}>Renew</InlineButton>
                    }
                </ActionWrapper>
            )
        },
    ]
    const fetchCounts = useCallback(async () => {
        if (agencyId) {
            try {
                const agencyCounts = await getAgencyBillsCounts(directusClient, agencyId)
                setCounts(agencyCounts)
            } catch (error) {

            }
        }

    }, [agencyId, directusClient])
    const fetchBills = useCallback(async () => {
        if (agencyId) {
            setIsLoading(true)
            try {
                let filterStatus = ""
                if (param.filter === 'paid') {
                    filterStatus = 'paid'
                } else if (param.filter === 'due') {
                    filterStatus = 'confirmed'
                }

                const billData = await getAgencyBills(directusClient, agencyId, filterStatus, searchparams.get('q')?.trim() ?? undefined)
                setBills(billData)
            } catch (error) {
                message.error((error as InternalErrors).message)
            }
            setIsLoading(false)
        }
    }, [agencyId, directusClient, param.filter, searchparams])
    useEffect(() => {
        fetchCounts()
    }, [fetchCounts])
    useEffect(() => {
        fetchBills()
    }, [fetchBills])

    const markPolicyPaid = async (bill: DirectusBill) => {
        setConfirmingRecord(bill)
        try {
            await updateBillStatus(directusClient, bill.id, 'paid')
            fetchCounts()
            fetchBills()
        } catch (error) {
            message.error((error as InternalErrors).message)
        } finally {
            setConfirmingRecord(null)
        }
    }
    return (
        <BoxContainer style={{
            alignItems: "flex-start",
            paddingTop: "40px"
        }}>
            <BoxWrapper style={{ maxWidth: "1264px" }}>
                <Row gutter={[0, 32]}>
                    <Col xs={24} md={12} lg={6}>
                        <FormItem label="Search Payment">
                            <SearchBox placeholder="Search by name or policy id" onSearch={value => { navigate(`?q=${value}`) }} defaultValue={searchparams.get('q') ?? undefined} />
                        </FormItem>
                    </Col>
                    <Col span={24}>
                        <FullWidthTab value={param.filter ?? 'all'} options={[
                            {
                                value: 'all',
                                label: <TabLabelWrapper>
                                    All{counts ? <CountBadge count={counts.total} /> : null}
                                </TabLabelWrapper>
                            },
                            {
                                value: 'due',
                                label: <TabLabelWrapper>
                                    Due{counts ? <CountBadge count={counts.due} type="danger" /> : null}
                                </TabLabelWrapper>
                            },
                            {
                                value: 'paid',
                                label: <TabLabelWrapper>
                                    Paid{counts ? <CountBadge count={counts.paid} type="primary" /> : null}
                                </TabLabelWrapper>
                            },
                        ]} onChange={event => navigate(`/agency/manage/${event.target.value}`)} />

                        <HelpText>Policy paid - Pay bill to each insurance company for each company today.</HelpText>
                    </Col>
                    <Col span={24}>
                        <Box>
                            <ManageTableWrapper>
                                <CustomizedTable
                                    columns={columns}
                                    dataSource={bills}
                                    pagination={false}
                                    scroll={{ x: 1100 }}
                                    loading={{
                                        spinning: isLoading,
                                        indicator: <LoadingOutlined />
                                    }}
                                />
                            </ManageTableWrapper>
                        </Box>
                    </Col>
                </Row>
                <PaymentHistory open={!!detailRecord} bill={detailRecord} onClose={() => setDetailRecord(null)} />
            </BoxWrapper>
        </BoxContainer>
    )
}

export default Manage
