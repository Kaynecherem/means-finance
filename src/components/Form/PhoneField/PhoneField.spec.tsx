import '@testing-library/jest-dom/extend-expect'; // For additional matchers
import { fireEvent, render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import PhoneField from '.';

// Define a mock theme with necessary color values
const mockTheme = {
    color300: '#e0e0e0', // Example value for border color
    color500: '#a0a0a0', // Example value for suffix color
    color900: '#000000', // Example value for text color
};

// Mock data for countryPhoneData
// jest.mock('phone', () => ({
//     ...jest.requireActual('phone'),
//     countryPhoneData: [
//         { alpha2: 'US', alpha3: 'USA', country_code: '1', country_name: 'United States', mobile_begin_with: ['1'], phone_number_lengths: [10] },
//         { alpha2: 'CA', alpha3: 'CAN', country_code: '1', country_name: 'Canada', mobile_begin_with: ['1'], phone_number_lengths: [10] }
//     ],
// }));

describe('PhoneField', () => {
    test('should render PhoneField with default props', () => {
        render(
            <ThemeProvider theme={mockTheme}>
                <PhoneField />
            </ThemeProvider>
        );

        expect(screen.getByTestId('phone-input')).toBeInTheDocument();
        expect(screen.getByTestId('country-select')).toBeInTheDocument();
    });


    test('should update the phone number input and call onChange', () => {
        const handleChange = jest.fn();
        render(
            <ThemeProvider theme={mockTheme}>
                <PhoneField value="1234567890" onChange={handleChange} />
            </ThemeProvider>
        );

        const inputElement = screen.getByTestId('phone-input');
        fireEvent.change(inputElement, { target: { value: '0987654321' } });

        expect(handleChange).toHaveBeenCalledWith('0987654321');

        fireEvent.change(inputElement, { target: { value: '8175698900' } });

        expect(handleChange).toHaveBeenCalledWith('+18175698900');


        fireEvent.change(inputElement, { target: { value: '' } });

        expect(handleChange).toHaveBeenCalledWith('');
    });

    test('should handle the disabled state', () => {
        render(
            <ThemeProvider theme={mockTheme}>
                <PhoneField disabled />
            </ThemeProvider>
        );

        expect(screen.getByTestId('country-select')).toHaveClass("ant-select-disabled");
        expect(screen.getByTestId('phone-input')).toBeDisabled();
    });
    test('should update internal state when value prop changes', () => {
        const { rerender } = render(
            <ThemeProvider theme={mockTheme}>
                <PhoneField value="1234567890" />
            </ThemeProvider>
        );

        // Initial render
        expect(screen.getByTestId('phone-input')).toHaveValue('1234567890');

        // Re-render with a new value
        rerender(
            <ThemeProvider theme={mockTheme}>
                <PhoneField value="+85291234567" />
            </ThemeProvider>
        );

        // After re-render, internal value should update
        expect(screen.getByTestId('phone-input')).toHaveValue('91234567'); // Adjust based on actual formatting logic

        rerender(
            <ThemeProvider theme={mockTheme}>
                <PhoneField value="" />
            </ThemeProvider>
        );

        // After re-render, internal value should update
        expect(screen.getByTestId('phone-input')).toHaveValue(''); // Adjust based on actual formatting logic
    });
});
