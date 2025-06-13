import '@testing-library/jest-dom/extend-expect'; // For additional matchers
import { fireEvent, render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import PasswordField from '.';

// Define a mock theme with necessary color values
const mockTheme = {
    color300: '#e0e0e0', // Example value for border color
    color500: '#a0a0a0', // Example value for suffix color
    color900: '#000000', // Example value for text color
};

describe('PasswordField', () => {
    test('should render PasswordField with default props', () => {
        render(
            <ThemeProvider theme={mockTheme}>
                <PasswordField data-testid="password-field" />
            </ThemeProvider>
        );

        const inputElement = screen.getByTestId('password-field');
        expect(inputElement).toBeInTheDocument();
    });

    test('should toggle visibility icon when iconRender prop is used', () => {
        render(
            <ThemeProvider theme={mockTheme}>
                <PasswordField />
            </ThemeProvider>
        );

        // Check for the presence of the default visibility icon
        expect(screen.getByTestId('icon-eye-off')).toBeInTheDocument();

        // Simulate click to toggle visibility
        fireEvent.click(screen.getByTestId('icon-eye-off'));

        // Check if the eye-off icon appears
        expect(screen.getByTestId('icon-eye')).toBeInTheDocument();
    });

    test('should call onChange handler when value changes', () => {
        const handleChange = jest.fn();
        render(
            <ThemeProvider theme={mockTheme}>
                <PasswordField onChange={handleChange} data-testid="password-field" />
            </ThemeProvider>
        );

        const inputElement = screen.getByTestId('password-field');
        fireEvent.change(inputElement, { target: { value: 'newpassword' } });
        expect(handleChange).toHaveBeenCalled();
    });

    test('should render with different HTML attributes', () => {
        render(
            <ThemeProvider theme={mockTheme}>
                <PasswordField
                    id="test-id"
                    aria-label="Test Password Field"
                    data-testid="password-field"
                />
            </ThemeProvider>
        );

        const inputElement = screen.getByTestId('password-field');
        expect(inputElement).toHaveAttribute('id', 'test-id');
        expect(inputElement).toHaveAttribute('aria-label', 'Test Password Field');
    });
});
