import LoadingOutlined from '@ant-design/icons/LoadingOutlined';
import { Col, message, Row } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useCallback, useEffect, useState } from 'react';
import { LuDollarSign } from 'react-icons/lu';
import Box from "../../components/Box";
import CustomizedTable from '../../components/CustomisedTable';
import { useDirectUs } from '../../components/DirectUs/DirectusContext';
import CustomButton1 from '../../components/Form/CustomButton1';
import FormIcon from '../../components/Form/FormIcon';
import { getCustomerPaidBills } from '../../utils/apis/directus/index';
import billTypeMapper from '../../utils/helpers/billTypeMapper';
import { InternalErrors } from '../../utils/types/errors';
import { DirectusAgency, DirectusBill } from '../../utils/types/schema';
import { PageSubHeader } from '../style';
import PaymentHistoryModal from './PaymentHistoryModal';
import { BillAgencyDetails, BillAmountWrapper, BillsCardWrapper, BillTypeWrapper } from './style';

const CompletedBills: React.FC<{

}> = () => {
    const [detailRecord, setDetailRecord] = useState<DirectusBill | null>(null)
    const [bills, setBills] = useState<Array<DirectusBill>>([])
    const { directusClient } = useDirectUs();
    const [loading, setLoading] = useState(false)
    const fetchUserBill = useCallback(async () => {
        setLoading(true)
        try {
            const billData = await getCustomerPaidBills(directusClient)
            setBills(billData)
        } catch (error) {
            message.error((error as InternalErrors).message)
        } finally {
            setLoading(false)
        }
    }, [directusClient])

    useEffect(() => {
        fetchUserBill()
    }, [fetchUserBill])
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
            title: "Amount",
            key: 'Amount',
            dataIndex: "bill_amount",
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
            <Row gutter={[16, 16]}>
                <Col span={24} >
                    <PageSubHeader style={{ textAlign: "left" }}>Paid Policies</PageSubHeader>
                </Col>
                <Col span={24}>
                    <CustomizedTable
                        columns={columns}
                        dataSource={bills}
                        pagination={false}
                        loading={{
                            spinning: loading,
                            indicator: <LoadingOutlined />
                        }}
                    />
                </Col>
            </Row>
        </BillsCardWrapper>
        <PaymentHistoryModal open={!!detailRecord} bill={detailRecord} onClose={() => setDetailRecord(null)} />
    </Box>
}

export default CompletedBills
