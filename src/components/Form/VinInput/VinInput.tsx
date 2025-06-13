import { Col, Row } from "antd";
import lodash from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import { LuPlus } from "react-icons/lu";
import { vinRegEx } from "../../../utils/contants/regex";
import vinParser from "../../../utils/parsers/vinParsers";
import { VIN } from "../../../utils/types/common";
import InlineButton from "../InlineButton";
import VinCard from "./VinCard";

interface VinInputProps {
    value?: VIN[];
    onChange?: (vins: VIN[]) => void;
}
export type VINLoading = {
    loading?: boolean;
    id: number;
}
const VinInput: React.FC<VinInputProps> = ({ value, onChange }) => {
    const [vinCards, setVinCards] = useState<Array<VIN & VINLoading>>(
        value && value.length > 0 ? value.map(vin => ({ ...vin, id: (new Date()).valueOf() })) : [{ vin: '', id: (new Date()).valueOf() }]
    );

    const handleAddCard = () => {
        if (vinCards.length < 5) {
            setVinCards([...vinCards, { vin: '', id: (new Date()).valueOf() }]);
        }
    };

    const handleVinChange = useCallback(async (index: number, vin: VIN) => {
        const newVinCards = lodash.cloneDeep(vinCards);
        newVinCards[index] = { ...vin, id: vinCards[index].id };

        if (vin.vin) {
            if ((new RegExp(vinRegEx)).test(vin.vin)) {
                setVinCards(prevData => {
                    const tempData = [...prevData]
                    tempData[index] = { ...tempData[index], vin: vin.vin, loading: true }
                    return tempData
                });
                const data = await vinParser(vin.vin);

                if (data.errorCode === '0') {
                    newVinCards[index] = { ...newVinCards[index], ...data, loading: false };
                } else {
                    newVinCards[index] = { vin: vin.vin, errorCode: data.errorCode, loading: false, id: vinCards[index].id };
                }
            } else {
                newVinCards[index] = { errorCode: '1', vin: vin.vin, id: vinCards[index].id };
            }
        }
        setVinCards(newVinCards);
    }, [vinCards]);

    const handleRemoveCard = (index: number) => {
        if (vinCards.length > 1) {
            const vins = lodash.cloneDeep(vinCards)
            const newVinCards = vins.filter((_, i) => i !== index);
            setVinCards(newVinCards);
        }
    };

    useEffect(() => {
        if (onChange) {
            onChange(vinCards)
        }
    }, [onChange, vinCards])

    return (
        <Row gutter={[0, 20]}>
            {
                vinCards.map((vin, index) => (
                    <Col span={24} key={vin.id}>
                        <VinCard
                            index={index}
                            vin={vin}
                            onVinChange={handleVinChange}
                            onRemove={handleRemoveCard}
                            deleteDisabled={vinCards.length === 1}
                        />
                    </Col>
                ))
            }
            <Col span={24} style={{ textAlign: 'center' }}>
                <InlineButton onClick={handleAddCard} htmlType="button" icon={<LuPlus />}>Add Vehicle</InlineButton>
            </Col>
        </Row>
    )
};
export default VinInput
