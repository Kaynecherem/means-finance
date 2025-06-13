import { fireEvent, render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import FullWidthTab from '.';

// Mock theme definition
const mockTheme = {
    color100: '#e0e0e0',
    color25: '#f7f7f7',
    color500: '#5c5c5c',
    systemDefaults: {
        colorPrimary: '#0070f3',
        colorPrimaryBg: '#e6f7ff',
    },
};

describe('FullWidthTab', () => {
    const options = [
        { label: 'Tab 1', value: '1' },
        { label: 'Tab 2', value: '2' },
        { label: 'Tab 3', value: '3' },
    ];

    const renderComponent = (props = {}) => {
        return render(
            <ThemeProvider theme={mockTheme}>
                <FullWidthTab options={options} {...props} />
            </ThemeProvider>
        );
    };

    test('should render all radio buttons', () => {
        renderComponent();
        options.forEach(option => {
            expect(screen.getByText(option.label)).toBeInTheDocument();
        });
    });

    test('should select the correct radio button on click', () => {
        renderComponent();
        const tab1 = screen.getByText('Tab 1');
        const tab2 = screen.getByText('Tab 2');

        fireEvent.click(tab2);
        // eslint-disable-next-line testing-library/no-node-access
        expect(tab2.closest('.ant-radio-button-wrapper')).toHaveClass('ant-radio-button-wrapper-checked');
        // eslint-disable-next-line testing-library/no-node-access
        expect(tab1.closest('.ant-radio-button-wrapper')).not.toHaveClass('ant-radio-button-wrapper-checked');
    });

    test('should call onChange when a radio button is selected', () => {
        const handleChange = jest.fn();
        renderComponent({ onChange: handleChange });

        fireEvent.click(screen.getByText('Tab 2'));
        expect(handleChange).toHaveBeenCalledTimes(1);
    });

    test('should not throw error if onChange is not provided', () => {
        renderComponent();
        fireEvent.click(screen.getByText('Tab 2'));
        // No assertions needed, just checking for errors
    });

    test('should apply correct width to each .ant-radio-button-wrapper', () => {
        renderComponent();

        const buttons = screen.getAllByRole('radio');
        buttons.forEach(button => {
            // eslint-disable-next-line testing-library/no-node-access
            const buttonWrapper = button.closest('.ant-radio-button-wrapper');
            expect(getComputedStyle(buttonWrapper as Element).width).toBe(`${100 / options.length}%`);
        });
    });
});
