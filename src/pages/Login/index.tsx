import { Col, Form, message, Row, Typography } from "antd";
import { useEffect, useState } from "react";
import { LuArrowRight, LuLock, LuUser } from "react-icons/lu";
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from "react-router-dom";
import Box from "../../components/Box";
import BoxContainer from "../../components/BoxContainer";
import BoxWrapper from "../../components/BoxWrapper";
import { useDirectUs } from "../../components/DirectUs/DirectusContext";
import FormItem from "../../components/Form/FormItem";
import PasswordField from "../../components/Form/PasswordField";
import SubmitButton from "../../components/Form/SubmitButton";
import TextField from "../../components/Form/TextField";
import { userLogin } from '../../utils/apis/directus/index';
import { Roles } from "../../utils/enums/common";
import { agencyLoginAction, customerLoginAction, logoutAction } from "../../utils/redux/slices/authSlice";
import { resetCollect } from '../../utils/redux/slices/collectSlice';
import { resetQuote } from '../../utils/redux/slices/quoteSlice';
import { RootState } from '../../utils/redux/store';
import { InternalErrors } from "../../utils/types/errors";
import { ForgotPasswordLinkWrapper, LoginPageWrapper } from "./style";

type FormValuesType = {
    username: string,
    password: string
}
const Login: React.FC = () => {
    const { directusClient } = useDirectUs();
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [isInProgress, setIsInProgress] = useState(false)
    const isLoggedIn = useSelector(({ auth }: RootState) => auth.isLoggedIn)
    useEffect(() => {
        if (isLoggedIn) {
            dispatch(resetQuote())
            dispatch(resetCollect())
            dispatch(logoutAction())
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    const handleLoginSubmit = async (value: FormValuesType) => {
        setIsInProgress(true)
        try {
            const { agency, user, role } = await userLogin(directusClient, {
                email: value.username,
                password: value.password
            })
            if (role.name === Roles.AGENCY && agency) {
                dispatch(agencyLoginAction({
                    user, agency
                }))
                navigate('/agency/manage')
            } else if (role.name === Roles.CLIENT) {
                dispatch(customerLoginAction({ user }))
                navigate('/my-bills')
            } else {
                message.error("Something went wrong.")
            }
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
                        <Form requiredMark={false} layout="vertical" onFinish={handleLoginSubmit}>
                            <Row justify={"center"} gutter={[0, 32]}>
                                <Col span={24} style={{ textAlign: "center" }}>
                                    <Typography.Title level={2}>Login</Typography.Title>
                                </Col>
                                <Col xs={24} lg={10} >
                                    <Row justify={'center'} gutter={[0, 24]}>
                                        <Col span={24}>
                                            <FormItem
                                                label="Username"
                                                name="username"
                                                rules={[{ required: true }]}
                                                icon={<LuUser />}
                                            >
                                                <TextField />
                                            </FormItem>
                                        </Col>
                                        <Col span={24} >
                                            <FormItem
                                                label="Password"
                                                name="password"
                                                rules={[{ required: true }]}
                                                icon={<LuLock />}
                                            >
                                                <PasswordField />
                                            </FormItem>
                                            <ForgotPasswordLinkWrapper>
                                                <Link to={'/forgot-password'}>Forgot Password?</Link>
                                            </ForgotPasswordLinkWrapper>
                                        </Col>
                                        <Col>
                                            <SubmitButton htmlType="submit" icon={<LuArrowRight />} style={{ marginTop: "16px" }} loading={isInProgress}>Sign In</SubmitButton>
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
export default Login
