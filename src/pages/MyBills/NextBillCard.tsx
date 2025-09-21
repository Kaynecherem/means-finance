import { message } from 'antd'
import moment from "moment"
import { useCallback, useEffect, useState } from "react"
import { useNavigate } from 'react-router-dom'
import { useDirectUs } from '../../components/DirectUs/DirectusContext'
import CustomButton1 from '../../components/Form/CustomButton1'
import { LoadingSpinner } from "../../components/LoadingSpinner"
import MiniCard from "../../components/MiniCard"
import { getLatestPaymentOfBill } from '../../utils/apis/directus/index'
import { InternalErrors } from '../../utils/types/errors'
import { DirectusBill, DirectusPayment } from "../../utils/types/schema"
import { StatusWrapper } from '../style'
import { NextBillAmountWrapper, NextBillCardWrapper, NextBillDueDate, NextBillHeading } from "./style"
import normalizePaymentStatus from '../../utils/helpers/normalizePaymentStatus'

const NextBillCard: React.FC<{
    bill?: DirectusBill | null
}> = ({ bill }) => {
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()
    const { directusClient } = useDirectUs()
    const [duePayment, setDuePayment] = useState<DirectusPayment | null>(null)
    const fetchLatestDuePayment = useCallback(async () => {
        if (bill) {
            try {
                setLoading(true)
                const paymentRes = await getLatestPaymentOfBill(directusClient, bill?.id)
                const normalizedStatus = paymentRes ? normalizePaymentStatus(paymentRes) : null

                if (paymentRes && normalizedStatus && (normalizedStatus === 'pending' || normalizedStatus === 'missed' || normalizedStatus === 'upcoming')) {
                    setDuePayment({ ...paymentRes, status: normalizedStatus })
                } else {
                    setDuePayment(null)
                }
            } catch (error) {
                message.error((error as InternalErrors).message)
            } finally {
                setLoading(false)
            }
        }
    }, [bill, directusClient])

    useEffect(() => {
        if (bill) {
            fetchLatestDuePayment()
        }
    }, [bill, fetchLatestDuePayment])

    const handlePay = () => {
        navigate('/payment', {
            state: {
                duePayment
            }
        })
    }
    return <MiniCard>
        <NextBillCardWrapper>
            {loading &&
                <LoadingSpinner style={{ minHeight: "unset", width: "100%", height: "100%" }} fullScreen />
            }
            {!loading && !duePayment &&
                <>
                    <NextBillHeading>Next Bill</NextBillHeading>
                    <NextBillAmountWrapper>
                        <div className="currency">$</div>
                        <div className="amount">{Number(bill?.installments).toFixed(2)}</div>
                    </NextBillAmountWrapper>
                    <NextBillDueDate>
                        on {moment(bill?.next_installment_date).format('MM/DD/YYYY')}
                    </NextBillDueDate>
                </>
            }
            {!loading && duePayment &&
                <>
                    <NextBillHeading><StatusWrapper status={duePayment.status}>Bill Due</StatusWrapper></NextBillHeading>
                    <NextBillAmountWrapper isDue={true}>
                        <div className="currency"><StatusWrapper status={duePayment.status}>$</StatusWrapper></div>
                        <div className="amount"><StatusWrapper status={duePayment.status}>{Number(duePayment.value).toFixed(2)}</StatusWrapper></div>
                    </NextBillAmountWrapper>
                    <NextBillDueDate>
                        on {moment(duePayment.due_date).format('MM/DD/YYYY')}
                    </NextBillDueDate>
                    <CustomButton1 style={{ marginTop: "9px" }} onClick={handlePay}>Pay</CustomButton1>
                </>
            }
        </NextBillCardWrapper>
    </MiniCard>
}
export default NextBillCard
