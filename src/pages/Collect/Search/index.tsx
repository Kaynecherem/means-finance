import { LoadingOutlined } from "@ant-design/icons"
import { AutoComplete, Col, Form, message, Row, Spin } from "antd"
import { useState } from "react"
import { LuArrowRight, LuPhone, LuUser } from "react-icons/lu"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import Box from "../../../components/Box"
import BoxWrapper from "../../../components/BoxWrapper"
import { useDirectUs } from '../../../components/DirectUs/DirectusContext'
import FormItem from "../../../components/Form/FormItem"
import PhoneField from "../../../components/Form/PhoneField"
import SubmitButton from "../../../components/Form/SubmitButton"
import TextField from '../../../components/Form/TextField'
import { findCustomerByPhone, searchCustomerByName } from "../../../utils/apis/directus"
import { updateCollect } from "../../../utils/redux/slices/collectSlice"
import { InternalErrors } from "../../../utils/types/errors"
import { CustomDirectusUser } from '../../../utils/types/schema'
import phoneValidator from '../../../utils/validators/phoneValidator'
import { PageHeader, PageSubHeader } from "../../style"
import { LoadingDropDownRender, NameSelectionOption, SearchPageWrapper } from './style'

const CustomerSummary = () => {
    const navigate = useNavigate()
    const { directusClient } = useDirectUs();
    const [fetching, setFetching] = useState(false);
    const [isLoading, setIsLoading] = useState(false)
    const [searchOptions, setSearchOptions] = useState<Array<CustomDirectusUser>>([])
    const dispatch = useDispatch()
    const searchByName = async (query: string) => {
        setSearchOptions([])
        if (query.length > 2) {
            try {
                setFetching(true);
                const users = await searchCustomerByName(directusClient, query.trim())
                if (users.length > 0) {
                    setSearchOptions(users)
                }
            } catch (error) {
                message.error((error as InternalErrors).message)
            } finally {
                setFetching(false)
            }
        }
    }
    const selectUser = (user: CustomDirectusUser) => {
        dispatch(updateCollect({ customer: user, selectedPaymentId: null }))
        navigate('/agency/collect/customer-bills')
    }
    const handleNextClick = async ({ phone }: {
        phone?: string
    }) => {
        try {
            setIsLoading(true)
            if (phone) {
                const user = await findCustomerByPhone(directusClient, phone)
                if (user) {
                    selectUser(user)
                } else {
                    message.error("User is not found in the system.")
                }
            } else {
                message.error("Please enter phone number or search by customer's name.")
            }
        } catch (error) {
            message.error((error as InternalErrors).message)
        } finally {
            setIsLoading(false)
        }
    }

    const optionRenderer = (value: { data: CustomDirectusUser }) => <NameSelectionOption onClick={() => selectUser(value.data)}>
        <div className='name'>{value.data.first_name} {value.data.last_name}</div>
        <div className='phone'>{value.data.phone}</div>
    </NameSelectionOption>

    return (
        <BoxWrapper>
            <Box>
                <SearchPageWrapper>
                    <Form requiredMark={false} layout="vertical" onFinish={handleNextClick} >
                        <Row justify={"center"} gutter={[0, 24]}>
                            <Col span={24} style={{ textAlign: "center" }}>
                                <PageHeader>Collect Payment</PageHeader>
                            </Col>
                            <Col span={24} style={{ textAlign: "center" }}>
                                <PageSubHeader>Customer's cell phone number.</PageSubHeader>
                            </Col>
                            <Col xs={24} lg={10} >
                                <Row justify={'center'} gutter={[0, 24]}>
                                    <Col span={24}>
                                        <FormItem
                                            label="Phone Cell"
                                            name="phone"
                                            icon={<LuPhone />}
                                            rules={[
                                                {
                                                    validator: phoneValidator
                                                }
                                            ]}
                                        >
                                            <PhoneField />
                                        </FormItem>
                                    </Col>
                                    <Col span={24} style={{ textAlign: "center" }}>
                                        <PageSubHeader>or</PageSubHeader>
                                    </Col>
                                    <Col span={24}>
                                        <FormItem
                                            label="Name"
                                            name="name"
                                            icon={<LuUser />}
                                        >
                                            <AutoComplete
                                                options={searchOptions as never}
                                                onSearch={searchByName}
                                                notFoundContent={fetching ? <LoadingDropDownRender><Spin indicator={<LoadingOutlined spin />} size="small" /></LoadingDropDownRender> : null}
                                                optionRender={value => optionRenderer(value as never)}
                                            >
                                                <TextField prefix={<LuUser />} />
                                            </AutoComplete>
                                        </FormItem>
                                    </Col>
                                    <Col>
                                        <SubmitButton htmlType="submit" icon={<LuArrowRight />} style={{ marginTop: "16px" }} loading={isLoading}>Find Customer</SubmitButton>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Form>
                </SearchPageWrapper>
            </Box>
        </BoxWrapper>

    )
}

export default CustomerSummary
