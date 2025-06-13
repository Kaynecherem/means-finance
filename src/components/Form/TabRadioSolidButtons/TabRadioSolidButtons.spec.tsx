import { fireEvent, render, screen } from '@testing-library/react';
import { Radio } from 'antd';
import { ThemeProvider } from 'styled-components';
import TabRadioSolidButtons from '.';

// Define a mock theme that matches the structure used in styled-components
const mockTheme = {
    color700: '#333333',
    color300: '#cccccc',
    systemDefaults: {
        colorPrimary: '#0e8737',
    },
    colorFillCustom: '#f0f0f0',
};

describe('TabRadioSolidButtons', () => {
    test('should render TabRadioSolidButtons with default props', () => {
        render(
            <ThemeProvider theme={mockTheme}>
                <TabRadioSolidButtons data-testid="tab-radio-solid-buttons">
                    <Radio.Button value="1">Option 1</Radio.Button>
                    <Radio.Button value="2">Option 2</Radio.Button>
                </TabRadioSolidButtons>
            </ThemeProvider>
        );

        expect(screen.getByTestId('tab-radio-solid-buttons')).toBeInTheDocument();
        expect(screen.getByText('Option 1')).toBeInTheDocument();
        expect(screen.getByText('Option 2')).toBeInTheDocument();
    });

    test('should handle change event', () => {
        const handleChange = jest.fn();
        render(
            <ThemeProvider theme={mockTheme}>
                <TabRadioSolidButtons data-testid="tab-radio-solid-buttons" onChange={handleChange}>
                    <Radio.Button value="1">Option 1</Radio.Button>
                    <Radio.Button value="2">Option 2</Radio.Button>
                </TabRadioSolidButtons>
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
