import { Col, Form, Row, message } from 'antd';
import { useState } from 'react';
import { addUserAccount } from '../../utils/apis/directus';
import { InternalErrors } from '../../utils/types/errors';
import CustomModal from '../CustomModal';
import { useDirectUs } from '../DirectUs/DirectusContext';
import FormItem from '../Form/FormItem';
import SubmitButton from '../Form/SubmitButton';
import TextField from '../Form/TextField';
type FormValues = {
    routing: string,
    account: string
}
const AddAccountModal: React.FC<{
    open?: boolean
    onClose?: () => void
    onAccountAdd?: () => void
    agencyId: number | null
}> = props => {
    const { directusClient } = useDirectUs()
    const [saving, setSaving] = useState(false)
    const handleSubmit = async (values: FormValues) => {
        if (props.agencyId && values.routing && values.account) {
            setSaving(true)
            try {
                await addUserAccount(directusClient, {
                    agency: props.agencyId,
                    routingNumber: values.routing,
                    accountNumber: values.account,
                })
                if (props.onAccountAdd) {
                    props.onAccountAdd()
                }
            } catch (error) {
                message.error((error as InternalErrors).message)
            } finally {
                setSaving(false)
            }
        }
    }
    return (<CustomModal
        title="Add Account"
        open={props.open}
        onClose={props.onClose}
        onCancel={props.onClose}
        footer={false}
        destroyOnClose
    >
        <Form requiredMark={false} layout="vertical" onFinish={values => handleSubmit(values)}>
            <Row justify={'center'} gutter={[12, 24]}>
                <Col span={24}>
                    <FormItem
                        label="Routing #"
                        name="routing"
                        rules={[
                            {
                                required: true
                            }
                        ]}
                    >
                        <TextField />
                    </FormItem>
                </Col>
                <Col span={24}>
                    <FormItem
                        label="Account #"
                        name="account"
                        rules={[
                            {
                                required: true
                            }
                        ]}
                    >
                        <TextField />
                    </FormItem>
                </Col>
                <Col>
                    <SubmitButton style={{ marginTop: "16px" }} htmlType='submit' loading={saving}>Save</SubmitButton>
                </Col>
            </Row>
        </Form>
    </CustomModal>)
}
export default AddAccountModal
