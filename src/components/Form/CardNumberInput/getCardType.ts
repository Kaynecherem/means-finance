import { amexRegEx, dinersRegEx, discoverRegEx, jcbRegEx, mastercardRegEx, visaRegEx } from "../../../utils/contants/regex";

const getCardType = (cardNumber: string) => {
    const cardPatterns = {
        visa: new RegExp(visaRegEx),
        mastercard: new RegExp(mastercardRegEx),
        amex: new RegExp(amexRegEx),
        discover: new RegExp(discoverRegEx),
        diners: new RegExp(dinersRegEx),
        jcb: new RegExp(jcbRegEx),
    };

    if (cardPatterns.visa.test(cardNumber)) return 'visa';
    if (cardPatterns.mastercard.test(cardNumber)) return 'mastercard';
    if (cardPatterns.amex.test(cardNumber)) return 'amex';
    if (cardPatterns.discover.test(cardNumber)) return 'discover';
    if (cardPatterns.diners.test(cardNumber)) return 'diners';
    if (cardPatterns.jcb.test(cardNumber)) return 'jcb';
    return '';
};
export default getCardType
