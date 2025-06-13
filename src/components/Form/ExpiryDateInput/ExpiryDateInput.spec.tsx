import { fireEvent, render, screen } from '@testing-library/react';
import ExpiryDateInput from '.';


describe('ExpiryDateInput', () => {
  it('should render correctly with initial value', () => {
    render(<ExpiryDateInput value={{ month: '12', year: '2024' }} />);

    // Verify that the initial display value is formatted correctly
    expect(screen.getByDisplayValue('12/24')).toBeInTheDocument();
  });

  it('should call onChange with correct value when input changes', () => {
    const handleChange = jest.fn();
    render(<ExpiryDateInput value={{ month: '', year: '' }} onChange={handleChange} />);

    const inputElement = screen.getByPlaceholderText('MM/YY');
    fireEvent.change(inputElement, { target: { value: '01/25' } });

    // Check if onChange is called with the expected value
    expect(handleChange).toHaveBeenCalledWith({ month: '01', year: '2025' });
  });
  it('should append / onChange with correct value when input changes', () => {
    render(<ExpiryDateInput />);

    const inputElement = screen.getByPlaceholderText('MM/YY');
    fireEvent.change(inputElement, { target: { value: '01' } });

    // Check if onChange is called with the expected value
    expect(screen.getByDisplayValue('01/')).toBeInTheDocument();
  });
});
