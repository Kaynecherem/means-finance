import { render, screen } from '@testing-library/react';
import DueNow from '.';

describe('DueNow', () => {
    it('should render with primary type and default label', () => {
        render(
            <DueNow amount={123.45} />
        );

        expect(screen.getByTestId('title')).toHaveTextContent('Due Now');
        expect(screen.getByTestId('amount')).toHaveTextContent('123.45');
    });

    it('should render with danger type and custom label', () => {
        render(
            <DueNow amount={678.90} type="danger" label="Urgent Payment" />
        );

        expect(screen.getByTestId('title')).toHaveTextContent('Urgent Payment');
        expect(screen.getByTestId('amount')).toHaveTextContent('678.90');
    });
});
