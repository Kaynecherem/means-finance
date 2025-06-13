import { Col, Row } from 'antd';
import { LuAlertCircle } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';
import Box from '../../components/Box';
import BoxContainer from '../../components/BoxContainer';
import BoxWrapper from '../../components/BoxWrapper';
import FormIcon from '../../components/Form/FormIcon';
import SubmitButton from '../../components/Form/SubmitButton';
import { PageHeader } from '../style';
import { LoginPageWrapper } from './style';

const ResetPasswordError = () => {
    const navigate = useNavigate()
    const handleClose = () => {
        navigate('/login', { replace: true })
    }
    return (
        <BoxContainer>
            <BoxWrapper>
                <Box>
                    <LoginPageWrapper>
                        <Row gutter={[0, 20]} justify={'center'}>
                            <Col>
                                <FormIcon icon={<LuAlertCircle />} size={'large'} color='danger' />
                            </Col>
                            <Col span={24} style={{ textAlign: 'center' }}>
                                <PageHeader>Invalid or Expired Link</PageHeader>
                            </Col>
                            <Col span={24}>
                                <Row gutter={[0, 12]} style={{ marginTop: "44px" }}>
                                    <Col span={24} style={{ textAlign: 'center' }}>
                                        <SubmitButton type='default' style={{ width: "100%", maxWidth: "234px" }} onClick={handleClose}>Back to Login</SubmitButton>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </LoginPageWrapper></Box></BoxWrapper></BoxContainer>

    )
}

export default ResetPasswordError
