import { fireEvent, render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import SubmitButton from '.';

// Define a mock theme that matches the structure used in styled-components
const mockTheme = {
    color800: '#333333', // Example color
    color50: '#f0f0f0',  // Example color
    color300: '#cccccc', // Example color
    systemDefaults: {
        colorError: '#ff4d4f',
        colorErrorBg: '#fff1f0',
    },
};

describe('SubmitButton', () => {
    test('should render SubmitButton with default props', () => {
        render(
            <ThemeProvider theme={mockTheme}>
                <SubmitButton data-testid="submit-button" />
            </ThemeProvider>
        );

        expect(screen.getByTestId('submit-button')).toBeInTheDocument();
    });

    test('should display icon when icon is passed as prop', () => {
        render(
            <ThemeProvider theme={mockTheme}>
                <SubmitButton data-testid="submit-button" icon={<span data-testid="icon" />} />
            </ThemeProvider>
        );

        expect(screen.getByTestId('icon')).toBeInTheDocument();
    });

    test('should call onClick handler when clicked', () => {
        const handleClick = jest.fn();
        render(
            <ThemeProvider theme={mockTheme}>
                <SubmitButton data-testid="submit-button" onClick={handleClick} />
            </ThemeProvider>
        );

        fireEvent.click(screen.getByTestId('submit-button'));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    test('should have primary type by default', () => {
        render(
            <ThemeProvider theme={mockTheme}>
                <SubmitButton data-testid="submit-button" />
            </ThemeProvider>
        );

        // Verify that the button has the primary type
        expect(screen.getByTestId('submit-button')).toHaveClass('ant-btn-primary');
    });

    test('should apply dangerous type styles when type="danger"', () => {
        render(
            <ThemeProvider theme={mockTheme}>
                <SubmitButton data-testid="submit-button" danger />
            </ThemeProvider>
        );

        // Verify that the button has the dangerous type styles
        expect(screen.getByTestId('submit-button')).toHaveClass('ant-btn-dangerous');
    });
});
