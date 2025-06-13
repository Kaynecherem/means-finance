import { render, screen } from '@testing-library/react';
import { Radio } from 'antd';
import { ThemeProvider } from 'styled-components';
import ButtonRadioSelection from '.';

// Define a mock theme for testing
const mockTheme = {
    color700: '#333',
    color300: '#ccc',
    systemDefaults: {
        colorWhite: '#fff',
    },
};

describe('ButtonRadioSelection Component', () => {
    it('should render correctly with options', () => {
        render(
            <ThemeProvider theme={mockTheme}>
                <ButtonRadioSelection>
                    <Radio.Button value="option1">Option 1</Radio.Button>
                    <Radio.Button value="option2">Option 2</Radio.Button>
                </ButtonRadioSelection>
            </ThemeProvider>
        );

        // Verify that the radio buttons are rendered
        expect(screen.getByText('Option 1')).toBeInTheDocument();
        expect(screen.getByText('Option 2')).toBeInTheDocument();
    });
});
