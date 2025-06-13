import { LoadingOutlined } from "@ant-design/icons";
import { Button, Col, message, Row, Spin } from "antd";
import { ColumnsType } from "antd/es/table";
import { useCallback, useEffect, useState } from "react";
import { LuArrowLeft, LuPenSquare } from 'react-icons/lu';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Box from "../../../components/Box";
import BoxWrapper from "../../../components/BoxWrapper";
import CustomizedTable from "../../../components/CustomisedTable";
import { useDirectUs } from '../../../components/DirectUs/DirectusContext';
import InlineButton from "../../../components/Form/InlineButton";
import { getAgencyDueBillsByCustomer } from "../../../utils/apis/directus";
import billTypeMapper from "../../../utils/helpers/billTypeMapper";
import { updateCollect } from "../../../utils/redux/slices/collectSlice";
import { RootState } from "../../../utils/redux/store";
import { InternalErrors } from "../../../utils/types/errors";
import { DirectusBill } from "../../../utils/types/schema";
import { PageBackButton, PageSubHeader } from '../../style';
import { CustomerName } from "../style";
import { CustomerBillsLoadingWrapper, CustomerBillsWrapper } from "./style";

const CustomerBills = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [bills, setBills] = useState<Array<DirectusBill>>([])
    const { directusClient } = useDirectUs();
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const customer = useSelector(({ collect }: RootState) => collect.customer)
    const agencyId = useSelector((state: RootState) => state.auth.agency?.id)

    const selectPolicy = useCallback((bill: DirectusBill) => {
        dispatch(updateCollect({
            bill
        }))
        navigate('/agency/collect/customer-summary')
    }, [dispatch, navigate])

    const fetchPolicies = useCallback(async () => {
        if (agencyId) {
            try {
                setIsLoading(true)
                if (customer) {
                    const agencyBills = await getAgencyDueBillsByCustomer(directusClient, agencyId, customer.id)
                    if (agencyBills.length === 0) {
                        message.error("No due policies found for the customer")
                        navigate('/agency/collect/search')
                    } else if (agencyBills.length === 1) {
                        selectPolicy(agencyBills[0])
                    } else {
                        setBills(agencyBills)
                    }
                } else {
                    navigate('/agency/collect/search')
                }
            } catch (error) {
                message.error((error as InternalErrors).message)
            } finally {
                setIsLoading(false)
            }
        }
    }, [agencyId, customer, directusClient, navigate, selectPolicy])

    useEffect(() => {
        fetchPolicies()
    }, [fetchPolicies])

    const columns: ColumnsType<DirectusBill> = [
        {
            title: 'Type',
            key: 'Type',
            dataIndex: 'bill_type',
            render: (value: string) => billTypeMapper(value)
        },
        {
            title: 'Policy Id',
            key: 'Policy Id',
            dataIndex: 'policy_id'
        },
        {
            title: 'Amount',
            key: 'Amount',
            dataIndex: 'bill_amount',
            render: amount => `$${Number(amount ?? 0).toFixed(2)}`,
        },
        {
            title: "Actions",
            key: 'Actions',
            dataIndex: "id",
            align: 'right',
            render: (_, record) => <InlineButton type="primary" onClick={() => selectPolicy(record)}>Collect</InlineButton>

        },

    ]

    return (
        <BoxWrapper>
            <Box>
                {
                    isLoading &&
                    <CustomerBillsLoadingWrapper>
                        <Row gutter={[0, 24]} justify={"center"}>
                            <Col span={24}>
                                <PageSubHeader>
                                    Fetching Policies
                                </PageSubHeader>
                            </Col>
                            <Col>
                                <Spin indicator={<LoadingOutlined spin />} size="large" />
                            </Col>
                        </Row>
                    </CustomerBillsLoadingWrapper>
                }
                {!isLoading &&
                    <CustomerBillsWrapper>
                        <PageBackButton
                            onClick={() => navigate(`/agency/collect/search`)}
                        >
                            <LuArrowLeft />
                        </PageBackButton>
                        <Row gutter={[0, 36]}>
                            <Col span={24}>
                                <CustomerName>
                                    {customer?.first_name} {customer?.last_name}
                                    <Button type='link'><LuPenSquare /></Button>
                                </CustomerName>
                            </Col>
                            <Col span={24}>
                                <CustomizedTable
                                    dataSource={bills}
                                    pagination={false}
                                    columns={columns}
                                />
                            </Col>
                        </Row>
                    </CustomerBillsWrapper>
                }
            </Box>
        </BoxWrapper>

    )
}

export default CustomerBills
