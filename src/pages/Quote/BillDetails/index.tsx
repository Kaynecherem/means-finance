import { Col, Form, Row } from "antd";
import { LuArrowRight, LuDollarSign } from 'react-icons/lu';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ButtonRadioSelection from "../../../components/ButtonRadioSelection";
import FormItem from "../../../components/Form/FormItem";
import NumberField from "../../../components/Form/NumberField";
import SubmitButton from "../../../components/Form/SubmitButton";
import TabRadioSelection from "../../../components/Form/TabRadioSelection";
import { BillTypeEnum, QuoteFrequency } from "../../../utils/enums/common";
import { updateQuote } from "../../../utils/redux/slices/quoteSlice";
import { RootState } from "../../../utils/redux/store";
import { PageHeader, PageSubHeader } from "../../style";
import { ExtraFormLabel } from "./style";

type BillDetailsFormValues = {
    quoteFrequency: QuoteFrequency
    quoteAmount: number
    isDownPaymentRequired: boolean
    downPaymentAmount: number

}

const BillDetails: React.FC = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const formInitialValues = useSelector(
        ({ quote }: RootState) => quote
    )

    const handleNextClick = (values: BillDetailsFormValues) => {


        dispatch(updateQuote({ ...values }))
        navigate('/agency/quote/customer-pay')
    }

    return (
        <Form requiredMark={false} layout="vertical" onFinish={handleNextClick} initialValues={formInitialValues}>
            <Row justify={"center"} gutter={[0, 20]}>
                <Col span={24} style={{ textAlign: "center" }}>
                    <PageHeader level={2}>
                        {formInitialValues.quoteType === BillTypeEnum.AUTO_INSURANCE ? "Policy Quoted Price" : "Bill Amount"}
                    </PageHeader>
                </Col>
                <Col span={24} style={{ textAlign: "center" }}>
                    <FormItem name={'quoteFrequency'}>
                        <TabRadioSelection options={[
                            {
                                label: 'Monthly',
                                value: QuoteFrequency.MONTHLY
                            },
                            {
                                label: 'Quarterly',
                                value: QuoteFrequency.QUARTERLY
                            },
                            {
                                label: '6 Months',
                                value: QuoteFrequency.HALF_YEARLY
                            },
                            {
                                label: 'Annually',
                                value: QuoteFrequency.ANNUAL
                            }
                        ]} />
                    </FormItem>
                </Col>
                <Col xs={24} lg={8}>
                    <ExtraFormLabel>
                        (After deducting any amount due today)
                    </ExtraFormLabel>
                    <FormItem
                        label="Amount"
                        name="quoteAmount"
                        rules={[{ required: true, }, { type: 'number', min: 1 }]}
                        icon={<LuDollarSign />}
                    >
                        <NumberField prefix={'$'} type="number" changeOnWheel={false} />
                    </FormItem>
                </Col>
                <Col span={24}>
                    <PageSubHeader level={3}>
                        Is there a payment due today?
                    </PageSubHeader>
                </Col>
                <Col span={24} style={{ textAlign: "center" }}>
                    <FormItem
                        name="isDownPaymentRequired"
                    >
                        <ButtonRadioSelection options={[{
                            value: true,
                            label: 'Yes'
                        }, {
                            value: false,
                            label: 'No'
                        }]} />
                    </FormItem>
                </Col>
                <Form.Item
                    noStyle
                    shouldUpdate={(prevValues, currentValues) => prevValues.isDownPaymentRequired !== currentValues.isDownPaymentRequired}
                >
                    {({ getFieldValue }) =>
                        getFieldValue('isDownPaymentRequired') ? (
                            <Col xs={24} lg={8}>
                                <FormItem
                                    label="Amount"
                                    name="downPaymentAmount"
                                    rules={[{ required: true }, { type: 'number', min: 1 }]}
                                    icon={<LuDollarSign />}
                                >
                                    <NumberField prefix={'$'} type="number" changeOnWheel={false} />
                                </FormItem>
                            </Col>
                        ) : null
                    }
                </Form.Item>
                <Col span={24} style={{ marginTop: "44px", textAlign: 'center', marginBottom: "10px" }}>
                    <SubmitButton htmlType="submit" icon={<LuArrowRight />}>Next</SubmitButton>
                </Col>
            </Row>
        </Form>
    );
}

export default BillDetails;
