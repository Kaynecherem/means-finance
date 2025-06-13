import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import SelectField from '.';

// Define a mock theme that matches the structure used in styled-components
const mockTheme = {
    color900: '#000000', // Example color
};

describe('SelectField', () => {
    test('should render SelectField with default props', () => {
        render(
            <ThemeProvider theme={mockTheme}>
                <SelectField data-testid="select-field" />
            </ThemeProvider>
        );

        expect(screen.getByTestId('select-field')).toBeInTheDocument();
    });

    test('should display placeholder text when provided', () => {
        render(
            <ThemeProvider theme={mockTheme}>
                <SelectField placeholder="Select an option" data-testid="select-field" />
            </ThemeProvider>
        );

        expect(screen.getByText('Select an option')).toBeInTheDocument();
    });

    test('should handle the disabled state', () => {
        render(
            <ThemeProvider theme={mockTheme}>
                <SelectField disabled data-testid="select-field" />
            </ThemeProvider>
        );

        expect(screen.getByTestId('select-field')).toHaveClass("ant-select-disabled");
    });
});
