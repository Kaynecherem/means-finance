import { Col, Row, Switch } from 'antd';
import FeesInfoCard from '../../../components/FeesInfoCard';
import SubmitButton from '../../../components/Form/SubmitButton';
import UserCards from '../../../components/UserCards';
import { Card, PaymentRecordingWith } from '../../../utils/types/common';
import { ChangeAccountInfoText } from './style';
const CardPayment = (props: {
    autoPayment: boolean,
    onAutoPaymentChange: (checked: boolean) => void,
    loading?: boolean
    cards?: Card[],
    onCardSelect?: (cardId: string) => void
    paymentRecordingWith: PaymentRecordingWith
    selectedCardId?: string
    amount?: number,
    onAddCard?: () => void
}) => {
    return <Row justify={'center'} gutter={[12, 24]}>
        <Col span={24}>
            <UserCards
                loading={props.loading}
                cards={props.cards}
                agencyId={null}
                selectMode
                onSelect={props.onCardSelect}
                paymentRecordingWith={props.paymentRecordingWith}
                selectedCardId={props.selectedCardId}
            />
        </Col>
        <Col span={24} style={{ textAlign: 'center' }}>
            <SubmitButton htmlType="button" onClick={props.onAddCard}>Add New Card</SubmitButton>
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
