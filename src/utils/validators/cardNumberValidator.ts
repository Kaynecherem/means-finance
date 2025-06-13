// Utility function to determine if the card number is valid (Luhn algorithm + format)
export const isValidCardNumber = (cardNumber: string): boolean => {
    // Remove spaces from card number
    const sanitizedCardNumber = cardNumber.replace(/\s+/g, '');

    // Regex for basic card number length and structure validation
    const cardNumberPattern = /^\d{13,19}$/; // Card numbers are typically between 13 and 19 digits

    if (!cardNumberPattern.test(sanitizedCardNumber)) {
        return false;
    }

    // Luhn algorithm to validate checksum
    let sum = 0;
    let shouldDouble = false;

    for (let i = sanitizedCardNumber.length - 1; i >= 0; i--) {
        let digit = parseInt(sanitizedCardNumber.charAt(i), 10);

        if (shouldDouble) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }

        sum += digit;
        shouldDouble = !shouldDouble;
    }

    return sum % 10 === 0;
};


// Custom Validator function for Form.Item
const cardNumberValidator = (_: unknown, value: string) => {
    if (!value) {
        return Promise.resolve()
    }
    if (!isValidCardNumber(value)) {
        // eslint-disable-next-line no-template-curly-in-string
        return Promise.reject(new Error('${label} is invalid card number'));
    }
    return Promise.resolve();
};

export default cardNumberValidator
