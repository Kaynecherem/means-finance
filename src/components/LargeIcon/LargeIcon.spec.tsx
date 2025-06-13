import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import LargeIcon from '.';

// Mock theme for testing
const mockTheme = {
    systemDefaults: {
        colorBgBase: '#fff',
    },
};

describe('LargeIcon Component', () => {
    it('should render children passed to the component', () => {
        render(
            <ThemeProvider theme={mockTheme}>
                <LargeIcon>
                    <span>Test Icon</span>
                </LargeIcon>
            </ThemeProvider>
        );

        // Assert that the child element is rendered
        expect(screen.getByText('Test Icon')).toBeInTheDocument();
    });

    it('should render with the correct styles', () => {
        render(
            <ThemeProvider theme={mockTheme}>
                <LargeIcon>
                    <span>Styled Icon</span>
                </LargeIcon>
            </ThemeProvider>
        );

        const styledIcon = screen.getByTestId('large-icon');
        expect(styledIcon).toBeInTheDocument();
    });
});
