import { Col, Form, Row, Typography, message } from 'antd';
import { useEffect, useState } from 'react';
import { LuArrowRight, LuMail } from 'react-icons/lu';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Box from '../../components/Box';
import BoxContainer from '../../components/BoxContainer';
import BoxWrapper from '../../components/BoxWrapper';
import { useDirectUs } from '../../components/DirectUs/DirectusContext';
import FormItem from '../../components/Form/FormItem';
import SubmitButton from '../../components/Form/SubmitButton';
import TextField from '../../components/Form/TextField';
import { forgotPassword } from '../../utils/apis/directus';
import { logoutAction } from '../../utils/redux/slices/authSlice';
import { resetCollect } from '../../utils/redux/slices/collectSlice';
import { resetQuote } from '../../utils/redux/slices/quoteSlice';
import { RootState } from '../../utils/redux/store';
import { InternalErrors } from '../../utils/types/errors';
import { LoginPageWrapper } from './style';
const ForgotPasswordPage = () => {
    const [isInProgress, setIsInProgress] = useState(false)
    const navigate = useNavigate()
    const { directusClient } = useDirectUs()
    const isLoggedIn = useSelector(({ auth }: RootState) => auth.isLoggedIn)
    const dispatch = useDispatch()
    useEffect(() => {
        if (isLoggedIn) {
            dispatch(resetQuote())
            dispatch(resetCollect())
            dispatch(logoutAction())
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleResetPasswordSubmit = async (values: { email: string }) => {
        setIsInProgress(true)
        try {
            await forgotPassword(directusClient, {
                email: values.email
            })
            navigate("/forgot-password-success", { replace: true })
        } catch (error) {
            message.error((error as InternalErrors).message)
        } finally {
            setIsInProgress(false)
        }
    }
    return (
        <BoxContainer>
            <BoxWrapper>
                <Box>
                    <LoginPageWrapper>

                        <Form requiredMark={false} layout="vertical" onFinish={handleResetPasswordSubmit}>
                            <Row justify={"center"} gutter={[0, 32]}>
                                <Col span={24} style={{ textAlign: "center" }}>
                                    <Typography.Title level={2}>Enter Your Email To Reset Password</Typography.Title>
                                </Col>
                                <Col xs={24} lg={10} >
                                    <Row justify={'center'} gutter={[0, 24]}>
                                        <Col span={24}>
                                            <FormItem
                                                label="Email"
                                                name="email"
                                                rules={[
                                                    { required: true },
                                                    { type: 'email' },
                                                ]}
                                                icon={<LuMail />}
                                            >
                                                <TextField />
                                            </FormItem>
                                        </Col>
                                        <Col>
                                            <SubmitButton htmlType="submit" icon={<LuArrowRight />} style={{ marginTop: "16px" }} loading={isInProgress}>Reset Password</SubmitButton>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Form>

                    </LoginPageWrapper>
                </Box>
            </BoxWrapper>
        </BoxContainer>
    );
}

export default ForgotPasswordPage;
