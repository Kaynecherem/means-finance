import { Col, Form, Row, Typography, message } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { LuArrowRight, LuLock } from 'react-icons/lu';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Box from '../../components/Box';
import BoxContainer from '../../components/BoxContainer';
import BoxWrapper from '../../components/BoxWrapper';
import { useDirectUs } from '../../components/DirectUs/DirectusContext';
import FormItem from '../../components/Form/FormItem';
import PasswordField from '../../components/Form/PasswordField';
import SubmitButton from '../../components/Form/SubmitButton';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { resetPassword, validateResetPasswordToken } from '../../utils/apis/directus';
import { passwordRegEx } from '../../utils/contants/regex';
import { logoutAction } from '../../utils/redux/slices/authSlice';
import { resetCollect } from '../../utils/redux/slices/collectSlice';
import { resetQuote } from '../../utils/redux/slices/quoteSlice';
import { RootState } from '../../utils/redux/store';
import { LoginPageWrapper } from './style';
const ResetPassword = () => {
    const [validating, setValidating] = useState(true)
    const [isInProgress, setIsInProgress] = useState(false)
    const navigate = useNavigate()
    const [searchParams] = useSearchParams();
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
    const validateToken = useCallback(async (token: string) => {
        try {
            await validateResetPasswordToken(directusClient, { token })
            setValidating(false)
        } catch (error) {
            navigate('/reset-password/error')
        }
    }, [directusClient, navigate])
    useEffect(() => {
        const token = searchParams.get('token')
        if (token) {
            validateToken(token)
        } else {
            navigate('/reset-password/error')
        }

    }, [navigate, searchParams, validateToken])

    const handleResetPasswordSubmit = async (values: { password: string }) => {
        setIsInProgress(true)
        try {
            const token = searchParams.get('token')
            if (token) {
                await resetPassword(directusClient, {
                    token,
                    password: values.password
                })
            }
            message.success("Password reset successfully.")
            navigate('/login')

        } catch (error) {
            navigate('/reset-password/error')
        } finally {
            setIsInProgress(false)
        }
    }
    return (
        <BoxContainer>
            <BoxWrapper>
                <Box>
                    <LoginPageWrapper>
                        {validating &&
                            <LoadingSpinner />
                        }
                        {!validating &&
                            <Form requiredMark={false} layout="vertical" onFinish={handleResetPasswordSubmit}>
                                <Row justify={"center"} gutter={[0, 32]}>
                                    <Col span={24} style={{ textAlign: "center" }}>
                                        <Typography.Title level={2}>Reset Password</Typography.Title>
                                    </Col>
                                    <Col xs={24} lg={10} >
                                        <Row justify={'center'} gutter={[0, 24]}>
                                            <Col span={24}>
                                                <FormItem
                                                    label="Password"
                                                    name="password"
                                                    rules={[
                                                        { required: true },
                                                        {
                                                            pattern: new RegExp(passwordRegEx),
                                                            message: "Password must be at least 8 characters long, and include at least one uppercase letter, one lowercase letter, one digit, and one special character (e.g., #?!@$%^&*-)."
                                                        }
                                                    ]}
                                                    icon={<LuLock />}
                                                >
                                                    <PasswordField />
                                                </FormItem>
                                            </Col>
                                            <Col span={24}>
                                                <FormItem
                                                    label="Confirm Password"
                                                    name="confirm_password"
                                                    rules={[
                                                        { required: true },
                                                        ({ getFieldValue }) => ({
                                                            validator(_, value) {
                                                                if (!value || getFieldValue('password') === value) {
                                                                    return Promise.resolve();
                                                                }
                                                                return Promise.reject(new Error('The new password that you entered do not match!'));
                                                            },
                                                        })
                                                    ]}
                                                    icon={<LuLock />}
                                                >
                                                    <PasswordField />
                                                </FormItem>
                                            </Col>
                                            <Col>
                                                <SubmitButton htmlType="submit" icon={<LuArrowRight />} style={{ marginTop: "16px" }} loading={isInProgress}>Save</SubmitButton>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </Form>
                        }
                    </LoginPageWrapper>
                </Box>
            </BoxWrapper>
        </BoxContainer>
    );
}

export default ResetPassword;
