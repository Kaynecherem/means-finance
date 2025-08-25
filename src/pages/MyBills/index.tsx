import { Col, Row, message } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import BoxContainer from '../../components/BoxContainer';
import BoxWrapper from '../../components/BoxWrapper';
import { useDirectUs } from '../../components/DirectUs/DirectusContext';
import UserAccounts from '../../components/UserAccounts';
import UserCards from '../../components/UserCards';
import { getCustomerDueBills, stageCustomerPaymentMethod, fetchCustomerAgencyFlowNew } from '../../utils/apis/directus';
import { BankAccount, Card } from '../../utils/types/common';
import { CARD_TYPE_BRAND_MAPPING } from '../../utils/contants/common';
import { InternalErrors } from '../../utils/types/errors';
import { DirectusAgency, DirectusBill } from '../../utils/types/schema';
import Bills from './Bills';
import CompletedBills from './CompletedBills';
import GetPaidCard from './GetPaidCard';
import NextBillCard from './NextBillCard';
const MyBills: React.FC = () => {
    const [bill, setBill] = useState<DirectusBill | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isPaymentSourceLoading, setIsPaymentSourceLoading] = useState(true)
    const [cards, setCards] = useState<Array<Card>>([])
    const [bankAccounts, setBankAccounts] = useState<Array<BankAccount>>([])
    const { directusClient } = useDirectUs();
    const fetchCardInfo = useCallback(
        async () => {
            if (bill?.agency && bill?.customer) {
                try {
                    setIsPaymentSourceLoading(true)
                    const agencyId = (bill.agency as DirectusAgency).id
                    await stageCustomerPaymentMethod(directusClient, {
                        customer_id: bill.customer as string,
                        agency: String(agencyId)
                    })
                    const res: any[] = await fetchCustomerAgencyFlowNew(directusClient, {
                        agency: String(agencyId),
                        customer_id: bill.customer as string
                    })
                    const customerMethods = res.filter(pm => pm.owner === bill.customer)
                    const fetchedCards: Card[] = customerMethods
                        .filter(pm => pm.expiry)
                        .map(pm => ({
                            id: pm.payment_method_id,
                            is_default: 0,
                            first6digit: Number(pm.masked_pan?.slice(0, 6)),
                            last4digit: pm.masked_pan?.slice(-4),
                            exp_month: pm.expiry.split('/')[0],
                            exp_year: pm.expiry.split('/')[1],
                            brand: pm.card_type?.[0]?.toUpperCase() as keyof typeof CARD_TYPE_BRAND_MAPPING
                        }))
                    const fetchedAccounts: BankAccount[] = customerMethods
                        .filter(pm => pm.routing_number)
                        .map(pm => ({
                            id: pm.payment_method_id,
                            is_default: 0,
                            routing_number: Number(pm.routing_number),
                            account_number: pm.account_number
                        }))
                    setCards(fetchedCards)
                    setBankAccounts(fetchedAccounts)
                } catch (error) {
                    message.error((error as InternalErrors).message)
                } finally {
                    setIsPaymentSourceLoading(false)
                }
            }
        },
        [bill?.agency, bill?.customer, directusClient],
    )
    useEffect(() => {
        fetchCardInfo()
    }, [fetchCardInfo])

    const fetchUserBill = useCallback(async () => {
        setIsLoading(true)
        try {
            const billData = await getCustomerDueBills(directusClient)
            if (billData.length > 0) {
                setBill(billData[0])
            } else {
                setBill(null)
            }
        } catch (error) {
            message.error((error as InternalErrors).message)
        } finally {
            setIsLoading(false)
        }
    }, [directusClient])

    useEffect(() => {
        fetchUserBill()
    }, [fetchUserBill])

    return (
        <BoxContainer style={{ alignItems: "flex-start", paddingTop: "40px" }}>
            <BoxWrapper type='xl'>
                <Row gutter={[16, 24]}>
                    {(isLoading || bill) &&
                        <>
                            <Col xs={24} lg={4}>
                                <NextBillCard bill={bill} />
                            </Col>
                            <Col xs={24} lg={6}>
                                <GetPaidCard bill={bill} loading={isLoading} onUpdate={fetchUserBill} />
                            </Col>
                            <Col xs={24} lg={7}>
                                <UserCards loading={isPaymentSourceLoading} cards={cards} agencyId={bill?.agency ? (bill.agency as DirectusAgency).id : null} refetch={fetchCardInfo} changeLoading={setIsPaymentSourceLoading} />
                            </Col>
                            <Col xs={24} lg={7}>
                                <UserAccounts loading={isPaymentSourceLoading} bankAccounts={bankAccounts} agencyId={bill?.agency ? (bill.agency as DirectusAgency).id : null} refetch={fetchCardInfo} />
                            </Col>
                        </>
                    }
                    {(isLoading || bill) &&
                        <Col span={24}>
                            <Bills bills={bill ? [bill] : []} loading={isLoading} />
                        </Col>
                    }
                    <Col span={24}>
                        <CompletedBills />
                    </Col>
                </Row>


            </BoxWrapper>
        </BoxContainer>
    )
}

export default MyBills
