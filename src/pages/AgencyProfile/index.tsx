import { Col, message, Row, Skeleton } from "antd"
import { useCallback, useEffect, useState } from "react"
import { LuBarChart, LuDollarSign, LuMapPin, LuPhone } from "react-icons/lu"
import { useSelector } from 'react-redux'
import Box from "../../components/Box"
import BoxContainer from "../../components/BoxContainer"
import BoxWrapper from "../../components/BoxWrapper"
import { useDirectUs } from "../../components/DirectUs/DirectusContext"
import DueNow from "../../components/DueNow"
import { getTodaysPaymentByAgency } from "../../utils/apis/directus"
import { RootState } from '../../utils/redux/store'
import { InternalErrors } from "../../utils/types/errors"
import { AgencyName, AgencyProfilePageWrapper, BankHeading, BankValue, BillDueWrapper, InfoHeading, InfoValue, LabelIcon, Separator } from './style'


const AgencyProfile: React.FC = () => {
    const agency = useSelector(({ auth }: RootState) => auth.agency)
    const { directusClient } = useDirectUs()
    const [loading, setLoading] = useState(true)
    const [todaysTotal, setTodaysTotal] = useState(0)
    const fetchTodaysPayment = useCallback(async () => {
        if (agency) {
            setLoading(true)
            try {
                const total = await getTodaysPaymentByAgency(directusClient, agency.id)
                setTodaysTotal(total)
            } catch (error) {
                message.error((error as InternalErrors).message)
            } finally {
                setLoading(false)
            }
        }
    }, [agency, directusClient])

    useEffect(() => {
        fetchTodaysPayment()
    }, [fetchTodaysPayment])
    return (
        <BoxContainer>
            <BoxWrapper type="large">
                <Box>
                    <AgencyProfilePageWrapper>
                        <Row gutter={[0, 24]} justify={'center'}>
                            {loading &&
                                <Col span={24} style={{ textAlign: "center" }}>
                                    <Skeleton.Node active style={{ width: '350px', height: "117px" }}><LuDollarSign /></Skeleton.Node>
                                </Col>
                            }
                            {!loading &&
                                <Col span={24}>
                                    <DueNow amount={todaysTotal} label="Money collected today" />
                                </Col>
                            }
                            <Col span={24}>
                                <AgencyName>
                                    {agency?.agencyName}
                                    {/* <Button type='link' disabled><LuPenSquare /></Button> */}
                                </AgencyName>
                            </Col>
                            <Col xs={24} lg={10}>
                                <Row gutter={[0, 24]}>
                                    <Col span={24}>
                                        <BillDueWrapper />
                                    </Col>
                                    <Col span={24}>
                                        <Row gutter={[0, 12]}>
                                            <Col span={24}>
                                                <InfoHeading>Location</InfoHeading>
                                                <InfoValue>
                                                    <LabelIcon>
                                                        <LuMapPin />
                                                    </LabelIcon>
                                                    {agency?.addressOne} {agency?.addressTwo} {agency?.city} {agency?.country} {agency?.postalCode}
                                                </InfoValue>
                                            </Col>
                                            <Col span={24}>
                                                <InfoHeading>Phone Number</InfoHeading>
                                                <InfoValue>
                                                    <LabelIcon>
                                                        <LuPhone />
                                                    </LabelIcon>
                                                    {agency?.agencyPhoneNumber}
                                                </InfoValue>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col span={24} style={{ textAlign: "center" }}>
                                        <Separator />
                                    </Col>
                                    <Col span={24} >
                                        <Row gutter={[0, 12]}>
                                            <Col span={24}>
                                                <BankHeading>
                                                    <LabelIcon><LuBarChart /></LabelIcon>
                                                    Bank of America
                                                </BankHeading>
                                            </Col>
                                            <Col span={10}>
                                                <InfoHeading>Routing</InfoHeading>
                                            </Col>
                                            <Col span={14}>
                                                <BankValue>{agency?.routingNumber}</BankValue>
                                            </Col>
                                            <Col span={10}>
                                                <InfoHeading>Account</InfoHeading>
                                            </Col>
                                            <Col span={14}>
                                                <BankValue>{agency?.accountNumber}</BankValue>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </AgencyProfilePageWrapper>
                </Box>
            </BoxWrapper>
        </BoxContainer>
    );
}
export default AgencyProfile
