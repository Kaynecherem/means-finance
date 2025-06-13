import { fireEvent, render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import SearchBox from '.';

// Define a mock theme that matches the structure used in styled-components
const mockTheme = {
    color900: '#000000', // Example color
    color500: '#999999', // Example color
    color300: '#cccccc', // Example color
};

describe('SearchBox', () => {
    test('should render SearchBox with default props', () => {
        render(
            <ThemeProvider theme={mockTheme}>
                <SearchBox data-testid="search-input" />
            </ThemeProvider>
        );

        expect(screen.getByTestId('search-input')).toBeInTheDocument();
        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    test('should render SearchBox with custom props', () => {
        render(
            <ThemeProvider theme={mockTheme}>
                <SearchBox placeholder="Search..." data-testid="search-input" />
            </ThemeProvider>
        );

        expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    });

    test('should have an enter button with search icon', () => {
        render(
            <ThemeProvider theme={mockTheme}>
                <SearchBox data-testid="search-input" />
            </ThemeProvider>
        );

        const enterButton = screen.getByRole('button');
        expect(enterButton).toBeInTheDocument();
        expect(enterButton).toHaveClass('ant-input-search-button');
    });

    test('should call onSearch when enter button is clicked', () => {
        const handleSearch = jest.fn();
        render(
            <ThemeProvider theme={mockTheme}>
                <SearchBox onSearch={handleSearch} data-testid="search-input" />
            </ThemeProvider>
        );

        fireEvent.click(screen.getByRole('button'));
        expect(handleSearch).toHaveBeenCalled();
    });

    test('should handle the disabled state', () => {
        render(
            <ThemeProvider theme={mockTheme}>
                <SearchBox disabled data-testid="search-input" />
            </ThemeProvider>
        );

        expect(screen.getByTestId('search-input')).toBeDisabled();
        expect(screen.getByRole('button')).toBeDisabled();
    });
});
