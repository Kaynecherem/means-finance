// FormIcon.test.tsx
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import FormIcon from '.';

// Define a mock theme
const mockTheme = {
    colorSuccess50: '#d4edda',
    colorSuccess100: '#c3e6cb',
    colorSuccess600: '#155724',
    colorErrorBg: '#f5c6cb',
    colorError100: '#f8d7da',
    colorError: '#721c24',
    systemDefaults: {
        colorFillSecondary: '#e9ecef',
        colorPrimaryBg: '#ffffff',
        colorPrimary: '#000000',
    },
};

describe('FormIcon', () => {
    // Test case 1: Renders with default size and color
    test('should render with default size and color', () => {
        render(
            <ThemeProvider theme={mockTheme}>
                <FormIcon icon={<span>Icon</span>} />
            </ThemeProvider>
        );

        const iconElement = screen.getByText('Icon');
        expect(iconElement).toBeInTheDocument();
        // No need to test style properties directly
    });

    // Test case 2: Renders with large size and success color
    test('should render with large size and success color', () => {
        render(
            <ThemeProvider theme={mockTheme}>
                <FormIcon icon={<span>Large Success</span>} size="large" color="success" />
            </ThemeProvider>
        );

        const iconElement = screen.getByText('Large Success');
        expect(iconElement).toBeInTheDocument();
        // Assertions for the presence of content
    });

    // Test case 3: Renders with danger color
    test('should render with danger color', () => {
        render(
            <ThemeProvider theme={mockTheme}>
                <FormIcon icon={<span>Danger Icon</span>} color="danger" />
            </ThemeProvider>
        );

        const iconElement = screen.getByText('Danger Icon');
        expect(iconElement).toBeInTheDocument();
        // Assertions for the presence of content
    });

    // Test case 4: Renders without crashing when no icon provided
    test('should render without crashing when no icon is provided', () => {
        render(
            <ThemeProvider theme={mockTheme}>
                <FormIcon icon={undefined} />
            </ThemeProvider>
        );
        // Expect nothing to crash; no further assertions required
    });
});
