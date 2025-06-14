import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { ThemeProvider } from 'styled-components';
import DeluxePayment from '.';
import { useNavigate } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}));

const mockStore = configureStore([]);

const TOKEN = 'TOKEN123';
// Minimal theme object for styled-components
const mockTheme = {
    color800: '#333333',
    color50: '#f0f0f0',
    color300: '#cccccc',
    systemDefaults: {
        colorError: '#ff4d4f',
        colorErrorBg: '#fff1f0',
        colorPrimary: '#000',
        colorPrimaryBg: '#fff',
    },
};

describe('DeluxePayment Page', () => {
    let store: any;
    const navigate = jest.fn();

    beforeEach(() => {
        store = mockStore({
            auth: {
                agency: { deluxePartnerToken: TOKEN },
            },
        });
        (useNavigate as jest.Mock).mockReturnValue(navigate);
        window.alert = jest.fn();
    });

    it('renders "Add Customer to Deluxe" button', () => {
        render(
            <ThemeProvider theme={mockTheme}>
                <Provider store={store}>
                    <DeluxePayment />
                </Provider>
            </ThemeProvider>
        );

        expect(screen.getByRole('button', { name: /Add Customer to Deluxe/i })).toBeInTheDocument();
    });

    it('shows iframe with token after clicking the button', () => {
        render(
            <ThemeProvider theme={mockTheme}>
                <Provider store={store}>
                    <DeluxePayment />
                </Provider>
            </ThemeProvider>
        );

        fireEvent.click(screen.getByRole('button', { name: /Add Customer to Deluxe/i }));

        const iframe = screen.getByTitle('Deluxe Payment') as HTMLIFrameElement;
        expect(iframe).toBeInTheDocument();
        expect(iframe.getAttribute('srcdoc')).toContain(TOKEN);
    });

    it('navigates on deluxe_success message', async () => {
        render(
            <ThemeProvider theme={mockTheme}>
                <Provider store={store}>
                    <DeluxePayment />
                </Provider>
            </ThemeProvider>
        );

        window.dispatchEvent(new MessageEvent('message', { data: { event: 'deluxe_success', payload: { data: 'x' } }, origin: 'https://hostedpaymentform.deluxe.com' }));

        await waitFor(() => {
            expect(navigate).toHaveBeenCalledWith('/agency/quote/customer-info');
        });
    });
});
