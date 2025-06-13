import { WEEK_DAYS } from '../contants/common';
import { CustomerPayFrequency } from '../enums/common';
import { DirectusBill } from '../types/schema';
import addOrdinalSuffix from './addOrdinalSuffix';
import joinWithAnd from './joinWithAnd';

const getCustomerInstallmentLabel = (bill: DirectusBill) => {
    switch (bill.user_payrol_type) {
        case CustomerPayFrequency.WEEKLY:
            if (bill.weekly) {
                return WEEK_DAYS[Number(bill.weekly)]?.fullName;
            }
            return "";
        case CustomerPayFrequency.BI_WEEKLY:
            if (bill.biweekly) {
                const dates = bill.biweekly.split(',').map(date => addOrdinalSuffix(Number(date)));
                return `${joinWithAnd(dates)} of Every Month`;
            }
            return "";
        case CustomerPayFrequency.MONTHLY:
            if (bill.monthly) {
                return `${addOrdinalSuffix(Number(bill.monthly))} of Every Month`;
            }
            return "";
        case CustomerPayFrequency.SPECIFIC_DAYS:
            if (bill.specific_days) {
                const dates = bill.specific_days.split(',').map(date => addOrdinalSuffix(Number(date)));
                return `${joinWithAnd(dates)} of Every Month`;
            }
            return "";
        default:
            return "";
    }
}

export default getCustomerInstallmentLabel;
