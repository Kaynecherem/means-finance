import { render, screen } from '@testing-library/react';
import AutoComplete from '.';

describe('AutoComplete', () => {
    it('should render without crashing', () => {
        render(<AutoComplete />);
        const autoCompleteElement = screen.getByTestId('auto-complete');
        expect(autoCompleteElement).toBeInTheDocument();
    });
});
