import { BillTypeEnum } from "../enums/common";

const billTypeMapper = (billType: string) => {
    switch (billType) {
        case BillTypeEnum.AUTO_INSURANCE:
            return "Auto Insurance"
        case BillTypeEnum.AUTO_PAYMENT:
            return "Auto Payment"
        case BillTypeEnum.RENT:
            return "Rent/ Mortgage"
        case BillTypeEnum.UTILITY_BILL:
            return "Utility Bill"
        case BillTypeEnum.OTHER_BILLS:
            return "Other Bills"
        default:
            return ""
    }
}
export default billTypeMapper
