import { useEffect, useState } from "react";
import { StyledExpiryDateInput } from "./style";

interface ExpiryDateInputProps {
    value?: { month: string; year: string }; // Object containing month and year
    onChange?: (value: { month: string; year: string }) => void;
}

const ExpiryDateInput: React.FC<ExpiryDateInputProps> = ({ value, onChange }) => {
    const [expiry, setExpiry] = useState(value ? `${value.month}/${value.year.slice(2)}` : "");
    useEffect(() => {
        if (value) {
            // Update the input when the parent component value changes
            setExpiry(`${value.month}/${value.year.slice(2)}`);
        }
    }, [value]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let newValue = e.target.value;

        // Allow only numbers and forward slash, limit input length to 5 (MM/YY)
        newValue = newValue.replace(/[^0-9/]/g, ''); // Remove any non-numeric characters except "/"

        // Ensure the slash is in the correct position (after the first 2 digits)
        if (newValue.length === 2 && !newValue.includes('/')) {
            newValue = `${newValue}/`;
        }

        setExpiry(newValue);

        const [month, year] = newValue.split('/');

        if (onChange && month && year && year.length === 2) {
            // Pass the full year to the parent on change
            onChange({ month, year: `20${year}` });
        }
    };

    return (
        <StyledExpiryDateInput
            value={expiry}
            onChange={handleInputChange}
            placeholder="MM/YY"
            maxLength={5}
        />
    );
};

export default ExpiryDateInput;
