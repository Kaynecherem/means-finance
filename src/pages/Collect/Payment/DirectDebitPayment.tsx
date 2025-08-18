import { Col, Row, Switch } from 'antd';
import FeesInfoCard from '../../../components/FeesInfoCard';
import SubmitButton from '../../../components/Form/SubmitButton';
import UserAccounts from '../../../components/UserAccounts';
import { BankAccount, PaymentRecordingWith } from '../../../utils/types/common';
import { ChangeAccountInfoText } from './style';
const DirectDebitPayment = (props: {
    autoPayment: boolean,
    onAutoPaymentChange: (checked: boolean) => void,
    loading?: boolean,
    bankAccounts?: BankAccount[],
    onAccountSelect?: (accountId: string) => void,
    paymentRecordingWith: PaymentRecordingWith
    amount?: number,
    onAddAccount?: () => void
}) => {
    return <Row justify={'center'} gutter={[0, 24]}>
        <Col span={24}>
            <UserAccounts loading={props.loading} bankAccounts={props.bankAccounts} agencyId={null} selectMode onSelect={props.onAccountSelect} paymentRecordingWith={props.paymentRecordingWith} />
        </Col>
        <Col span={24} style={{ textAlign: 'center' }}>
            <SubmitButton htmlType="button" onClick={props.onAddAccount}>Add New Account Information</SubmitButton>
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
