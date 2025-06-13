import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import LayoutProvider from '.';

// Mocking dependencies
jest.mock('../Header', () => () => <div>Header Mock</div>);
jest.mock('../LoadingSpinner', () => ({
    LoadingSpinner: ({ fullScreen }: { fullScreen: boolean }) => (
        <div>{fullScreen ? 'Loading FullScreen' : 'Loading'}</div>
    ),
}));

const mockTheme = {
    systemDefaults: {
        colorBgBase: '#fff',
    },
};

describe('LayoutProvider Component', () => {
    it('should render the Header component', () => {
        render(
            <ThemeProvider theme={mockTheme}>
                <Router>
                    <LayoutProvider />
                </Router>
            </ThemeProvider>
        );

        // Check if the Header component is rendered
        expect(screen.getByText('Header Mock')).toBeInTheDocument();
    });
});
