import getCardType from './getCardType';

describe('getCardType', () => {
    it('should return "visa" for valid Visa card number', () => {
        expect(getCardType('4111111111111111')).toBe('visa');
    });

    it('should return "mastercard" for valid MasterCard number', () => {
        expect(getCardType('5111111111111111')).toBe('mastercard');
    });

    it('should return "amex" for valid American Express number', () => {
        expect(getCardType('371449635398431')).toBe('amex');
    });

    it('should return "discover" for valid Discover card number', () => {
        expect(getCardType('6011514433546201')).toBe('discover');
    });
    it('should return "diners" for valid Diners card number', () => {
        expect(getCardType('3055155515160018')).toBe('diners');
    });
    it('should return "jcb" for valid JCB card number', () => {
        expect(getCardType('3566002020360505')).toBe('jcb');
    });

    it('should return an empty string for invalid card number', () => {
        expect(getCardType('1234567890123456')).toBe('');
        expect(getCardType('')).toBe('');
    });
});
