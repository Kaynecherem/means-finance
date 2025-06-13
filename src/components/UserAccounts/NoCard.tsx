import { Col, Row } from "antd"
import { LuCreditCard } from "react-icons/lu"
import { CardWrapper, NoCardIcon, NoCardText } from "../UserCards/style"

const NoAccounts = () => {
    return <CardWrapper>
        <Row style={{ width: "100%" }}>
            <Col span={24}>
                <NoCardIcon>
                    <LuCreditCard />
                </NoCardIcon>
            </Col>
            <Col span={24}>
                <NoCardText>
                    No Linked Accounts
                </NoCardText>
            </Col>
        </Row>
    </CardWrapper>
}

export default NoAccounts
