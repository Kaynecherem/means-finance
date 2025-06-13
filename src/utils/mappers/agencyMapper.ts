import { Agency } from "../types/common";
import { DirectusAgency } from "../types/schema";

const agencyMapper = (directusAgency: DirectusAgency): Agency => {
    return {
        id: directusAgency.id,
        accountNumber: directusAgency.account_number,
        addressOne: directusAgency.address_one,
        addressTwo: directusAgency.address_two,
        agencyBankName: directusAgency.agency_bank_name,
        agencyEmail: directusAgency.agency_email,
        agencyName: directusAgency.agency_name,
        agencyPhoneNumber: directusAgency.agency_phone_number,
        city: directusAgency.city,
        state: directusAgency.state,
        country: directusAgency.country,
        postalCode: directusAgency.postal_code,
        routingNumber: directusAgency.routing_number,
    }
}
export default agencyMapper
