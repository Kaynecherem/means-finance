import { CustomerPayFrequency } from '../enums/common';
import { CalculatedQuoteInstallments } from '../types/common';
import addOrdinalSuffix from './addOrdinalSuffix';
import joinWithAnd from './joinWithAnd';
const getInstallmentLabel = (info: CalculatedQuoteInstallments) => {
    switch (info.installmentFrequency) {
        case CustomerPayFrequency.WEEKLY:
            return `Billed Every Payday`
        case CustomerPayFrequency.BI_WEEKLY:
        case CustomerPayFrequency.SPECIFIC_DAYS:
            return `Billed on the ${joinWithAnd(info.installmentDayValue.split(',').map(date => addOrdinalSuffix(Number(date))))} of Every Month`

        default:
            return ""
    }
}
export default getInstallmentLabel
