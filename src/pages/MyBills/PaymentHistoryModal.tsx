import LoadingOutlined from '@ant-design/icons/LoadingOutlined';
import { Button, message } from 'antd';
import { ColumnsType } from 'antd/es/table';
import moment from 'moment';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomizedTable from '../../components/CustomisedTable';
import CustomModal from '../../components/CustomModal';
import { useDirectUs } from '../../components/DirectUs/DirectusContext';
import { getBillPayments } from '../../utils/apis/directus';
import { InternalErrors } from '../../utils/types/errors';
import { DirectusAgency, DirectusBill, DirectusPayment } from '../../utils/types/schema';
import { StatusWrapper } from '../style';
import { BillAmountWrapper, BillDueDateWrapper } from './style';
import normalizePaymentStatus from '../../utils/helpers/normalizePaymentStatus';
const PaymentHistoryModal: React.FC<{
    open?: boolean
    bill?: DirectusBill | null
    onClose?: () => void
}> = ({ bill, ...props }) => {

    const [dataSource, setDataSource] = useState<DirectusPayment[]>([])
    const [paymentsLoading, setPaymentsLoading] = useState(true)
    const { directusClient } = useDirectUs()
    const navigate = useNavigate()
    const fetchPayments = useCallback(async () => {
        try {
            setPaymentsLoading(true)
            if (bill?.id) {
                const paymentsRes = await getBillPayments(directusClient, bill.id)
                setDataSource(paymentsRes)
            } else {
                setDataSource([])
            }
        } catch (error) {
            message.error((error as InternalErrors).message)
        } finally {
            setPaymentsLoading(false)
        }
    }, [bill?.id, directusClient])

    useEffect(() => {
        fetchPayments()
    }, [fetchPayments])

    const columns: ColumnsType<DirectusPayment> = [
        {
            title: "Status",
            key: 'status',
            dataIndex: "status",
            render: (_: string, record) => {
                const status = normalizePaymentStatus(record)
                return <StatusWrapper status={status}>{status}</StatusWrapper>
            },
            align: "left"
        },
        {
            title: "Due date",
            key: 'dueDate',
            dataIndex: "due_date",
            render: (text: string) => <BillDueDateWrapper>{moment(text).format('MM/DD/YY')}</BillDueDateWrapper>,
            align: "center"
        },
        {
            title: 'Amount',
            key: "amount",
            dataIndex: "value",
            align: 'right',
            render: (amount: string) => <BillAmountWrapper>
                <div className='amount'>${Number(amount).toFixed(2)}</div>
            </BillAmountWrapper>
        },
        {
            title: '',
            key: 'action',
            dataIndex: 'id',
            align: 'right',
            render: (_: number, record) => {
                const status = normalizePaymentStatus(record)
                const canPayNow = record.id > 0
                    && (
                        status === 'missed'
                        || status === 'upcoming'
                        || status === null
                    )

                if (!canPayNow) {
                    return null
                }

                const handlePayNow = () => {
                    props.onClose?.()
                    navigate('/payment', {
                        state: {
                            duePayment: record
                        }
                    })
                }

                return <Button type='link' size='small' onClick={handlePayNow}>Pay now</Button>
            }
        }
    ]

    return (<CustomModal
        title={(bill?.agency as DirectusAgency)?.agency_name}
        open={props.open}
        onClose={props.onClose}
        onCancel={props.onClose}
        footer={false}
        width={1255}
        destroyOnClose
    >
        <CustomizedTable
            columns={columns}
            dataSource={dataSource}
            loading={{
                spinning: paymentsLoading,
                indicator: <LoadingOutlined />
            }}
            pagination={false}
        />
    </CustomModal>)
}

export default PaymentHistoryModal
