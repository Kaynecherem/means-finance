import { LoadingOutlined } from '@ant-design/icons';
import { Col, Row, Spin } from 'antd';
import { useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Box from '../../components/Box';
import BoxContainer from '../../components/BoxContainer';
import BoxWrapper from '../../components/BoxWrapper';
import { useDirectUs } from '../../components/DirectUs/DirectusContext';
import { fetchPaymentWithToken } from '../../utils/apis/directus';
import { CustomerBillsLoadingWrapper } from '../Collect/CustomerBills/style';
import { PageSubHeader } from '../style';
const NonLoginPaymentFetch = () => {
    const { directusClient } = useDirectUs()
    const navigate = useNavigate()
    const { token } = useParams();
    const fetchPayment = useCallback(async () => {
        if (token) {
            const payment = await fetchPaymentWithToken(directusClient, token)
            if (payment) {
                navigate('/payment', {
                    state: {
                        duePayment: payment
                    }
                })
            } else {
                navigate('/payment/error', {
                    state: {
                        message: "Invalid or expired link."
                    }
                })
            }
        }
    }, [directusClient, navigate, token])
    useEffect(() => {
        fetchPayment()
    }, [fetchPayment])
    return (
        <BoxContainer>
            <BoxWrapper>
                <Box>
                    <CustomerBillsLoadingWrapper>
                        <Row gutter={[0, 24]} justify={"center"}>
                            <Col span={24}>
                                <PageSubHeader>
                                    Fetching Payment
                                </PageSubHeader>
                            </Col>
                            <Col>
                                <Spin indicator={<LoadingOutlined spin />} size="large" />
                            </Col>
                        </Row>
                    </CustomerBillsLoadingWrapper>
                </Box>
            </BoxWrapper>
        </BoxContainer>
    );
}

export default NonLoginPaymentFetch;
