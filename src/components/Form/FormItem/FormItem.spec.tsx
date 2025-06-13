// FormItem.test.tsx
import '@testing-library/jest-dom/extend-expect'; // For additional matchers
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import FormItem from '.';

// Define a mock theme
const mockTheme = {
    color700: '#333333', // Used for the label color
};

// Mock Ant Design Form components
jest.mock('antd', () => ({
    Form: {
        Item: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    },
}));

// Mock FormIcon component
jest.mock('../FormIcon', () => ({
    __esModule: true,
    default: ({ icon }: { icon: React.ReactNode }) => <div>{icon}</div>,
}));

describe('FormItem', () => {
    test('should render FormItem without icon', () => {
        render(
            <ThemeProvider theme={mockTheme}>
                <FormItem label="Username" name="username">
                    <input />
                </FormItem>
            </ThemeProvider>
        );

        const inputElement = screen.getByRole('textbox');
        expect(inputElement).toBeInTheDocument();
    });

    test('should render FormItem with icon', () => {
        render(
            <ThemeProvider theme={mockTheme}>
                <FormItem label="Password" name="password" icon={<span>🔒</span>}>
                    <input />
                </FormItem>
            </ThemeProvider>
        );

        const iconElement = screen.getByText('🔒');
        expect(iconElement).toBeInTheDocument();

        const inputElement = screen.getByRole('textbox');
        expect(inputElement).toBeInTheDocument();
    });

    test('should hide label if hideLabel prop is true', () => {
        render(
            <ThemeProvider theme={mockTheme}>
                <FormItem label="Hidden Label" name="hiddenLabel" hideLabel>
                    <input />
                </FormItem>
            </ThemeProvider>
        );

        const labelElement = screen.queryByText('Hidden Label');
        expect(labelElement).not.toBeInTheDocument();

        const inputElement = screen.getByRole('textbox');
        expect(inputElement).toBeInTheDocument();
    });
});
