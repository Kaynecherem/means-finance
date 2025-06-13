import { LuBarChart2, LuDollarSign, LuHome, LuLayers } from 'react-icons/lu';
import { BillTypeEnum } from "../../utils/enums/common";

const BillIcon: React.FC<{ type: string }> = ({ type }) => {
    switch (type) {
        case BillTypeEnum.AUTO_INSURANCE:
            return <LuLayers />
        case BillTypeEnum.AUTO_PAYMENT:
            return <LuLayers />
        case BillTypeEnum.RENT:
            return <LuHome />
        case BillTypeEnum.UTILITY_BILL:
            return <LuBarChart2 />
        case BillTypeEnum.OTHER_BILLS:
            return <LuDollarSign />

        default:
            return <></>
    }
}
export default BillIcon
