import '@testing-library/jest-dom/extend-expect'; // For additional matchers
import { fireEvent, render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import InlineButton from '.';

// Define a mock theme (if necessary for your ThemeProvider setup)
const mockTheme = {
    color300: '#e0e0e0', // Example value for border color
    color500: '#000000', // Example value for text color
};

describe('InlineButton', () => {
    test('should render InlineButton with default props', () => {
        render(
            <ThemeProvider theme={mockTheme}>
                <InlineButton>Click Me</InlineButton>
            </ThemeProvider>
        );

        const buttonElement = screen.getByText('Click Me');
        expect(buttonElement).toBeInTheDocument();
    });

    test('should call onClick handler when clicked', () => {
        const handleClick = jest.fn();
        render(
            <ThemeProvider theme={mockTheme}>
                <InlineButton onClick={handleClick}>Click Me</InlineButton>
            </ThemeProvider>
        );

        const buttonElement = screen.getByText('Click Me');
        fireEvent.click(buttonElement);
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    test('should render with different HTML attributes', () => {
        render(
            <ThemeProvider theme={mockTheme}>
                <InlineButton id="test-id" aria-label="Test Button" data-testid="test-button">
                    Test Button
                </InlineButton>
            </ThemeProvider>
        );

        const buttonElement = screen.getByTestId('test-button');
        expect(buttonElement).toHaveAttribute('id', 'test-id');
        expect(buttonElement).toHaveAttribute('aria-label', 'Test Button');
    });
});
