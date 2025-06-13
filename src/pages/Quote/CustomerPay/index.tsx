import { Col, Form, message, Row } from "antd";
import { LuArrowRight } from 'react-icons/lu';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import ButtonRadioSelection from '../../../components/ButtonRadioSelection';
import DateSelector from '../../../components/Form/DateSelector';
import FormItem from "../../../components/Form/FormItem";
import SubmitButton from "../../../components/Form/SubmitButton";
import TabRadioSelection from "../../../components/Form/TabRadioSelection";
import TabRadioSolidButtons from "../../../components/Form/TabRadioSolidButtons";
import { weekDaysOptions } from "../../../utils/contants/common";
import { CustomerPayFrequency } from '../../../utils/enums/common';
import { updateQuote } from "../../../utils/redux/slices/quoteSlice";
import { RootState } from '../../../utils/redux/store';
import { PageHeader, PageSubHeader } from "../../style";
type CustomerPayForm = {
    customerPayFrequency: CustomerPayFrequency
    weekDays?: number | null
    customerPayFrequencyDays?: Array<number>
    isCustomerGetPaidOnWeekend?: boolean

}


const CustomerPay: React.FC = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const formInitialValues = useSelector(
        ({ quote }: RootState) => quote
    )

    const handleNextClick = ({ customerPayFrequency, weekDays = null, customerPayFrequencyDays = [], isCustomerGetPaidOnWeekend }: CustomerPayForm) => {
        if (customerPayFrequency === CustomerPayFrequency.WEEKLY && !weekDays) {
            message.error('Please select the day of week.')
            return
        } else if (customerPayFrequency === CustomerPayFrequency.BI_WEEKLY && customerPayFrequencyDays.length < 2) {
            message.error('Please select 2 dates of month.')
            return
        } else if (customerPayFrequency === CustomerPayFrequency.SPECIFIC_DAYS && customerPayFrequencyDays.length === 0) {
            message.error('Please select at least 1 date of month.')
            return
        }
        dispatch(updateQuote({ customerPayFrequency, weekDays, customerPayFrequencyDays, isCustomerGetPaidOnWeekend }))
        navigate('/agency/quote/bill-summary')
    }

    return (
        <Form requiredMark={false} layout="vertical" initialValues={formInitialValues} onFinish={handleNextClick}>
            <Row gutter={[0, 20]} justify={"center"}>
                <Col span={24} style={{ textAlign: "center" }}>
                    <PageHeader level={2}>When is payday?</PageHeader>
                </Col>
                <Col span={24} style={{ textAlign: "center" }}>
                    <FormItem name={'customerPayFrequency'} >
                        <TabRadioSelection options={[
                            {
                                label: 'Weekly',
                                value: CustomerPayFrequency.WEEKLY
                            },
                            {
                                label: 'Biweekly',
                                value: CustomerPayFrequency.BI_WEEKLY
                            },
                            {
                                label: 'Specific day(s) in month',
                                value: CustomerPayFrequency.SPECIFIC_DAYS
                            }
                        ]} />
                    </FormItem>
                </Col>
                <Col span={24}>
                    <PageSubHeader level={3}>
                        Which day(s) of each week do they get paid?
                    </PageSubHeader>
                </Col>
                <Form.Item
                    noStyle
                    shouldUpdate={(prevValues, currentValues) => prevValues.customerPayFrequency !== currentValues.customerPayFrequency}
                >
                    {({ getFieldValue }) =>
                        (getFieldValue('customerPayFrequency') === CustomerPayFrequency.WEEKLY) ? (
                            <Col span={24} style={{ textAlign: "center" }}>
                                <FormItem
                                    name="weekDays"
                                    style={{ width: "fit-content" }}
                                >
                                    <TabRadioSolidButtons options={weekDaysOptions} />
                                </FormItem>
                            </Col>
                        ) : null
                    }
                </Form.Item>
                <Form.Item
                    noStyle
                    shouldUpdate={(prevValues, currentValues) => prevValues.customerPayFrequency !== currentValues.customerPayFrequency}
                >
                    {({ getFieldValue }) =>
                        (
                            (getFieldValue('customerPayFrequency') === CustomerPayFrequency.SPECIFIC_DAYS) || getFieldValue('customerPayFrequency') === CustomerPayFrequency.BI_WEEKLY) ? (
                            <>
                                <Col span={24} style={{ textAlign: "center" }}>
                                    <FormItem
                                        name="customerPayFrequencyDays"
                                        style={{ width: "fit-content" }}
                                    >
                                        <DateSelector selectionLimit={2} />
                                    </FormItem>
                                </Col>
                                <Col span={24}>
                                    <PageSubHeader level={3}>
                                        Sometimes they get paid on weekends?
                                    </PageSubHeader>
                                </Col>
                                <Col span={24} style={{ textAlign: "center" }}>
                                    <FormItem
                                        name="isCustomerGetPaidOnWeekend"
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
                            </>
                        ) : null
                    }
                </Form.Item>

                <Col span={24} style={{ marginTop: "44px", textAlign: 'center', marginBottom: "10px" }}>
                    <SubmitButton htmlType="submit" icon={<LuArrowRight />}>Next</SubmitButton>
                </Col>
            </Row>
        </Form>
    )
}

export default CustomerPay;
