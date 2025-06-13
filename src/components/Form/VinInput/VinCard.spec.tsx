import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { ThemeProvider } from 'styled-components';
import VinCard from './VinCard';

// Mock Data
const mockVin = {
    vin: '',
    make: '',
    model: '',
    year: '',
    errorCode: '',
    loading: false,
    id: 1
};

const mockVinLoading = {
    vin: '',
    make: '',
    model: '',
    year: '',
    errorCode: '',
    loading: true,
    id: 1
};

const mockOnVinChange = jest.fn();
const mockOnRemove = jest.fn();

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

describe('VinCard Component', () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    const renderWithTheme = (component: React.ReactNode) => {
        return render(<ThemeProvider theme={mockTheme}>{component}</ThemeProvider>);
    };

    it('should render VinCard with title', () => {
        renderWithTheme(
            <VinCard
                index={0}
                vin={mockVin}
                onVinChange={mockOnVinChange}
                onRemove={mockOnRemove}
                deleteDisabled={false}
            />
        );

        expect(screen.getByText('Vehicle 1')).toBeInTheDocument();
    });

    it('should trigger onVinChange when VIN input is updated', () => {
        renderWithTheme(
            <VinCard
                index={0}
                vin={mockVin}
                onVinChange={mockOnVinChange}
                onRemove={mockOnRemove}
                deleteDisabled={false}
            />
        );

        const input = screen.getByPlaceholderText('Enter VIN number');
        fireEvent.change(input, { target: { value: '1HGCM82633A123456' } });

        expect(mockOnVinChange).toHaveBeenCalledWith(0, { vin: '1HGCM82633A123456' });
    });

    it('should display "Not a valid VIN" error message if errorCode is not 0', () => {
        renderWithTheme(
            <VinCard
                index={0}
                vin={{ ...mockVin, errorCode: '1' }}
                onVinChange={mockOnVinChange}
                onRemove={mockOnRemove}
                deleteDisabled={false}
            />
        );

        expect(screen.getByText('Not a valid VIN')).toBeInTheDocument();
    });

    it('should trigger onRemove when delete button is clicked', () => {
        renderWithTheme(
            <VinCard
                index={0}
                vin={mockVin}
                onVinChange={mockOnVinChange}
                onRemove={mockOnRemove}
                deleteDisabled={false}
            />
        );

        const deleteButton = screen.getByRole('button');
        fireEvent.click(deleteButton);

        expect(mockOnRemove).toHaveBeenCalledWith(0);
    });

    it('should disable the delete button when deleteDisabled is true', () => {
        renderWithTheme(
            <VinCard
                index={0}
                vin={mockVin}
                onVinChange={mockOnVinChange}
                onRemove={mockOnRemove}
                deleteDisabled={true}
            />
        );

        const deleteButton = screen.getByRole('button');
        expect(deleteButton).toBeDisabled();
    });

    it('should show loading skeletons for make, model, and year when loading is true', () => {
        renderWithTheme(
            <VinCard
                index={0}
                vin={mockVinLoading}
                onVinChange={mockOnVinChange}
                onRemove={mockOnRemove}
                deleteDisabled={false}
            />
        );

        expect(screen.getAllByTestId('vin-card-skeleton')).toHaveLength(3);
        expect(screen.queryAllByTestId('vin-card-values')).toHaveLength(0);

    });

    it('should display make, model, and year correctly when loading is false', () => {
        renderWithTheme(
            <VinCard
                index={0}
                vin={{ ...mockVin, make: 'Honda', model: 'Accord', year: '2003', loading: false }}
                onVinChange={mockOnVinChange}
                onRemove={mockOnRemove}
                deleteDisabled={false}
            />
        );

        expect(screen.getAllByTestId('vin-card-values')).toHaveLength(3);
        expect(screen.queryAllByTestId('vin-card-skeleton')).toHaveLength(0);
        expect(screen.getByText('Honda')).toBeInTheDocument();
        expect(screen.getByText('Accord')).toBeInTheDocument();
        expect(screen.getByText('2003')).toBeInTheDocument();

    });
});
