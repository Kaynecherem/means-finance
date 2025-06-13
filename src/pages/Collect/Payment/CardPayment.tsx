import { Col, Row, Switch } from 'antd';
import FeesInfoCard from '../../../components/FeesInfoCard';
import CardNumberInput from '../../../components/Form/CardNumberInput';
import CVVInput from '../../../components/Form/CVVInput';
import ExpiryDateInput from '../../../components/Form/ExpiryDateInput';
import FormItem from '../../../components/Form/FormItem';
import UserCards from '../../../components/UserCards';
import { Card, PaymentRecordingWith } from '../../../utils/types/common';
import cardNumberValidator from '../../../utils/validators/cardNumberValidator';
import expiryDateValidator from '../../../utils/validators/expiryDateValidator';
import { PageSubHeader } from '../../style';
import { ChangeAccountInfoText } from './style';
const CardPayment = (props: {
    autoPayment: boolean,
    onAutoPaymentChange: (checked: boolean) => void,
    loading?: boolean
    cards?: Card[],
    onCardSelect?: (cardId: string) => void
    paymentRecordingWith: PaymentRecordingWith
    amount?: number
}) => {
    return <Row justify={'center'} gutter={[12, 24]}>
        <Col span={24}>
            <UserCards loading={props.loading} cards={props.cards} agencyId={null} selectMode onSelect={props.onCardSelect} paymentRecordingWith={props.paymentRecordingWith} />
        </Col>
        <Col>
            <PageSubHeader>OR</PageSubHeader>
        </Col>
        <Col span={24}>
            <FormItem
                label="Card Number"
                name="cardNumber"
                rules={[
                    {
                        required: true
                    },
                    {
                        validator: cardNumberValidator
                    }
                ]}
            >
                <CardNumberInput />
            </FormItem>
        </Col>
        <Col span={12}>
            <FormItem
                label="Exp"
                name="expiry"
                rules={[
                    {
                        validator: expiryDateValidator
                    }
                ]}
            >
                <ExpiryDateInput />
            </FormItem>
        </Col>
        <Col span={12}>
            <FormItem
                label="CVV"
                name="cvv"
                rules={[{ required: true }]}

            >
                <CVVInput />
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
export default CardPayment
