import { Col, Form, Row, message } from 'antd';
import { useMemo, useState } from 'react';
import ButtonRadioSelection from '../../components/ButtonRadioSelection';
import CustomModal from '../../components/CustomModal';
import { useDirectUs } from '../../components/DirectUs/DirectusContext';
import DateSelector from '../../components/Form/DateSelector';
import FormItem from '../../components/Form/FormItem';
import SubmitButton from '../../components/Form/SubmitButton';
import TabRadioSelection from '../../components/Form/TabRadioSelection';
import TabRadioSolidButtons from '../../components/Form/TabRadioSolidButtons';
import { updateBillUserPayroll } from '../../utils/apis/directus';
import { weekDaysOptions } from '../../utils/contants/common';
import { CustomerPayFrequency } from '../../utils/enums/common';
import { InternalErrors } from '../../utils/types/errors';
import { DirectusBill } from '../../utils/types/schema';
import { PageHeader, PageSubHeader } from '../style';
type CustomerPayForm = {
    customerPayFrequency: CustomerPayFrequency
    weekDays?: number | null
    customerPayFrequencyDays?: Array<number>
    isCustomerGetPaidOnWeekend?: boolean
}
const UpdateGetPaidModal: React.FC<{
    open?: boolean
    bill?: DirectusBill | null
    onClose?: () => void
    onUpdate?: () => void
}> = ({ bill, ...props }) => {


    const [saving, setSaving] = useState(false)
    const { directusClient } = useDirectUs()

    const customerPayFrequencyDays = useMemo(() => {
        switch (bill?.user_payrol_type) {
            case CustomerPayFrequency.BI_WEEKLY:
                return bill.biweekly?.split(',').map(Number) || []
            case CustomerPayFrequency.MONTHLY:
                return bill.monthly ? [bill.monthly] : []
            case CustomerPayFrequency.SPECIFIC_DAYS:
                return bill.specific_days?.split(',').map(Number) || []
            default:
                return [];
        }
    }, [bill])
    const formInitialValues = useMemo<CustomerPayForm | null>(() => {
        if (!bill) {
            return null
        }
        return {
            customerPayFrequency: bill.user_payrol_type === CustomerPayFrequency.MONTHLY ? CustomerPayFrequency.SPECIFIC_DAYS : bill.user_payrol_type,
            customerPayFrequencyDays: customerPayFrequencyDays || [],
            weekDays: bill.user_payrol_type === CustomerPayFrequency.WEEKLY ? Number(bill.weekly) : null,
            isCustomerGetPaidOnWeekend: bill.paid_on_weekends
        }
    }, [bill, customerPayFrequencyDays])

    const handleSubmit = async (values: CustomerPayForm) => {
        if (bill) {
            try {

                if (values.customerPayFrequency === CustomerPayFrequency.WEEKLY && !values.weekDays) {
                    message.error('Please select the day of week.')
                    return
                } else if (values.customerPayFrequency === CustomerPayFrequency.BI_WEEKLY && values.customerPayFrequencyDays && values.customerPayFrequencyDays.length < 2) {
                    message.error('Please select 2 dates of month.')
                    return
                } else if (values.customerPayFrequency === CustomerPayFrequency.SPECIFIC_DAYS && values.customerPayFrequencyDays && values.customerPayFrequencyDays.length === 0) {
                    message.error('Please select at least 1 date of month.')
                    return
                }
                setSaving(true)
                const payload = {
                    billId: bill.id,
                    user_payrol_type: (values.customerPayFrequency === CustomerPayFrequency.SPECIFIC_DAYS && values.customerPayFrequencyDays?.length === 1) ? CustomerPayFrequency.MONTHLY : values.customerPayFrequency,
                    weekly: values.customerPayFrequency === CustomerPayFrequency.WEEKLY && values.weekDays ? values.weekDays?.toString() : null,
                    biweekly: values.customerPayFrequency === CustomerPayFrequency.BI_WEEKLY && values.customerPayFrequencyDays ? values.customerPayFrequencyDays.join(',') : null,
                    monthly: (values.customerPayFrequency === CustomerPayFrequency.SPECIFIC_DAYS && values.customerPayFrequencyDays?.length === 1) ? values.customerPayFrequencyDays[0] : null,
                    specific_days: (values.customerPayFrequency === CustomerPayFrequency.SPECIFIC_DAYS && values.customerPayFrequencyDays && values.customerPayFrequencyDays.length > 1) ? values.customerPayFrequencyDays?.join(',') : null,
                    paid_on_weekends: values.isCustomerGetPaidOnWeekend ?? false,
                }

                await updateBillUserPayroll(directusClient, payload)
                if (props.onUpdate) {
                    props.onUpdate()
                }
            } catch (error) {
                message.error((error as InternalErrors).message)
            } finally {
                setSaving(false)
            }
        }

    }

    return (<CustomModal
        // title={'When is payday?'}
        open={props.open}
        onClose={props.onClose}
        onCancel={props.onClose}
        footer={false}
        width={1255}
        destroyOnClose
    >
        {formInitialValues &&
            <Form requiredMark={false} layout="vertical" initialValues={formInitialValues} onFinish={handleSubmit}>
                <Row gutter={[0, 20]} justify={"center"}>
                    <Col span={24} style={{ textAlign: "center", marginTop: "36px" }}>
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
                        <SubmitButton htmlType="submit" loading={saving}>Save</SubmitButton>
                    </Col>
                </Row>
            </Form>
        }
    </CustomModal>)
}

export default UpdateGetPaidModal
