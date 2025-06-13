import { User } from "../types/common";
import { CustomDirectusUser } from "../types/schema";

const userMapper = (directusUser: CustomDirectusUser): User => {
    return {
        id: directusUser.id,
        firstName: directusUser.first_name,
        lastName: directusUser.last_name,
        email: directusUser.email,
        phone: directusUser.phone
    }
}
export default userMapper
