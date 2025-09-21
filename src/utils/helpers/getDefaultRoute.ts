import { Roles } from "../enums/common";

const getDefaultRoute = (role?: Roles | null) => {
    switch (role) {
        case Roles.AGENCY:
            return "/agency/manage";
        case Roles.CLIENT:
            return "/my-bills";
        default:
            return "/login";
    }
};

export default getDefaultRoute;
