import { CustomerPayFrequency } from "../enums/common"
import { CalculatedQuoteInstallments, StoreQuote } from "../types/common"

const billDueCalculation = (quote: StoreQuote): CalculatedQuoteInstallments => {
    const isDownPaymentRequired = quote.isDownPaymentRequired
    const userPayFrequency = quote.customerPayFrequency
    let installmentAmount = 0
    let installmentDayValue = ""
    if (quote.quoteAmount) {
        if (userPayFrequency === CustomerPayFrequency.WEEKLY) {
            installmentAmount = quote.quoteAmount / (quote.quoteFrequency * 4)
            installmentDayValue = quote.weekDays?.toString() ?? ""
        } else if (userPayFrequency === CustomerPayFrequency.BI_WEEKLY || userPayFrequency === CustomerPayFrequency.SPECIFIC_DAYS) {
            installmentAmount = quote.quoteAmount / (quote.quoteFrequency * quote.customerPayFrequencyDays.length)
            installmentDayValue = quote.customerPayFrequencyDays.join(',')
        }
    }
    const installmentAmountWithoutCommission = installmentAmount

    return {
        isDownPaymentRequired,
        installmentDayValue,
        installmentAmount,
        installmentAmountWithoutCommission,
        downPaymentAmount: quote.downPaymentAmount,
        installmentFrequency: userPayFrequency,
        quoteFrequency: quote.quoteFrequency,
        quoteAmount: quote.quoteAmount,
        calculatedQuoteAmount: quote.quoteAmount
    }
}

export default billDueCalculation
