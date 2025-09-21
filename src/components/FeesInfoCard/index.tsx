import LoadingOutlined from '@ant-design/icons/LoadingOutlined';
import { Col, Collapse, Row, message } from 'antd';
import { useMemo, useState } from 'react';
import { LuAsterisk } from 'react-icons/lu';
import { getCommissions } from '../../utils/apis/directus/index';
import { InternalErrors } from '../../utils/types/errors';
import CustomizedTable from '../CustomisedTable';
import { useDirectUs } from '../DirectUs/DirectusContext';
import { StyledCollapse } from './style';
const FeesInfoCard: React.FC<{
    amount?: number,
    fields?: Array<{
        label: string, amount: number, key: string
    }>
}> = ({ amount, fields }) => {
    const { directusClient } = useDirectUs()

    const [loading, setLoading] = useState(false)

    const [fees, setFees] = useState<Array<Record<string, string>>>([])
    const getExtraFields = (value: number, isPercentage: boolean) => {
        const extraFields: Record<string, string> = {}
        if (fields) {
            for (const element of fields) {
                const updatedAmount = isPercentage
                    ? element.amount + (element.amount * (value / 100))
                    : element.amount + value
                extraFields[element.key] = `$${Number(updatedAmount).toFixed(2)}`;
            }
        }
        return extraFields
    }

    const loadFees = async () => {
        if (fees.length === 0) {
            setLoading(true)
        }
        try {
            const dataSource: Array<Record<string, string>> = []
            const res = await getCommissions(directusClient)
            const card = res.find(data => data.key === 'card_payment')
            if (card) {
                dataSource.push({
                    type: 'Debit/Credit Card',
                    fees: `${Number(card.value).toFixed(2)}%`,
                    amount: amount ? `$${Number(amount + (amount * (Number(card.value) / 100))).toFixed(2)}` : '',
                    ...getExtraFields(Number(card.value), true)
                })
            }

            const directDebit = res.find(data => data.key === 'direct_debit_payment')
            if (directDebit) {
                dataSource.push({
                    type: 'ACH/Direct Bank Debit',
                    fees: `$${Number(directDebit.value).toFixed(2)}`,
                    amount: amount ? `$${Number(amount + Number(directDebit.value)).toFixed(2)}` : '',
                    ...getExtraFields(Number(directDebit.value), false)
                })
            }

            setFees(dataSource)
        } catch (error) {
            message.error((error as InternalErrors).message)
        } finally {
            setLoading(false)
        }
    }
    const columns = useMemo(() => [
        {
            title: "Type",
            dataIndex: 'type',
            key: 'type'
        },
        {
            title: "Fees",
            dataIndex: 'fees',
            key: 'fees'
        },
        ...(amount ? [{
            title: "Amount",
            dataIndex: 'amount',
            key: 'amount',
        }] : []),
        ...(fields ? fields.map(field => ({
            title: field.label,
            dataIndex: field.key,
            key: field.key,
            align: 'center'
        })) : [])

    ], [amount, fields])
    return <StyledCollapse expandIconPosition="end" onChange={activeKey => activeKey.includes('fees') ? loadFees() : null}>
        <Collapse.Panel header={
            <div>
                <LuAsterisk />Fees applicable on payments
            </div>
        } key="fees">
            <Row>
                <Col span={24}>
                    <CustomizedTable
                        pagination={false}
                        columns={columns as never}
                        dataSource={fees}
                        loading={{
                            spinning: loading,
                            indicator: <LoadingOutlined />
                        }}
                    />
                </Col>
            </Row>
        </Collapse.Panel>
    </StyledCollapse>
}

export default FeesInfoCard
