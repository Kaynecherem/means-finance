import { fireEvent, render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import DateSelector from '.';

// Mock for theme
const mockTheme = {
    color700: '#333',
    systemDefaults: {
        colorWhite: '#fff',
        colorPrimary: '#007bff',
    },
};

describe('DateSelector', () => {
    it('should render correctly with default props', () => {
        render(<ThemeProvider theme={mockTheme}>
            <DateSelector />
        </ThemeProvider>);
        for (let i = 1; i <= 31; i++) {
            expect(screen.getByText(i.toString())).toBeInTheDocument(); // Check for text content
        }
    });

    it('should apply selection limit correctly', () => {
        const handleChange = jest.fn();
        render(<ThemeProvider theme={mockTheme}><DateSelector selectionLimit={1} onChange={handleChange} /></ThemeProvider>);
        const checkbox = screen.getByLabelText('1'); // Assuming labels are the numbers
        fireEvent.click(checkbox);
        expect(handleChange).toHaveBeenCalledWith([1]); // Only one checkbox should be selected
    });

    it('should handle dynamic days update', () => {
        // Render with default days (31 days)
        const { rerender } = render(<ThemeProvider theme={mockTheme}><DateSelector days={31} /></ThemeProvider>);

        // Check that all 31 options are rendered
        for (let i = 1; i <= 31; i++) {
            expect(screen.getByText(i.toString())).toBeInTheDocument();
        }

        // Rerender with updated days (15 days)
        rerender(<ThemeProvider theme={mockTheme}><DateSelector days={15} /></ThemeProvider>);

        // Check that only 15 options are rendered
        for (let i = 1; i <= 15; i++) {
            expect(screen.getByText(i.toString())).toBeInTheDocument();
        }

        // Ensure that options beyond 15 are not rendered
        for (let i = 16; i <= 31; i++) {
            expect(screen.queryByText(i.toString())).not.toBeInTheDocument();
        }
    });

    it('should update selected values correctly', () => {
        const handleChange = jest.fn();
        render(<ThemeProvider theme={mockTheme}><DateSelector selectionLimit={3} onChange={handleChange} defaultValue={[1, 2, 3]} /></ThemeProvider>);
        const checkbox4 = screen.getByLabelText('4');
        fireEvent.click(checkbox4);
        expect(handleChange).toHaveBeenCalledWith([2, 3, 4]); // Only the last 3 values should be selected
    });
});
