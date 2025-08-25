// AgencyProfile.test.tsx
import { render, screen } from '@testing-library/react';
import { Skeleton } from 'antd';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { ThemeProvider } from 'styled-components';
import AgencyProfile from '.';
import { useDirectUs } from '../../components/DirectUs/DirectusContext';
import { getTodaysPaymentByAgency } from '../../utils/apis/directus';

// Mock the Directus context and API call
jest.mock('@directus/sdk', () => ({
    createDirectus: () => ({
        with: () => ({
            with: () => ({
                refresh: jest.fn(),
                getToken: jest.fn().mockReturnValue('token'),
                request: jest.fn(),
                login: jest.fn(),
                logout: jest.fn(),
            }),
        }),
    }),
    authentication: () => ({}),
    rest: () => ({}),
}))
jest.mock('../../components/DirectUs/DirectusContext');
jest.mock('../../utils/apis/directus', () => ({
    getTodaysPaymentByAgency: jest.fn(),
}));

jest.mock('antd', () => ({
    ...jest.requireActual('antd'),
    Skeleton: {
        Node: jest.fn(() => <div data-testid="skeleton-node">Loading...</div>),
    },
}));

// Mock the theme
const mockTheme = {
    color900: '#000000',
    color500: '#555555',
    color200: '#dddddd',
    colorError500: '#ff0000',
    color700: '#333333',
    systemDefaults: {
        colorPrimary: '#007bff',
        colorPrimaryBg: '#e9ecef',
    },
};

const mockStore = configureStore([]);

describe('AgencyProfile Component', () => {
    let store: any;
    const mockAgency = {
        id: '123',
        agencyName: 'Test Agency',
        addressOne: '123 Main St',
        addressTwo: 'Suite 100',
        city: 'Some City',
        country: 'Some Country',
        postalCode: '12345',
        agencyPhoneNumber: '+1234567890',
        routingNumber: '111000025',
        accountNumber: '123456789',
    };

    beforeEach(() => {
        store = mockStore({
            auth: {
                agency: mockAgency,
            },
        });

        // Mock the Directus context and today's payment API call
        (useDirectUs as jest.Mock).mockReturnValue({
            directusClient: {},
        });

        (getTodaysPaymentByAgency as jest.Mock).mockResolvedValue(500); // Mock total collected today
    });

    it('should render loading state initially', () => {
        Skeleton.Node = jest.fn(() => <div data-testid="skeleton-node">Loading...</div>)
        render(
            <Provider store={store}>
                <ThemeProvider theme={mockTheme}>
                    <AgencyProfile />
                </ThemeProvider>
            </Provider>
        );

        // Assert that the loading skeleton is displayed
        expect(screen.getByTestId('skeleton-node')).toBeInTheDocument();
    });

    it('should render agency details and collected amount after loading', async () => {
        render(
            <Provider store={store}>
                <ThemeProvider theme={mockTheme}>
                    <AgencyProfile />
                </ThemeProvider>
            </Provider>
        );

        // Wait for the loading to complete and the skeleton to disappear
        await screen.findByText('Money collected today');

        // Check that today's total payment and agency details are rendered
        expect(screen.getByText('Money collected today')).toBeInTheDocument();
        expect(screen.getByText('500.00')).toBeInTheDocument();
        expect(screen.getByText('Test Agency')).toBeInTheDocument();

        // Check that location and bank details are displayed
        expect(screen.getByText('123 Main St Suite 100 Some City Some Country 12345')).toBeInTheDocument();
        expect(screen.getByText('+1234567890')).toBeInTheDocument();
        expect(screen.getByText('111000025')).toBeInTheDocument();
        expect(screen.getByText('123456789')).toBeInTheDocument();
    });

    it('should handle API error and display error message', async () => {
        (getTodaysPaymentByAgency as jest.Mock).mockRejectedValueOnce(new Error('Failed to fetch'));

        render(
            <Provider store={store}>
                <ThemeProvider theme={mockTheme}>
                    <AgencyProfile />
                </ThemeProvider>
            </Provider>
        );

        await screen.findByText('Money collected today'); // Wait for error to be handled

        // Ensure the default amount is rendered after error
        expect(screen.getByText('0.00')).toBeInTheDocument(); // Default fallback
    });
    it('should handle absence of agency gracefully', () => {
        const getTodaysPaymentByAgencySpy = jest.spyOn(require('../../utils/apis/directus'), 'getTodaysPaymentByAgency');

        render(
            <Provider store={mockStore({
                auth: {
                    agency: null,
                },
            })}>
                <ThemeProvider theme={mockTheme}>
                    <AgencyProfile />
                </ThemeProvider>
            </Provider>
        );

        // Assert that no agency-specific details are rendered
        expect(screen.queryByText('Test Agency')).not.toBeInTheDocument();
        expect(screen.queryByText('123 Main St Suite 100 Some City Some Country 12345')).not.toBeInTheDocument();
        expect(screen.queryByText('+1234567890')).not.toBeInTheDocument();
        expect(screen.queryByText('111000025')).not.toBeInTheDocument();
        expect(screen.queryByText('123456789')).not.toBeInTheDocument();

        // Assert that getTodaysPaymentByAgency is not called
        expect(getTodaysPaymentByAgencySpy).not.toHaveBeenCalled();
    });
});
