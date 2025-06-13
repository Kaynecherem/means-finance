import { render, screen } from '@testing-library/react';
import BoxWrapper from '.';

describe('BoxWrapper Component', () => {
    it('should render correctly with children', () => {
        render(
            <BoxWrapper>
                <span>Test content</span>
            </BoxWrapper>
        );

        // Verify the content is rendered correctly
        expect(screen.getByText('Test content')).toBeInTheDocument();
    });

    it('should render an empty BoxWrapper without children', () => {
        render(
            <BoxWrapper />
        );

        // Verify the BoxWrapper is rendered without children
        expect(screen.getByTestId('box-wrapper')).toBeInTheDocument();
    });

    it('should apply the "large" type prop correctly', () => {
        render(
            <BoxWrapper type="large">
                <span>Content for large type</span>
            </BoxWrapper>
        );

        // Verify max-width is applied correctly for "large" type
        expect(screen.getByTestId('box-wrapper')).toHaveStyle('max-width: 1168px');
    });

    it('should apply the default type prop correctly', () => {
        render(
            <BoxWrapper>
                <span>Content for default type</span>
            </BoxWrapper>
        );

        // Verify max-width is applied correctly for default type
        expect(screen.getByTestId('box-wrapper')).toHaveStyle('max-width: 946px');
    });

    it('should apply the provided style prop', () => {
        const customStyle = { backgroundColor: 'lightgreen' };

        render(
            <BoxWrapper style={customStyle}>
                <span>Styled content</span>
            </BoxWrapper>
        );

        // Verify the BoxWrapper applies the provided style
        expect(screen.getByTestId('box-wrapper')).toHaveStyle('background-color: lightgreen');
    });
});
