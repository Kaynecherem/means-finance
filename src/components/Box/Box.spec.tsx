import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import Box from '.';

// Mock theme for testing
const mockTheme = {
    systemDefaults: {
        colorBgBase: '#f0f0f0',
    },
};

describe('Box Component', () => {
    it('should render correctly with children', () => {
        render(
            <ThemeProvider theme={mockTheme}>
                <Box>
                    <span>Test content</span>
                </Box>
            </ThemeProvider>
        );

        // Verify the content is rendered correctly
        expect(screen.getByText('Test content')).toBeInTheDocument();
    });

    it('should render an empty Box without children', () => {
        render(
            <ThemeProvider theme={mockTheme}>
                <Box />
            </ThemeProvider>
        );

        // Verify the Box is rendered without children
        expect(screen.getByTestId('box')).toBeInTheDocument();
    });
});
