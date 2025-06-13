import { Col, Row, Switch } from 'antd';
import FeesInfoCard from '../../../components/FeesInfoCard';
import FormItem from '../../../components/Form/FormItem';
import TextField from '../../../components/Form/TextField';
import UserAccounts from '../../../components/UserAccounts';
import { BankAccount, PaymentRecordingWith } from '../../../utils/types/common';
import { PageSubHeader } from '../../style';
import { ChangeAccountInfoText } from './style';
const DirectDebitPayment = (props: {
    autoPayment: boolean,
    onAutoPaymentChange: (checked: boolean) => void,
    loading?: boolean,
    bankAccounts?: BankAccount[],
    onAccountSelect?: (accountId: string) => void,
    paymentRecordingWith: PaymentRecordingWith
    amount?: number
}) => {
    return <Row justify={'center'} gutter={[0, 24]}>
        <Col span={24}>
            <UserAccounts loading={props.loading} bankAccounts={props.bankAccounts} agencyId={null} selectMode onSelect={props.onAccountSelect} paymentRecordingWith={props.paymentRecordingWith} />
        </Col>
        <Col>
            <PageSubHeader>OR</PageSubHeader>
        </Col>
        <Col span={24}>
            <FormItem
                label="Routing #"
                name="routing"
                rules={[{
                    required: true
                }]}
            >
                <TextField />
            </FormItem>
        </Col>
        <Col span={24}>
            <FormItem
                label="Account #"
                name="account"
                rules={[{
                    required: true
                }]}
            >
                <TextField />
            </FormItem>
        </Col>
        <Col>
            <ChangeAccountInfoText>
                <Switch size='small' value={props.autoPayment} onChange={props.onAutoPaymentChange} />Charge account automatically on day of bill
            </ChangeAccountInfoText>
        </Col>
        <Col span={24}>
            <FeesInfoCard amount={props.amount} />
        </Col>
    </Row>
}
export default DirectDebitPayment
