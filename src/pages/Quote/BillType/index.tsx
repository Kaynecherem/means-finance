import { Col, RadioChangeEvent, Row } from "antd";
import { useEffect, useState } from "react";
import { LuArrowRight, LuBarChart2, LuDollarSign, LuHome, LuLayers } from 'react-icons/lu';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import BillTypeSelection from "../../../components/BillTypeSelection";
import SubmitButton from "../../../components/Form/SubmitButton";
import { BillTypeEnum } from "../../../utils/enums/common";
import { updateQuote } from "../../../utils/redux/slices/quoteSlice";
import { RootState } from "../../../utils/redux/store";
import { PageHeader } from "../../style";


const BillType: React.FC = () => {
    const [type, setType] = useState<BillTypeEnum>(BillTypeEnum.AUTO_INSURANCE)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const quoteType = useSelector(({ quote }: RootState) => quote.quoteType)
    useEffect(() => {
        if (quoteType) {
            setType(quoteType)
        }
    }, [quoteType])

    const billTypes = [
        {
            key: BillTypeEnum.AUTO_INSURANCE,
            label: 'Auto Insurance',
            icon: <LuLayers />
        },
        {
            key: BillTypeEnum.AUTO_PAYMENT,
            label: 'Auto Payment',
            icon: <LuLayers />
        },
        {
            key: BillTypeEnum.RENT,
            label: 'Rent/ Mortgage',
            icon: <LuHome />
        },
        {
            key: BillTypeEnum.UTILITY_BILL,
            label: 'Utility Bills',
            icon: <LuBarChart2 />
        },
        {
            key: BillTypeEnum.OTHER_BILLS,
            label: 'Other Bill',
            icon: <LuDollarSign />
        },
    ]

    const handleNextClick = () => {
        dispatch(updateQuote({ quoteType: type }))
        navigate('/agency/quote/bill-details')
    }
    return (
        <Row gutter={[0, 32]} justify={"center"}>
            <Col span={24} style={{ textAlign: "center" }}>
                <PageHeader level={2}>What bill is to be paid?</PageHeader>
            </Col>
            <Col span={24}>
                <BillTypeSelection billTypes={billTypes} value={type} onChange={(e: RadioChangeEvent) => {
                    setType(e.target.value)
                }} />
            </Col>
            <Col style={{ marginTop: "32px " }}>
                <SubmitButton htmlType="submit" icon={<LuArrowRight />} disabled={!type} onClick={handleNextClick}>Next</SubmitButton>
            </Col>
        </Row>
    );
}

export default BillType;
