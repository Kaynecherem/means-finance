import { fireEvent, render, screen } from '@testing-library/react';
import CVVInput from '.';

describe('CVVInput', () => {
    it('should render correctly with default placeholder', () => {
        render(<CVVInput />);
        const inputElement = screen.getByPlaceholderText('CVV');
        expect(inputElement).toBeInTheDocument();
    });

    it('should display the value prop', () => {
        render(<CVVInput value="123" />);
        const inputElement = screen.getByDisplayValue('123');
        expect(inputElement).toBeInTheDocument();
    });

    it('should call onChange with formatted value when input changes', () => {
        const handleChange = jest.fn();
        render(<CVVInput onChange={handleChange} />);

        // Simulate user input
        fireEvent.change(screen.getByPlaceholderText('CVV'), { target: { value: '123456' } });

        // Verify the onChange callback is called with formatted value
        expect(handleChange).toHaveBeenCalledWith('1234');
    });

    it('should not allow more than 4 digits', () => {
        const handleChange = jest.fn();
        render(<CVVInput onChange={handleChange} />);
        const inputElement = screen.getByPlaceholderText('CVV');

        // Simulate user input
        fireEvent.change(inputElement, { target: { value: '12345' } });

        // Verify input value is limited to 4 digits
        expect(handleChange).toHaveBeenCalledWith('1234');
    });

    it('should remove non-digit characters from input', () => {
        const handleChange = jest.fn();
        render(<CVVInput onChange={handleChange} />);
        const inputElement = screen.getByPlaceholderText('CVV');

        // Simulate user input with non-digit characters
        fireEvent.change(inputElement, { target: { value: '12ab34' } });

        // Verify input value contains only digits
        expect(handleChange).toHaveBeenCalledWith('1234');
    });
});
