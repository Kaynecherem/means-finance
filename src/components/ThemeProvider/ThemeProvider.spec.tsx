// CustomThemeProvider.test.tsx
import { render, screen } from '@testing-library/react';
import { theme } from 'antd';
import CustomThemeProvider from '.';

// Mocking the useToken hook from Ant Design's theme module
jest.mock('antd', () => ({
    theme: {
        useToken: jest.fn(),
    },
}));

describe('CustomThemeProvider Component', () => {
    beforeEach(() => {
        // Mocking the useToken to return a valid token object before each test
        (theme.useToken as jest.Mock).mockReturnValue({
            token: {
                colorPrimary: '#1890ff',
                colorBgBase: '#f0f2f5',
            },
        });
    });

    it('should wrap children with the correct theme values', () => {
        const mockChildText = 'Theme Provider Child';

        render(
            <CustomThemeProvider>
                <div>{mockChildText}</div>
            </CustomThemeProvider>
        );

        // Assert that the children are rendered inside the ThemeProvider
        expect(screen.getByText(mockChildText)).toBeInTheDocument();
    });
});
