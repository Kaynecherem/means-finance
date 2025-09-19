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
        });
        (useNavigate as jest.Mock).mockReturnValue(navigate);
        navigate.mockClear();
        window.alert = jest.fn();
    });

    it('shows iframe with token and disabled new customer button initially', () => {
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

        expect(screen.getByRole('button', { name: /Continue with new customer/i })).toBeDisabled();
        expect(screen.getByRole('button', { name: /Continue with existing customer/i })).toBeInTheDocument();
    });

    it('enables new customer button on success message and navigates when clicked', async () => {
        render(
            <ThemeProvider theme={mockTheme}>
                <Provider store={store}>
                    <DeluxePayment />
                </Provider>
            </ThemeProvider>
        );

        const newCustomerButton = screen.getByRole('button', { name: /Continue with new customer/i });
        expect(newCustomerButton).toBeDisabled();

        window.dispatchEvent(
            new MessageEvent('message', {
                data: { type: 'Vault', data: { customerId: '123', vaultId: 'abc' } },
                origin: 'null',
            })
        );

        await waitFor(() => {
            expect(newCustomerButton).toBeEnabled();
        });

        fireEvent.click(newCustomerButton);

        expect(navigate).toHaveBeenCalledWith('/agency/quote/customer-info');
    });

    it('navigates to existing customer search when existing path is chosen', () => {
        render(
            <ThemeProvider theme={mockTheme}>
                <Provider store={store}>
                    <DeluxePayment />
                </Provider>
            </ThemeProvider>
        );

        const existingCustomerButton = screen.getByRole('button', { name: /Continue with existing customer/i });
        fireEvent.click(existingCustomerButton);

        expect(navigate).toHaveBeenCalledWith('/agency/quote/existing-customer');
    });
});
