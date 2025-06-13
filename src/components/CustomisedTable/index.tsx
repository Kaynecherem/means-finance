import { TableProps } from "antd"
import { StyledTable } from "./style"

const CustomizedTable = <RecordType extends object>(props: TableProps<RecordType>) => {
    return <StyledTable
        {...props}
    />
}
export default CustomizedTable
