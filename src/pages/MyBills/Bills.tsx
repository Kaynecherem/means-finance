import LoadingOutlined from '@ant-design/icons/LoadingOutlined';
import { ColumnsType } from 'antd/es/table';
import moment from 'moment';
import { useState } from 'react';
import { LuDollarSign } from 'react-icons/lu';
import Box from "../../components/Box";
import CustomizedTable from '../../components/CustomisedTable';
import CustomButton1 from '../../components/Form/CustomButton1';
import FormIcon from '../../components/Form/FormIcon';
import billTypeMapper from '../../utils/helpers/billTypeMapper';
import { DirectusAgency, DirectusBill } from '../../utils/types/schema';
import PaymentHistoryModal from './PaymentHistoryModal';
import { BillAgencyDetails, BillAmountWrapper, BillDueDateWrapper, BillsCardWrapper, BillTypeWrapper } from './style';

const Bills: React.FC<{
    bills?: Array<DirectusBill>
    loading?: boolean
}> = ({ bills = [], loading }) => {
    const [detailRecord, setDetailRecord] = useState<DirectusBill | null>(null)
    const columns: ColumnsType<DirectusBill> = [
        {
            title: "Payee",
            key: 'Payee',
            dataIndex: ["agency", "agency_name"],
            render: (_, record) => {
                const agency = record.agency as DirectusAgency
                return (
                    <BillAgencyDetails>
                        <FormIcon icon={<LuDollarSign />} />
                        <div className='details'>
                            <div className='name'>{agency.agency_name}</div>
                            <div className='address'>{agency.address_one}, <br />{agency.city}, {agency.state}, {agency.postal_code}</div>
                        </div>
                    </BillAgencyDetails>
                )
            }
        },
        {
            title: "Bill Type",
            key: 'BillType',
            dataIndex: "bill_type",
            render: type => <BillTypeWrapper>{billTypeMapper(type)}</BillTypeWrapper>
        },
        {
            title: "Due Date",
            key: 'DueDate',
            dataIndex: "next_installment_date",
            render: date => <BillDueDateWrapper>{moment(date).format('MM/DD/YYYY')}<br /> 08:00 AM</BillDueDateWrapper>
        },
        {
            title: "Amount",
            key: 'Amount',
            dataIndex: "installments",
            render: amount => <BillAmountWrapper>
                <div className='amount'>
                    ${Number(amount ?? 0).toFixed(2)}
                </div>
                {/* <div className='due-count'>3 of 4</div> */}
            </BillAmountWrapper>,
            width: 100
        },
        {
            title: "Actions",
            key: 'Actions',
            dataIndex: "id",
            width: 100,
            align: "right",
            render: (_, record) => (
                <CustomButton1 onClick={() => setDetailRecord(record)}>Payment History</CustomButton1>
            )
        }
    ]
    return <Box>
        <BillsCardWrapper>
            <CustomizedTable
                columns={columns}
                dataSource={bills}
                pagination={false}
                loading={{
                    spinning: loading,
                    indicator: <LoadingOutlined />
                }}
            />
        </BillsCardWrapper>
        <PaymentHistoryModal open={!!detailRecord} bill={detailRecord} onClose={() => setDetailRecord(null)} />
    </Box>
}

export default Bills
