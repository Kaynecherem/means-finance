// LoadingSpinner.test.tsx
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { LoadingSpinner } from '.';

// Mock theme for testing
const mockTheme = {
    systemDefaults: {
        colorBgBase: '#fff',
    },
};

describe('LoadingSpinner Component', () => {
    it('should render the loading spinner icon', () => {
        render(
            <ThemeProvider theme={mockTheme}>
                <LoadingSpinner />
            </ThemeProvider>
        );

        // Assert that the loading spinner is rendered
        expect(screen.getByTestId("loading-spinner-icon")).toBeInTheDocument();
    });

    it('should apply fullScreen styles when fullScreen prop is true', () => {
        render(
            <ThemeProvider theme={mockTheme}>
                <LoadingSpinner fullScreen />
            </ThemeProvider>
        );

        const spinnerWrapper = screen.getByTestId('loading-spinner');

        // Assert that fullScreen styles are applied
        expect(spinnerWrapper).toHaveStyle(`
      width: 100vw;
      height: 100vh;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
    `);
    });

    it('should apply default styles when fullScreen prop is not provided', () => {
        render(
            <ThemeProvider theme={mockTheme}>
                <LoadingSpinner />
            </ThemeProvider>
        );

        const spinnerWrapper = screen.getByTestId('loading-spinner');

        // Assert that default (non-fullScreen) styles are applied
        expect(spinnerWrapper).toHaveStyle(`
      width: 100%;
      height: 100%;
      position: unset;
      top: unset;
      left: unset;
      z-index: unset;
    `);
    });
});
