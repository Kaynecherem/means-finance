import { useEffect, useState } from "react";
import CardIcon from "./CardIcon";
import getCardType from "./getCardType";
import { StyledCardNumberInput } from "./style";

// CardNumberInput props interface
interface CardNumberInputProps {
    value?: string;
    onChange?: (value: string) => void;
}

const CardNumberInput: React.FC<CardNumberInputProps> = ({ value, onChange }) => {
    const [cardType, setCardType] = useState('');

    useEffect(() => {
        if (value !== undefined) {
            setCardType(getCardType(value));
        }
    }, [value]);

    const handleInputChange = (inputValue: number | string | null) => {
        const newValue = inputValue?.toString()?.replace(/\s+/g, '') ?? ''; // Remove spaces
        if (onChange) {
            onChange(newValue); // Pass updated value to parent
        }
    };

    return (
        <StyledCardNumberInput
            value={value}
            onChange={handleInputChange}
            placeholder="Enter card number"
            prefix={<CardIcon cardType={cardType} />}
            changeOnWheel={false} controls={false}
        />
    );
};

export default CardNumberInput;
