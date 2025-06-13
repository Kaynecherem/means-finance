import { Col, Row } from "antd";
import { useState } from "react";
import { LuDollarSign } from "react-icons/lu";
import CustomButton1 from "../../components/Form/CustomButton1";
import FormIcon from "../../components/Form/FormIcon";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import MiniCard from "../../components/MiniCard";
import getCustomerInstallmentLabel from "../../utils/helpers/getCustomerInstallmentLabel";
import { DirectusBill } from '../../utils/types/schema';
import { GetPaidCardFooter, GetPaidHeader, GetPaidWrapper } from './style';
import UpdateGetPaidModal from "./UpdategetPaidModal";

const GetPaidCard: React.FC<{
    bill?: DirectusBill | null
    loading?: boolean
    onUpdate?: () => void
}> = ({ bill, loading, onUpdate }) => {
    const [showUpdate, setShowUpdate] = useState(false)
    const handleOnUpdate = () => {
        setShowUpdate(false)
        if (onUpdate) {
            onUpdate()
        }
    }
    return <MiniCard>
        <GetPaidWrapper>
            {loading &&
                <LoadingSpinner style={{ minHeight: "unset", width: "100%", height: "100%" }} fullScreen />
            }
            {!loading &&
                <>
                    <Row gutter={[16, 0]} align={'middle'}>
                        <Col span={4}>
                            <FormIcon icon={<LuDollarSign />} />
                        </Col>
                        <Col span={20}>
                            <Row>
                                <Col span={24}>
                                    <GetPaidHeader>
                                        You will get paid every
                                    </GetPaidHeader>
                                </Col>
                                <Col span={24}>
                                    <GetPaidHeader>
                                        {
                                            bill ? getCustomerInstallmentLabel(bill) : ""
                                        }
                                    </GetPaidHeader>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <GetPaidCardFooter>
                        <CustomButton1 onClick={() => setShowUpdate(true)}>CHANGE</CustomButton1>
                    </GetPaidCardFooter>
                </>
            }
            <UpdateGetPaidModal open={showUpdate} bill={bill} onClose={() => setShowUpdate(false)} onUpdate={handleOnUpdate} />
        </GetPaidWrapper>
    </MiniCard>

}

export default GetPaidCard
