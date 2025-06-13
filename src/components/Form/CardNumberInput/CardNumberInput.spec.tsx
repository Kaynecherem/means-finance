import { fireEvent, render, screen } from '@testing-library/react';
import CardNumberInput from './index';

// Mock CardIcon
jest.mock('./CardIcon', () => ({
    __esModule: true,
    default: ({ cardType }: { cardType: string }) => (
        <div data-testid="card-icon">{cardType}</div>
    )
}));

// Mock NumberField from Ant Design
jest.mock('../NumberField', () => {
    return ({ value, onChange, prefix, placeholder, ...rest }: any) => (
        <div>
            {prefix}
            <input
                data-testid="card-number-input"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                {...rest}
            />
        </div>
    );
});

describe('CardNumberInput', () => {
    it('should render without crashing', () => {
        render(<CardNumberInput />);
        const inputElement = screen.getByTestId('card-number-input');
        expect(inputElement).toBeInTheDocument();
    });

    it('should display the correct card icon based on card type', () => {
        render(<CardNumberInput value="4111111111111111" />);
        const cardIcon = screen.getByTestId('card-icon');
        expect(cardIcon).toHaveTextContent('visa'); // 'visa' based on the provided card number
    });

    it('should call onChange with formatted card number', () => {
        const handleChange = jest.fn();
        render(<CardNumberInput value="" onChange={handleChange} />);
        const inputElement = screen.getByTestId('card-number-input');

        fireEvent.change(inputElement, { target: { value: '4111 1111 1111 1111' } });

        expect(handleChange).toHaveBeenCalledWith('4111111111111111');
    });
});
