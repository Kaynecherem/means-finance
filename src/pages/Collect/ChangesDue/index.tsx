import { Col, Form, Row, message } from 'antd';
import { useEffect, useState } from 'react';
import { LuCheck, LuX } from 'react-icons/lu';
import { useLocation, useNavigate } from 'react-router-dom';
import Box from '../../../components/Box';
import BoxContainer from '../../../components/BoxContainer';
import BoxWrapper from '../../../components/BoxWrapper';
import { useDirectUs } from '../../../components/DirectUs/DirectusContext';
import FormIcon from '../../../components/Form/FormIcon';
import SubmitButton from '../../../components/Form/SubmitButton';
import { recordCashPayment } from '../../../utils/apis/directus';
import { InternalErrors } from '../../../utils/types/errors';
import { DirectusPayment } from '../../../utils/types/schema';
import { PageBackButton, PageSubHeader } from '../../style';
import { AmountWrapper, DueWrapper } from './style';
const ChangesDue = () => {
    const navigate = useNavigate()
    const { directusClient } = useDirectUs()
    const { state: { duePayment, collectedAmount } }: { state: { duePayment: DirectusPayment | null, collectedAmount: number } } = useLocation()
    const [credit, setCredit] = useState(0)
    const [changeIssuedLoading, setChangeIssuedLoading] = useState(false)
    const [applyCreditLoading, setApplyCreditLoading] = useState(false)
    useEffect(() => {
        if (!duePayment || !collectedAmount) {
            navigate('/agency/collect/customer-summary', { replace: true })
        } else {
            setCredit(Number(collectedAmount) - Number(duePayment.value))
        }
    }, [collectedAmount, duePayment, navigate])
    const handleChangeIssued = async () => {
        setChangeIssuedLoading(true)
        if (duePayment && collectedAmount) {
            await recordPayment(duePayment.id, Number(duePayment.value), 0)
        }
        setChangeIssuedLoading(false)
    }
    const handleApplyCredit = async () => {
        setApplyCreditLoading(true)
        if (duePayment && collectedAmount) {
            const creditAmount = Number(collectedAmount) - Number(duePayment.value)
            await recordPayment(duePayment.id, Number(duePayment.value), creditAmount)
        }
        setApplyCreditLoading(false)
    }
    const recordPayment = async (paymentId: number, amount: number, creditAmount: number) => {
        try {
            await recordCashPayment(directusClient, paymentId, {
                amount,
                cash_credit: creditAmount
            })
            navigate('/agency/collect/success', { replace: true })
        } catch (error) {
            message.error((error as InternalErrors).message)
        }
    }
    return (
        <BoxContainer>
            <BoxWrapper type='large'>
                <Row gutter={[24, 24]}>
                    <Col xs={24} lg={24}>
                        <Box>
                            <Form requiredMark={false} layout="vertical">
                                <DueWrapper>
                                    <PageBackButton onClick={() => navigate('/agency/collect/customer-summary')}>
                                        <LuX />
                                    </PageBackButton>
                                    <Row gutter={[0, 20]} justify={'center'}>
                                        <Col>
                                            <FormIcon icon={<LuCheck />} size={'large'} color='success' />
                                        </Col>
                                        <Col span={24}>
                                            <PageSubHeader>Change Due</PageSubHeader>
                                        </Col>
                                        <Col span={24}>
                                            <AmountWrapper>
                                                <div className='currency'>$</div>
                                                <div className='number'>{Number(credit).toFixed(2)}</div>
                                            </AmountWrapper>
                                        </Col>
                                        <Col span={24}>
                                            <Row gutter={[0, 12]} style={{ marginTop: "44px" }}>
                                                <Col span={24} style={{ textAlign: 'center' }}>
                                                    <SubmitButton type='default' style={{ width: "100%", maxWidth: "234px" }} onClick={handleChangeIssued} loading={changeIssuedLoading} disabled={applyCreditLoading}>Change Issued</SubmitButton>
                                                </Col>
                                                <Col span={24} style={{ textAlign: 'center' }}>
                                                    <SubmitButton style={{ width: "100%", maxWidth: "234px" }} onClick={handleApplyCredit} loading={applyCreditLoading} disabled={changeIssuedLoading}>Apply change as credit</SubmitButton>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </DueWrapper>
                            </Form>
                        </Box>
                    </Col>
                </Row>
            </BoxWrapper>
        </BoxContainer >

    )
}

export default ChangesDue
