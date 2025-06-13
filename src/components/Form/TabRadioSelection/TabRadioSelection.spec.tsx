import { fireEvent, render, screen } from '@testing-library/react';
import { Radio } from 'antd';
import { ThemeProvider } from 'styled-components';
import TabRadioSelection from '.';

// Define a mock theme that matches the structure used in styled-components
const mockTheme = {
    color50: '#f0f0f0',
    color100: '#e0e0e0',
    color500: '#666666',
    color700: '#333333',
    color300: '#cccccc',
    systemDefaults: {
        colorBgContainer: '#ffffff',
    },
};

describe('TabRadioSelection', () => {
    test('should render TabRadioSelection with default props', () => {
        render(
            <ThemeProvider theme={mockTheme}>
                <TabRadioSelection data-testid="tab-radio-selection">
                    <Radio.Button value="1">Option 1</Radio.Button>
                    <Radio.Button value="2">Option 2</Radio.Button>
                </TabRadioSelection>
            </ThemeProvider>
        );

        expect(screen.getByTestId('tab-radio-selection')).toBeInTheDocument();
        expect(screen.getByText('Option 1')).toBeInTheDocument();
        expect(screen.getByText('Option 2')).toBeInTheDocument();
    });

    test('should handle change event', () => {
        const handleChange = jest.fn();
        render(
            <ThemeProvider theme={mockTheme}>
                <TabRadioSelection data-testid="tab-radio-selection" onChange={handleChange}>
                    <Radio.Button value="1">Option 1</Radio.Button>
                    <Radio.Button value="2">Option 2</Radio.Button>
                </TabRadioSelection>
            </ThemeProvider>
        );

        fireEvent.click(screen.getByText('Option 1'));
        expect(handleChange).toHaveBeenCalled();
        expect(handleChange).toHaveBeenCalledWith(expect.objectContaining({ target: expect.objectContaining({ checked: true, value: "1" }) }));

        fireEvent.click(screen.getByText('Option 2'));
        expect(handleChange).toHaveBeenCalled();
        expect(handleChange).toHaveBeenCalledWith(expect.objectContaining({ target: expect.objectContaining({ checked: true, value: "2" }) }));
    });
});
