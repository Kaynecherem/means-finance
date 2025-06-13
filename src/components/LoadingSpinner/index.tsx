import LoadingOutlined from "@ant-design/icons/LoadingOutlined"
import { Spin } from "antd"
import { CSSProperties } from "react"
import { LoadingSpinnerWrapper } from "./style"
export type LoadingSpinnerProps = {
    fullScreen?: boolean,
    style?: CSSProperties
}
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = props => (
    <LoadingSpinnerWrapper data-testid='loading-spinner' {...props}>
        <Spin indicator={<LoadingOutlined spin data-testid="loading-spinner-icon" />} />
    </LoadingSpinnerWrapper>
)
