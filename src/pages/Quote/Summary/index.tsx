import { Col, message, Row } from "antd";
import moment, { Moment } from "moment";
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import Countdown from "../../../components/Coutdown";
import { useDirectUs } from "../../../components/DirectUs/DirectusContext";
import FeesInfoCard from '../../../components/FeesInfoCard';
import { getBillById, resendQuoteConfirmation } from "../../../utils/apis/directus";
import billDueCalculation from '../../../utils/helpers/billDueCalculation';
import getDueLabel from "../../../utils/helpers/getDueLabel";
import getInstallmentLabel from '../../../utils/helpers/getInstallmentLabel';
import { updateCollect } from "../../../utils/redux/slices/collectSlice";
import { resetQuote } from "../../../utils/redux/slices/quoteSlice";
import { RootState } from '../../../utils/redux/store';
import { InternalErrors } from "../../../utils/types/errors";
import { CustomDirectusUser } from "../../../utils/types/schema";
import { PageHeader, PageSubHeader } from "../../style";
import { AmountWrapper, BilledDetails, DownPaymentWrapper, SummaryDetails, SummaryWrapper } from '../BillSummary/style';
import { AcceptText, CancelButton, PhoneNumberText, ResendCodeButton } from "./style";

let interval: NodeJS.Timer
const Summary: React.FC = () => {
    const quote = useSelector(
        ({ quote: stateQuote }: RootState) => stateQuote
    )
    const { directusClient } = useDirectUs()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const calculatedInfo = useMemo(() => billDueCalculation(quote), [quote])
    const [quoteCreatedAt, setQuoteCreatedAt] = useState<Moment>(moment())
    const [resending, setResending] = useState(false)
    const [enableResend, setEnableResend] = useState(false)

    const refetchBills = useCallback(async () => {
        try {
            if (quote.id) {
                const bill = await getBillById(directusClient, quote.id)

                if (bill.status === 'confirmed') {
                    if (interval) {
                        clearInterval(interval)
                    }
                    dispatch(updateCollect({
                        bill,
                        customer: bill.customer as CustomDirectusUser
                    }))
                    dispatch(resetQuote())
                    navigate('/agency/collect/customer-summary')

                }
            }
        } catch (error) {
            message.error((error as InternalErrors).message)
        }
    }, [directusClient, dispatch, navigate, quote.id])

    const eventSetup = () => {
        interval = setInterval(refetchBills, 3000)
    }
    const handleStartOver = () => {
        dispatch(resetQuote())
        navigate('/agency/quote/bill-type')
    }
    useEffect(() => {
        eventSetup()
        return () => {
            if (interval) {
                clearInterval(interval)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const resendCode = useCallback(async () => {
        if (quote.id) {
            try {
                setResending(true)
                await resendQuoteConfirmation(directusClient, { billId: quote.id })
                setEnableResend(false)
                setQuoteCreatedAt(moment())
            } catch (error) {
                message.error((error as InternalErrors).message)

            } finally {
                setResending(false)
            }
        }
    }, [directusClient, quote.id])

    const handleCountDownCompleted = useCallback(() => setEnableResend(true), [])
    return (
        <Row gutter={[0, 20]} justify={"center"}>
            <Col span={24} style={{ textAlign: "center" }}>
                <PageHeader level={2}>Complete Sign up</PageHeader>
            </Col>
            <Col span={24} style={{ textAlign: "center" }}>
                <AcceptText>& accept offer of:</AcceptText>
            </Col>
            {quote.isDownPaymentRequired &&
                <Col span={24}>
                    <DownPaymentWrapper>
                        <div className="title">
                            Due Today
                        </div>
                        <AmountWrapper>
                            <div className="currency">
                                $
                            </div>
                            <div className="amount">
                                {Number(calculatedInfo.downPaymentAmount).toFixed(2)}
                            </div>
                        </AmountWrapper>
                    </DownPaymentWrapper>
                </Col>
            }

            <Col span={24}>
                <SummaryWrapper>
                    <BilledDetails>
                        <div className="text">
                            {getInstallmentLabel(calculatedInfo)}
                        </div>
                        <AmountWrapper>
                            <div className="currency">
                                $
                            </div>
                            <div className="amount">
                                {Number(calculatedInfo.installmentAmount).toFixed(2)}
                            </div>
                        </AmountWrapper>
                    </BilledDetails>
                    <SummaryDetails>
                        <div className="text">
                            Due {getDueLabel(quote.quoteFrequency)}
                        </div>
                        <div className="amount">
                            ${Number(calculatedInfo.quoteAmount).toFixed(2)}
                        </div>
                    </SummaryDetails>
                </SummaryWrapper>
            </Col>
            <Col span={12}>
                <FeesInfoCard
                    fields={[
                        ...(calculatedInfo.isDownPaymentRequired ? [{
                            label: "Due Today",
                            amount: Number(calculatedInfo.downPaymentAmount),
                            key: "downPayment"
                        }] : []),
                        {
                            label: getInstallmentLabel(calculatedInfo),
                            amount: Number(calculatedInfo.installmentAmount),
                            key: "installment"
                        },
                        {
                            label: `Due ${getDueLabel(quote.quoteFrequency)}`,
                            amount: Number(calculatedInfo.calculatedQuoteAmount),
                            key: "totalDue"
                        }
                    ]} />
            </Col>
            <Col span={24}>
                <PageSubHeader>
                    Respond “Yes”  to the text message just sent to
                </PageSubHeader>
            </Col>
            <Col span={24}>
                <PhoneNumberText>{quote.customerPhone}</PhoneNumberText>
            </Col>
            {quoteCreatedAt &&
                <Col span={24} style={{ textAlign: 'center' }}>

                    <ResendCodeButton disabled={!enableResend} onClick={resendCode} loading={resending}>Resend Code
                        {!enableResend &&
                            <Countdown from={quoteCreatedAt} countDownCompleted={handleCountDownCompleted} />
                        }
                    </ResendCodeButton>
                </Col>
            }
            <Col span={24} style={{ marginTop: "20px", textAlign: 'center', marginBottom: "10px" }}>
                <CancelButton danger onClick={handleStartOver}>Cancel & start over</CancelButton>
            </Col>
        </Row>
    )
}

export default Summary;
