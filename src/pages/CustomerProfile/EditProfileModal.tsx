import { Col, Form, Row, message } from 'antd';
import { useState } from 'react';
import { LuMail, LuPhone, LuUser } from 'react-icons/lu';
import { useDispatch, useSelector } from "react-redux";
import CustomModal from "../../components/CustomModal";
import { useDirectUs } from '../../components/DirectUs/DirectusContext';
import FormItem from "../../components/Form/FormItem";
import PhoneField from '../../components/Form/PhoneField';
import SubmitButton from '../../components/Form/SubmitButton';
import TextField from "../../components/Form/TextField";
import { updateProfile } from '../../utils/apis/directus';
import { updateUser } from '../../utils/redux/slices/authSlice';
import { RootState } from '../../utils/redux/store';
import { InternalErrors } from '../../utils/types/errors';
import phoneValidator from '../../utils/validators/phoneValidator';
type EditProfileFormValueType = {
    firstName: string,
    lastName: string,
    phone: string
}
const EditProfileModal: React.FC<{
    open?: boolean
    onClose: () => void
}> = props => {
    const [form] = Form.useForm()
    const [isSaving, setIsSaving] = useState<boolean>(false)
    const user = useSelector(({ auth }: RootState) => auth.user)
    const { directusClient } = useDirectUs()
    const dispatch = useDispatch()
    const handleSave = async (values: EditProfileFormValueType) => {
        if (user) {
            setIsSaving(true)
            try {
                await updateProfile(directusClient, {
                    first_name: values.firstName,
                    last_name: values.lastName,
                    phone: values.phone
                })
                dispatch(updateUser({
                    ...user,
                    firstName: values.firstName,
                    lastName: values.lastName,
                    phone: values.phone
                }))
                props.onClose()
            } catch (error) {
                message.error((error as InternalErrors).message)
            } finally {
                setIsSaving(false)
            }
        }
    }
    return (
        <CustomModal
            title="Edit Profile"
            open={props.open}
            width={700}
            footer={false}
            centered
            onClose={props.onClose}
            onCancel={props.onClose}
            destroyOnClose
        >
            <Row justify={'center'}>
                <Col xs={24} lg={16}>
                    <Form
                        requiredMark={false}
                        layout="vertical"
                        form={form}
                        initialValues={user}
                        onFinish={handleSave}>
                        <Row gutter={[16, 20]}>
                            <Col span={24}>
                                <FormItem label="Email" icon={<LuMail />} name='email'>
                                    <TextField disabled />
                                </FormItem>
                            </Col>
                            <Col span={13}>
                                <FormItem
                                    label="First Name"
                                    name={'firstName'}
                                    rules={[{ required: true, }]}
                                    icon={<LuUser />}>
                                    <TextField placeholder="Enter first name" />
                                </FormItem>
                            </Col>
                            <Col span={11}>
                                <FormItem
                                    label="Last Name"
                                    name={'lastName'}
                                    rules={[{ required: true, }]}>
                                    <TextField placeholder="Enter last name" />
                                </FormItem>
                            </Col>
                            <Col span={24}>
                                <FormItem
                                    label="Phone Cell"
                                    name="phone"
                                    rules={[
                                        { required: true },
                                        {
                                            validator: phoneValidator
                                        }
                                    ]}
                                    icon={<LuPhone />}
                                >
                                    <PhoneField />
                                </FormItem>
                            </Col>
                            <Col span={24} style={{ marginTop: "44px", textAlign: 'center', marginBottom: "10px" }}>
                                <SubmitButton htmlType="submit" loading={isSaving}>Save</SubmitButton>
                            </Col>
                        </Row>
                    </Form>
                </Col>
            </Row>
        </CustomModal>
    )
}
export default EditProfileModal
