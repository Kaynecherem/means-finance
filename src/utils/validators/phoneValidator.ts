import { RuleObject } from "antd/es/form"
import phone from "phone"

const phoneValidator = async (_: RuleObject, value: string) => {
    if (!value) {
        return Promise.resolve()
    }
    const phoneDetails = phone(value)
    if (!phoneDetails.isValid) {
        // eslint-disable-next-line no-template-curly-in-string
        return Promise.reject(new Error("${label} is not a valid Phone number"))
    }
    return Promise.resolve()
}
export default phoneValidator
