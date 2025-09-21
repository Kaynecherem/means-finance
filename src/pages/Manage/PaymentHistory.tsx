import LoadingOutlined from '@ant-design/icons/LoadingOutlined';
import { Button, message } from 'antd';
import { ColumnsType } from 'antd/es/table';
import moment from 'moment';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CustomizedTable from "../../components/CustomisedTable";
import CustomModal from '../../components/CustomModal';
import { useDirectUs } from '../../components/DirectUs/DirectusContext';
import { getBillPayments } from '../../utils/apis/directus';
import { updateCollect } from '../../utils/redux/slices/collectSlice';
import { castCustomer } from '../../utils/typeFilters/castCustomer';
import { InternalErrors } from '../../utils/types/errors';
import { DirectusBill, DirectusPayment } from "../../utils/types/schema";
import { BillAmountWrapper } from '../MyBills/style';
import { StatusWrapper } from '../style';

const PaymentHistory: React.FC<{
    open?: boolean
    bill?: DirectusBill | null
    onClose?: () => void
}> = ({ bill, ...props }) => {
    const [dataSource, setDataSource] = useState<DirectusPayment[]>([])
    const [paymentsLoading, setPaymentsLoading] = useState(true)
    const { directusClient } = useDirectUs()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const fetchPayments = useCallback(async () => {
        try {
            setPaymentsLoading(true)
            if (bill?.id) {
                let paymentsRes = await getBillPayments(directusClient, bill.id)
                if (bill?.status === 'confirmed') {
                    paymentsRes = [
                        {
                            status: "upcoming",
                            id: 0,
                            bill: null,
                            down_payment: false,
                            due_date: bill.next_installment_date,
                            paid_date: null,
                            method: null,
                            customer: null,
                            value: `${Number(bill.installments) - Number(bill.credit_amount ?? 0)}`,
                            cash_payment: null,
                            agency: null
                        },
                        ...paymentsRes,
                    ]
                }
                setDataSource(paymentsRes)
            } else {
                setDataSource([])
            }
        } catch (error) {
            message.error((error as InternalErrors).message)
        } finally {
            setPaymentsLoading(false)
        }
    }, [bill, directusClient])

    useEffect(() => {
        fetchPayments()
    }, [fetchPayments])

    const handlePayNow = (payment: DirectusPayment) => {
        if (!bill) {
            return
        }

        dispatch(updateCollect({
            bill,
            customer: castCustomer(bill.customer),
            selectedPaymentId: payment.id
        }))

        navigate('/agency/collect/customer-summary', {
            state: { paymentId: payment.id }
        })
    }

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
            render: (amount: string, record) => <BillAmountWrapper>
                <div className='amount'>{`$${Number(amount).toFixed(2)}`}</div>
                {record.method === 'cash' &&
                    <div className='due-count'>{`Cash Collected - $${Number(record.cash_payment).toFixed(2)}`}</div>
                }
                {record.status === 'upcoming' && Number(bill?.credit_amount ?? 0) > 0 &&
                    <>
                        <div className='due-count'>{`Installment - $${Number(bill?.installments).toFixed(2)}`}</div>
                        <div className='due-count'>{`Credit - $${Number(bill?.credit_amount).toFixed(2)}`}</div>
                    </>
                }
            </BillAmountWrapper>
        },
        {
            title: '',
            key: 'action',
            dataIndex: 'id',
            align: 'right',
            render: (_, record) => record.status === 'missed'
                ? <Button type='link' size='small' onClick={() => handlePayNow(record)}>Pay now</Button>
                : null
        }
    ]
    return (<CustomModal
        title="Payment History"
        open={props.open}
        onClose={props.onClose}
        onCancel={props.onClose}
        footer={false}
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

export default PaymentHistory
