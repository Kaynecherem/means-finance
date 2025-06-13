import { Col, Form, Row } from 'antd';
import { LuCheck, LuX } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';
import Box from '../../components/Box';
import BoxContainer from '../../components/BoxContainer';
import BoxWrapper from '../../components/BoxWrapper';
import FormIcon from '../../components/Form/FormIcon';
import SubmitButton from '../../components/Form/SubmitButton';
import { PageBackButton, PageHeader } from '../style';
import { LoginPageWrapper } from './style';

const ForgotPasswordSuccess = () => {
    const navigate = useNavigate()
    const handleClose = () => {
        navigate('/login', { replace: true })
    }
    return (
        <BoxContainer>
            <BoxWrapper type='large'>
                <Row gutter={[24, 24]}>
                    <Col xs={24} lg={24}>
                        <Box>
                            <LoginPageWrapper>
                                <Form requiredMark={false} layout="vertical">
                                    <PageBackButton onClick={handleClose}>
                                        <LuX />
                                    </PageBackButton>
                                    <Row gutter={[0, 20]} justify={'center'}>
                                        <Col>
                                            <FormIcon icon={<LuCheck />} size={'large'} color='success' />
                                        </Col>
                                        <Col span={24} style={{ textAlign: 'center' }}>
                                            <PageHeader>Password reset link sent to your email address</PageHeader>
                                        </Col>
                                        <Col span={24}>
                                            <Row gutter={[0, 12]} style={{ marginTop: "44px" }}>
                                                <Col span={24} style={{ textAlign: 'center' }}>
                                                    <SubmitButton type='default' style={{ width: "100%", maxWidth: "234px" }} onClick={handleClose}>Back to Login</SubmitButton>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </Form>
                            </LoginPageWrapper>
                        </Box>
                    </Col>
                </Row>
            </BoxWrapper>
        </BoxContainer>

    )
}

export default ForgotPasswordSuccess
