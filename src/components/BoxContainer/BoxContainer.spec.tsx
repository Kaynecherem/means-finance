import { render, screen } from '@testing-library/react';
import BoxContainer from '.';

describe('BoxContainer Component', () => {
    it('should render correctly with children', () => {
        render(
            <BoxContainer>
                <span>Test content</span>
            </BoxContainer>
        );

        // Verify the content is rendered correctly
        expect(screen.getByText('Test content')).toBeInTheDocument();
    });

    it('should render an empty BoxContainer without children', () => {
        render(
            <BoxContainer />
        );

        // Verify the BoxContainer is rendered without children
        expect(screen.getByTestId('box-container')).toBeInTheDocument();
    });

    it('should apply the provided style prop', () => {
        const customStyle = { backgroundColor: 'lightblue' };

        render(
            <BoxContainer style={customStyle}>
                <span>Styled content</span>
            </BoxContainer>
        );

        // Verify the BoxContainer applies the provided style
        expect(screen.getByTestId('box-container')).toHaveStyle('background-color: lightblue');
    });
});
