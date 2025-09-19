import { Col, Row } from "antd";
import { useMemo } from "react";
import { LuArrowRight } from 'react-icons/lu';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import FeesInfoCard from "../../../components/FeesInfoCard";
import SubmitButton from '../../../components/Form/SubmitButton';
import billDueCalculation from "../../../utils/helpers/billDueCalculation";
import getDueLabel from "../../../utils/helpers/getDueLabel";
import getInstallmentLabel from "../../../utils/helpers/getInstallmentLabel";
import { resetQuote, updateQuote } from "../../../utils/redux/slices/quoteSlice";
import { RootState } from '../../../utils/redux/store';
import { AmountWrapper, BilledDetails, DownPaymentWrapper, SummaryDetails, SummaryWrapper } from "./style";

const BillSummary: React.FC = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const quote = useSelector(
        ({ quote: stateQuote }: RootState) => stateQuote
    )
    const calculatedInfo = useMemo(() => billDueCalculation(quote), [quote])

    const handleResetClick = () => {
        dispatch(resetQuote())
        navigate('/agency/quote/bill-type')
    }
    const handleContinueWithNew = () => {
        dispatch(updateQuote({
            customerSelection: 'new',
            existingCustomerId: null,
            existingCustomerDeluxeCustomerId: null,
            existingCustomerDeluxeVaultId: null,
            customerEmail: null,
            customerFirstName: null,
            customerLastName: null,
            customerPhone: null,
        }))
        navigate('/agency/quote/deluxe-payment')
    }

    const handleContinueWithExisting = () => {
        sessionStorage.removeItem('deluxeData')
        dispatch(updateQuote({
            customerSelection: 'existing',
            existingCustomerId: null,
            existingCustomerDeluxeCustomerId: null,
            existingCustomerDeluxeVaultId: null,
            customerEmail: null,
            customerFirstName: null,
            customerLastName: null,
            customerPhone: null,
        }))
        navigate('/agency/quote/existing-customer')
    }

    return (

        <Row gutter={[0, 24]} justify={'center'}>
            {calculatedInfo.isDownPaymentRequired &&
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
                            ${Number(calculatedInfo.calculatedQuoteAmount).toFixed(2)}
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
                    ]}
                />
            </Col>
            <Col span={24} style={{ marginTop: "32px" }}>
                <Row gutter={[40, 0]} justify={'center'}>
                    <Col>
                        <SubmitButton danger htmlType="button" onClick={handleResetClick}>Start Over</SubmitButton>
                    </Col>
                    <Col>
                        <SubmitButton htmlType="button" icon={<LuArrowRight />} onClick={handleContinueWithNew}>
                            Continue with new
                        </SubmitButton>
                    </Col>
                    <Col>
                        <SubmitButton htmlType="button" icon={<LuArrowRight />} onClick={handleContinueWithExisting}>
                            Continue with existing
                        </SubmitButton>
                    </Col>
                </Row>
            </Col>
        </Row>
    )
}

export default BillSummary;
