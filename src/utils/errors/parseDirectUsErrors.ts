import { logoutAction } from "../redux/slices/authSlice";
import { resetCollect } from "../redux/slices/collectSlice";
import { resetQuote } from "../redux/slices/quoteSlice";
import { store } from "../redux/store";
import { DirectusError } from "../types/directus";
import BadRequestError from "./BadRequest";
import ForbiddenError from "./Forbidden";
import InvalidCredentialsError from "./InvalidCredentials";
import SomethingWentWrongError from "./SomethingWentWrongError";
const performLogout = () => {
    store.dispatch(resetCollect())
    store.dispatch(resetQuote())
    store.dispatch(logoutAction())
}
const parseDirectUsErrors = (error: DirectusError) => {
    const code = error.errors ? (error.errors[0].extensions?.code || error.errors[0].code) : "SOMETHING_WENT_WRONG"
    const message = error.errors ? error.errors[0]?.message : undefined
    switch (code) {
        case "INVALID_CREDENTIALS":
            return new InvalidCredentialsError()
        case "BAD_REQUEST":
            return new BadRequestError(message)
        case "FORBIDDEN":
            performLogout()
            return new ForbiddenError()
        default:
            return new SomethingWentWrongError(message)
    }

}

export default parseDirectUsErrors
