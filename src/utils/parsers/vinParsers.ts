import axios from "axios"
import { VIN } from "../types/common"
type VinResult = [{
    Value: string,
    Variable: string,
}]
const formatVin = (vin: string, vinData: VinResult) => {
    const output: VIN = {
        vin
    }
    vinData.forEach(data => {
        switch (data.Variable) {
            case "Error Code":
                output.errorCode = data.Value
                break;
            case "Make":
                output.make = data.Value
                break;
            case "Model":
                output.model = data.Value
                break;
            case "Model Year":
                output.year = data.Value
                break;
            default:
                break;
        }
    })
    return output

}
const vinParser = async (vin: string) => {
    const res = await axios(`https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinExtended/${vin}?format=json`)
    const results = res.data.Results as VinResult
    return formatVin(vin, results)

}

export default vinParser
