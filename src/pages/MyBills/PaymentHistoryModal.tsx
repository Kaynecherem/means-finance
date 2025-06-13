import LoadingOutlined from '@ant-design/icons/LoadingOutlined';
import { message } from 'antd';
import { ColumnsType } from 'antd/es/table';
import moment from 'moment';
import { useCallback, useEffect, useState } from 'react';
import CustomizedTable from '../../components/CustomisedTable';
import CustomModal from '../../components/CustomModal';
import { useDirectUs } from '../../components/DirectUs/DirectusContext';
import { getBillPayments } from '../../utils/apis/directus';
import { InternalErrors } from '../../utils/types/errors';
import { DirectusAgency, DirectusBill, DirectusPayment } from '../../utils/types/schema';
import { StatusWrapper } from '../style';
import { BillAmountWrapper, BillDueDateWrapper } from './style';
const PaymentHistoryModal: React.FC<{
    open?: boolean
    bill?: DirectusBill | null
    onClose?: () => void
}> = ({ bill, ...props }) => {

    const [dataSource, setDataSource] = useState<DirectusPayment[]>([])
    const [paymentsLoading, setPaymentsLoading] = useState(true)
    const { directusClient } = useDirectUs()
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
            render: (text: string) => <StatusWrapper status={text}>{text}</StatusWrapper>,
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
