import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import CountBadge from '.';

// Define a mock theme for testing
const mockTheme = {
    colorSuccess50: '#d4edda',
    colorSuccess500: '#28a745',
    colorError50: '#f8d7da',
    colorError500: '#dc3545',
    color200: '#e2e6ea',
    color500: '#6c757d',
};

describe('CountBadge Component', () => {
    it('should render correctly with count', () => {
        render(
            <ThemeProvider theme={mockTheme}>
                <CountBadge count={5} type="default" />
            </ThemeProvider>
        );

        // Check that the badge has the correct count and type
        const badge = screen.getByTestId('count-badge-default');
        expect(badge).toHaveTextContent('5');
    });

    it('should handle primary type correctly', () => {
        render(
            <ThemeProvider theme={mockTheme}>
                <CountBadge count={15} type="primary" />
            </ThemeProvider>
        );

        // Use a different data-testid for primary type
        const badge = screen.getByTestId('count-badge-primary');
        expect(badge).toHaveTextContent('15');
    });

    it('should handle danger type correctly', () => {
        render(
            <ThemeProvider theme={mockTheme}>
                <CountBadge count={20} type="danger" />
            </ThemeProvider>
        );

        // Use a different data-testid for danger type
        const badge = screen.getByTestId('count-badge-danger');
        expect(badge).toHaveTextContent('20');
    });
});
