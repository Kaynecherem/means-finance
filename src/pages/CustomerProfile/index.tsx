import { Col, Row } from 'antd';
import BoxContainer from '../../components/BoxContainer';
import BoxWrapper from '../../components/BoxWrapper';
import ProfileCard from './ProfileCard';
const CustomerProfile: React.FC = () => {
    return (
        <BoxContainer style={{ alignItems: "flex-start", paddingTop: "40px" }}>
            <BoxWrapper type='xl'>
                <Row gutter={[24, 32]}>
                    <Col span={24}>
                        <ProfileCard />
                    </Col>
                    {/* <Col xs={24} lg={12}>
                        <UserCards />
                    </Col>
                    <Col xs={24} lg={12}>
                        <UserAccounts />
                    </Col> */}
                </Row>
            </BoxWrapper>
        </BoxContainer>
    )
}

export default CustomerProfile
