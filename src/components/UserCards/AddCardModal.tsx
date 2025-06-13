import { Col, Form, Row, message } from 'antd';
import { useState } from 'react';
import { addUserCard } from '../../utils/apis/directus';
import { InternalErrors } from '../../utils/types/errors';
import cardNumberValidator from '../../utils/validators/cardNumberValidator';
import expiryDateValidator from '../../utils/validators/expiryDateValidator';
import CustomModal from '../CustomModal';
import { useDirectUs } from '../DirectUs/DirectusContext';
import CardNumberInput from '../Form/CardNumberInput';
import CVVInput from '../Form/CVVInput';
import ExpiryDateInput from '../Form/ExpiryDateInput';
import FormItem from '../Form/FormItem';
import SubmitButton from '../Form/SubmitButton';
type FormValues = {
    cardNumber?: string
    expiry?: {
        month: string,
        year: string
    },
    cvv?: string
}
const AddCardModal: React.FC<{
    open?: boolean
    onClose?: () => void
    onCardAdd?: () => void
    agencyId: number | null
}> = props => {
    const { directusClient } = useDirectUs()
    const [saving, setSaving] = useState(false)
    const handleSubmit = async (values: FormValues) => {
        if (props.agencyId && values.cardNumber && values.cvv && values.expiry) {
            setSaving(true)
            try {
                await addUserCard(directusClient, {
                    agency: props.agencyId,
                    cardNumber: values.cardNumber,
                    expMonth: values.expiry.month,
                    expYear: values.expiry.year,
                    cvv: values.cvv
                })
                if (props.onCardAdd) {
                    props.onCardAdd()
                }
            } catch (error) {
                message.error((error as InternalErrors).message)
            } finally {
                setSaving(false)
            }
        }
    }
    return (<CustomModal
        title="Add Card"
        open={props.open}
        onClose={props.onClose}
        onCancel={props.onClose}
        footer={false}
        destroyOnClose
    >
        <Form requiredMark={false} layout="vertical" onFinish={handleSubmit}>
            <Row justify={'center'} gutter={[12, 24]}>
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
                    <SubmitButton style={{ marginTop: "16px" }} htmlType='submit' loading={saving}>Save</SubmitButton>
                </Col>
            </Row>
        </Form>
    </CustomModal>)
}
export default AddCardModal
