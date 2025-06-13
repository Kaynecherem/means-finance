import '@testing-library/jest-dom/extend-expect'; // For additional matchers
import { fireEvent, render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import NumberField from '.';

// Define a mock theme with necessary color values
const mockTheme = {
    color300: '#e0e0e0', // Example value for border color
    color900: '#000000', // Example value for text color
};

describe('NumberField', () => {
    test('should render NumberField with default props', () => {
        render(
            <ThemeProvider theme={mockTheme}>
                <NumberField />
            </ThemeProvider>
        );

        const inputElement = screen.getByRole('spinbutton'); // 'spinbutton' role is used for InputNumber
        expect(inputElement).toBeInTheDocument();
    });

    test('should call onChange handler when value changes', () => {
        const handleChange = jest.fn();
        render(
            <ThemeProvider theme={mockTheme}>
                <NumberField onChange={handleChange} />
            </ThemeProvider>
        );

        const inputElement = screen.getByRole('spinbutton');
        fireEvent.change(inputElement, { target: { value: '99' } });
        expect(handleChange).toHaveBeenCalled();
    });

    test('should render with different HTML attributes', () => {
        render(
            <ThemeProvider theme={mockTheme}>
                <NumberField id="test-id" aria-label="Test Number Field" data-testid="test-number-field" />
            </ThemeProvider>
        );

        const inputElement = screen.getByTestId('test-number-field');
        expect(inputElement).toHaveAttribute('id', 'test-id');
        expect(inputElement).toHaveAttribute('aria-label', 'Test Number Field');
    });

});
