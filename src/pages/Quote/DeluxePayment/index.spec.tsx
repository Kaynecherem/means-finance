import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { ThemeProvider } from 'styled-components';
import DeluxePayment from '.';
import { useNavigate } from 'react-router-dom';

jest.mock('../../../components/DirectUs/DirectusContext', () => ({
    useDirectUs: () => ({ directusClient: {} }),
}));

jest.mock('../../../utils/apis/directus', () => ({
    getAgencyDeluxePartnerToken: jest.fn(() => Promise.resolve('TOKEN123')),
}));

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
            quote: { isRenewal: false },
        });
        (useNavigate as jest.Mock).mockReturnValue(navigate);
        navigate.mockClear();
        window.alert = jest.fn();
        store.clearActions();
    });

    it('shows iframe with token, skip control, and disabled next button initially', () => {
        render(
            <ThemeProvider theme={mockTheme}>
                <Provider store={store}>
                    <DeluxePayment />
                </Provider>
            </ThemeProvider>
        );

        const iframe = screen.getByTitle('Deluxe Payment') as HTMLIFrameElement;
        expect(iframe).toBeInTheDocument();
        expect(iframe.getAttribute('srcdoc')).toContain(TOKEN);

        expect(screen.getByRole('button', { name: /Skip/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Next/i })).toBeDisabled();
        expect(screen.getByRole('button', { name: /Start Over/i })).toBeInTheDocument();
    });

    it('redirects to customer info when renewing a bill', () => {
        store = mockStore({
            auth: {
                agency: { deluxePartnerToken: TOKEN },
            },
            quote: { isRenewal: true },
        });

        render(
            <ThemeProvider theme={mockTheme}>
                <Provider store={store}>
                    <DeluxePayment />
                </Provider>
            </ThemeProvider>
        );

        expect(navigate).toHaveBeenCalledWith('/agency/quote/customer-info', { replace: true });
    });

    it('enables next button on success message and navigates when clicked', async () => {
        render(
            <ThemeProvider theme={mockTheme}>
                <Provider store={store}>
                    <DeluxePayment />
                </Provider>
            </ThemeProvider>
        );

        const nextButton = screen.getByRole('button', { name: /Next/i });
        expect(nextButton).toBeDisabled();

        window.dispatchEvent(
            new MessageEvent('message', {
                data: { type: 'Vault', data: { customerId: '123', vaultId: 'abc' } },
                origin: 'null',
            })
        );

        await waitFor(() => {
            expect(nextButton).toBeEnabled();
        });

        fireEvent.click(nextButton);

        expect(navigate).toHaveBeenCalledWith('/agency/quote/customer-info');
    });

    it('skips to existing customer search and clears stored deluxe data', () => {
        sessionStorage.setItem('deluxeData', JSON.stringify({ foo: 'bar' }));
        render(
            <ThemeProvider theme={mockTheme}>
                <Provider store={store}>
                    <DeluxePayment />
                </Provider>
            </ThemeProvider>
        );

        const skipButton = screen.getByRole('button', { name: /Skip/i });
        fireEvent.click(skipButton);

        expect(navigate).toHaveBeenCalledWith('/agency/quote/existing-customer');
        expect(sessionStorage.getItem('deluxeData')).toBeNull();
    });

    it('resets quote and navigates to bill type when start over is clicked', () => {
        render(
            <ThemeProvider theme={mockTheme}>
                <Provider store={store}>
                    <DeluxePayment />
                </Provider>
            </ThemeProvider>
        );

        const startOverButton = screen.getByRole('button', { name: /Start Over/i });
        fireEvent.click(startOverButton);

        expect(navigate).toHaveBeenCalledWith('/agency/quote/bill-type');
        const actions = store.getActions();
        expect(actions).toEqual(expect.arrayContaining([expect.objectContaining({ type: 'auth/resetQuote' })]));
    });
});
