import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { ThemeProvider } from 'styled-components';
import vinParser from '../../../utils/parsers/vinParsers';
import VinInput from './VinInput';

// Mock `vinParser` function
jest.mock('../../../utils/parsers/vinParsers', () => ({
    __esModule: true,
    default: jest.fn()
}));
let vinParserMock = jest.mocked(vinParser)

// Mock Theme
const mockTheme = {
    color700: '#4A5568',
    colorFillCustom: '#E6FFFA',
    systemDefaults: {
        colorError: '#E53E3E',
        colorPrimary: '#3182CE',
        colorBgContainer: '#FFFFFF',
    },
    color300: '#CBD5E0',
};

// Helper function to render the component with the mock theme
const renderWithTheme = (component: React.ReactNode) => {
    return render(<ThemeProvider theme={mockTheme}>{component}</ThemeProvider>);
};


describe('VinInput Component', () => {
    it('should render with one VinCard by default', () => {
        renderWithTheme(<VinInput />);
        expect(screen.getByText('Vehicle 1')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Enter VIN number')).toHaveValue('');
    });
    it('should initialize vinCards with a default empty vin object when an empty value array is provided', () => {
        renderWithTheme(<VinInput value={[]} />);
        expect(screen.getByText('Vehicle 1')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Enter VIN number')).toHaveValue('');
    });

    it('should add a new VinCard when clicking "Add Vehicle" button', () => {
        renderWithTheme(<VinInput />);

        const addButton = screen.getByText('Add Vehicle');
        fireEvent.click(addButton);

        expect(screen.getByText('Vehicle 2')).toBeInTheDocument();
    });

    it('should remove a VinCard when clicking the delete button', () => {
        renderWithTheme(<VinInput />);

        const addButton = screen.getByText('Add Vehicle');
        fireEvent.click(addButton); // Add the second card

        // Get the delete button for the first card and click it
        const deleteButton = screen.getAllByRole('button')[0];
        fireEvent.click(deleteButton);

        expect(screen.queryByText('Vehicle 2')).not.toBeInTheDocument();
        expect(screen.getByText('Vehicle 1')).toBeInTheDocument();
    });

    it('should call onChange when the VIN value is changed', async () => {
        const mockOnChange = jest.fn();
        renderWithTheme(<VinInput onChange={mockOnChange} />);

        const addButton = screen.getByText('Add Vehicle');
        fireEvent.click(addButton);

        await waitFor(() => {
            expect(mockOnChange).toHaveBeenCalledWith(expect.arrayContaining([
                {
                    vin: ""
                }
            ]));
        });
    });

    it('should not add more than 5 VinCards', () => {
        renderWithTheme(<VinInput />);

        const addButton = screen.getByText('Add Vehicle');

        for (let i = 0; i < 5; i++) {
            fireEvent.click(addButton);
        }

        expect(screen.getByText('Vehicle 5')).toBeInTheDocument();
        fireEvent.click(addButton);
        expect(screen.queryByText('Vehicle 6')).not.toBeInTheDocument(); // Should not allow more than 5
    });

    it('should display an error message if VIN is invalid', async () => {
        renderWithTheme(<VinInput />);

        const vinInput = screen.getByPlaceholderText('Enter VIN number');
        fireEvent.change(vinInput, { target: { value: 'INVALIDVIN' } });

        await waitFor(() => {
            expect(screen.getByText('Not a valid VIN')).toBeInTheDocument();
        });
    });

    it('should show the VIN details when a valid VIN is entered', async () => {
        vinParserMock.mockResolvedValueOnce({ errorCode: '0', make: 'Honda', model: 'Civic', year: '2020' })
        renderWithTheme(<VinInput />);

        const vinInput = screen.getByPlaceholderText('Enter VIN number');
        fireEvent.change(vinInput, { target: { value: '1HGCM82633A123456' } });
        // await waitFor(() => {
        //     expect(screen.getByText('Honda')).toBeInTheDocument();
        // })
        await Promise.all([
            waitFor(() => {
                expect(screen.getByText('Honda')).toBeInTheDocument();
            }),
            waitFor(() => {
                expect(screen.getByText('Civic')).toBeInTheDocument();
            }),
            waitFor(() => {
                expect(screen.getByText('2020')).toBeInTheDocument();
            })
        ])
    });
    it('should show the VIN details when a invalid VIN is entered', async () => {
        vinParserMock.mockResolvedValueOnce({ errorCode: '1', make: 'Honda', model: 'Civic', year: '2020' })
        renderWithTheme(<VinInput />);

        const vinInput = screen.getByPlaceholderText('Enter VIN number');
        fireEvent.change(vinInput, { target: { value: '1HGCM82633A123457' } });
        await waitFor(() => {
            expect(screen.getByTestId('vin-card-error-text')).toBeInTheDocument();
        })
    });
});
