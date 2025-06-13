import { QuoteFrequency } from '../enums/common';
const getDueLabel = (quoteFrequency: QuoteFrequency) => {
    switch (quoteFrequency) {
        case QuoteFrequency.MONTHLY:
            return `Monthly`
        case QuoteFrequency.QUARTERLY:
            return `Quarterly`
        case QuoteFrequency.HALF_YEARLY:
            return `Half Yearly`
        case QuoteFrequency.ANNUAL:
            return `Annually`
        default:
            return ""
    }
}
export default getDueLabel
