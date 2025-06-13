import { render, screen } from '@testing-library/react';
import CardIcon from './CardIcon';

// Mocking the image imports
jest.mock('../../../assets/images/Icons/amex-icon.png', () => 'amex-icon.png');
jest.mock('../../../assets/images/Icons/default-card-icon.png', () => 'default-card-icon.png');
jest.mock('../../../assets/images/Icons/discover-icon.png', () => 'discover-icon.png');
jest.mock('../../../assets/images/Icons/jcb-icon.png', () => 'jcb-icon.png');
jest.mock('../../../assets/images/Icons/master-icon.png', () => 'master-icon.png');
jest.mock('../../../assets/images/Icons/visa-icon.png', () => 'visa-icon.png');

describe('CardIcon', () => {
    it('should render Visa icon when cardType is "visa"', () => {
        render(<CardIcon cardType="visa" />);
        const imgElement = screen.getByAltText('Visa');
        expect(imgElement).toBeInTheDocument();
        expect(imgElement).toHaveAttribute('src', 'visa-icon.png');
    });

    it('should render MasterCard icon when cardType is "mastercard"', () => {
        render(<CardIcon cardType="mastercard" />);
        const imgElement = screen.getByAltText('MasterCard');
        expect(imgElement).toBeInTheDocument();
        expect(imgElement).toHaveAttribute('src', 'master-icon.png');
    });

    it('should render Amex icon when cardType is "amex"', () => {
        render(<CardIcon cardType="amex" />);
        const imgElement = screen.getByAltText('Amex');
        expect(imgElement).toBeInTheDocument();
        expect(imgElement).toHaveAttribute('src', 'amex-icon.png');
    });

    it('should render Discover icon when cardType is "discover"', () => {
        render(<CardIcon cardType="discover" />);
        const imgElement = screen.getByAltText('Amex'); // Note: you should update alt text if needed
        expect(imgElement).toBeInTheDocument();
        expect(imgElement).toHaveAttribute('src', 'discover-icon.png');
    });

    it('should render JCB icon when cardType is "jcb"', () => {
        render(<CardIcon cardType="jcb" />);
        const imgElement = screen.getByAltText('Amex'); // Note: you should update alt text if needed
        expect(imgElement).toBeInTheDocument();
        expect(imgElement).toHaveAttribute('src', 'jcb-icon.png');
    });

    it('should render Default icon when cardType is unknown', () => {
        render(<CardIcon cardType="unknown" />);
        const imgElement = screen.getByAltText('Amex'); // Note: you should update alt text if needed
        expect(imgElement).toBeInTheDocument();
        expect(imgElement).toHaveAttribute('src', 'default-card-icon.png');
    });
});
