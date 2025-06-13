import { Col, Form, Row } from 'antd';
import { useCallback } from 'react';
import { LuCheck, LuX } from 'react-icons/lu';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Box from '../../../components/Box';
import BoxWrapper from '../../../components/BoxWrapper';
import FormIcon from '../../../components/Form/FormIcon';
import SubmitButton from '../../../components/Form/SubmitButton';
import { Roles } from '../../../utils/enums/common';
import { RootState } from '../../../utils/redux/store';
import { PageBackButton, PageHeader } from '../../style';
import { SuccessWrapper } from './style';
const Success = () => {
    const navigate = useNavigate()
    const userRole = useSelector((state: RootState) => state.auth.role)

    const handleClose = useCallback(() => {
        if (userRole === Roles.AGENCY) {
            navigate('/agency/collect/customer-bills', { replace: true })
        } else {
            navigate(`/my-bills`, { replace: true })
        }
    }, [navigate, userRole])
    return (
        <BoxWrapper type='large'>
            <Row gutter={[24, 24]}>
                <Col xs={24} lg={24}>
                    <Box>
                        <Form requiredMark={false} layout="vertical">
                            <SuccessWrapper>
                                <PageBackButton onClick={handleClose}>
                                    <LuX />
                                </PageBackButton>
                                <Row gutter={[0, 20]} justify={'center'}>
                                    <Col>
                                        <FormIcon icon={<LuCheck />} size={'large'} color='success' />
                                    </Col>
                                    <Col span={24} style={{ textAlign: 'center' }}>
                                        <PageHeader>Success</PageHeader>
                                    </Col>
                                    <Col span={24}>
                                        <Row gutter={[0, 12]} style={{ marginTop: "44px" }}>
                                            <Col span={24} style={{ textAlign: 'center' }}>
                                                <SubmitButton type='default' style={{ width: "100%", maxWidth: "234px" }} onClick={handleClose}>
                                                    {userRole === Roles.AGENCY ? "Back to customer" : "Back to dashboard"}
                                                </SubmitButton>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </SuccessWrapper>
                        </Form>
                    </Box>
                </Col>
            </Row>
        </BoxWrapper>

    )
}

export default Success
