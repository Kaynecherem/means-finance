import { Col, Row } from 'antd';
import { LuDollarSign } from 'react-icons/lu';
import FormItem from '../../../components/Form/FormItem';
import NumberField from '../../../components/Form/NumberField';
import { DirectusPayment } from '../../../utils/types/schema';
const CashPayment: React.FC<{ duePayment: DirectusPayment }> = ({ duePayment }) => {
    return <Row justify={'center'} gutter={[0, 20]}>
        <Col span={24}>
            <FormItem
                label="Cash Amount Collected"
                name="amount"
                icon={<LuDollarSign />}
                rules={[
                    { required: true },
                    {
                        type: 'number',
                        min: Number(duePayment.value ?? 0)
                    }
                ]}
            >
                <NumberField prefix='$' />
            </FormItem>
        </Col>
    </Row>
}
export default CashPayment
