import { CustomDirectusUser } from "../types/schema";

export const castCustomer = (customer: string | CustomDirectusUser | null) => {
    if (customer && typeof customer === 'object') {
        return customer as unknown as CustomDirectusUser
    }
    return null;
}
