import { ChangeEvent } from "react";
import { StyledCVVInput } from "./style";

interface CVVInputProps {
    value?: string; // CVV value (optional)
    onChange?: (value: string) => void; // Callback for change (optional)
}

const CVVInput: React.FC<CVVInputProps> = ({ value = '', onChange }) => {
    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        let newValue = e.target.value;

        // Allow only digits and limit length to 4 (common CVV length)
        newValue = newValue.replace(/\D/g, '').slice(0, 4);

        if (onChange) {
            onChange(newValue);
        }
    };

    return (
        <StyledCVVInput
            value={value}
            onChange={handleInputChange}
            placeholder="CVV"
            maxLength={4} // Max length is 4
        />
    );
};

export default CVVInput;
