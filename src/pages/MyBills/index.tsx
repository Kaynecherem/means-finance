import { Col, Row, message } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import BoxContainer from '../../components/BoxContainer';
import BoxWrapper from '../../components/BoxWrapper';
import { useDirectUs } from '../../components/DirectUs/DirectusContext';
import UserAccounts from '../../components/UserAccounts';
import UserCards from '../../components/UserCards';
import { getCustomerDueBills, getCustomerPaymentSources } from '../../utils/apis/directus/index';
import { BankAccount, Card } from '../../utils/types/common';
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
            if (bill?.agency) {
                try {
                    setIsPaymentSourceLoading(true)
                    const agencyId = (bill.agency as DirectusAgency).id
                    const res = await getCustomerPaymentSources(directusClient, { agency: agencyId })
                    setCards(res.cards)
                    setBankAccounts(res.bank_accounts)
                } catch (error) {
                    message.error((error as InternalErrors).message)
                } finally {
                    setIsPaymentSourceLoading(false)
                }
            }
        },
        [bill?.agency, directusClient],
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
