import AmexIcon from "../../../assets/images/Icons/amex-icon.png";
import DefaultIcon from "../../../assets/images/Icons/default-card-icon.png";
import DiscoverIcon from "../../../assets/images/Icons/discover-icon.png";
import JcbIcon from "../../../assets/images/Icons/jcb-icon.png";
import MasterIcon from "../../../assets/images/Icons/master-icon.png";
import VisaIcon from "../../../assets/images/Icons/visa-icon.png";
const CardIcon = ({ cardType }: { cardType: string }) => {
    switch (cardType) {
        case 'visa':
            return <img src={VisaIcon} alt="Visa" />;
        case 'mastercard':
            return <img src={MasterIcon} alt="MasterCard" />;
        case 'amex':
            return <img src={AmexIcon} alt="Amex" />;
        case 'discover':
            return <img src={DiscoverIcon} alt="Amex" />;
        case 'jcb':
            return <img src={JcbIcon} alt="Amex" />;
        default:
            return <img src={DefaultIcon} alt="Amex" />;
    }
};

export default CardIcon
