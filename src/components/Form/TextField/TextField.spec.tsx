import { fireEvent, render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import TextField from '.';


// Define a mock theme that matches the structure used in styled-components
const mockTheme = {
    color900: '#333333',
    color300: '#cccccc',
};

describe('TextField', () => {
    test('should render TextField with default props', () => {
        render(
            <ThemeProvider theme={mockTheme}>
                <TextField data-testid="text-field" placeholder="Enter text" />
            </ThemeProvider>
        );

        expect(screen.getByTestId('text-field')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
    });

    test('should render loading spinner when loading is true', () => {
        render(
            <ThemeProvider theme={mockTheme}>
                <TextField data-testid="text-field" loading placeholder="Enter text" />
            </ThemeProvider>
        );

        const spinner = screen.getByTestId('textfield-spin');
        expect(spinner).toBeInTheDocument();
    });

    test('should handle input changes', () => {
        render(
            <ThemeProvider theme={mockTheme}>
                <TextField data-testid="text-field" placeholder="Enter text" />
            </ThemeProvider>
        );

        const input = screen.getByPlaceholderText('Enter text');
        fireEvent.change(input, { target: { value: 'New Value' } });
        expect(input).toHaveValue('New Value');
    });
});
