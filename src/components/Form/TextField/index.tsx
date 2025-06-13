import LoadingOutlined from '@ant-design/icons/LoadingOutlined';
import { InputProps, InputRef, Spin } from 'antd';
import React, { forwardRef } from 'react';
import { StyledTextField } from './style';
type TextFieldProps = InputProps & {
    loading?: boolean
}
const TextField: React.FC<TextFieldProps> = forwardRef<InputRef, TextFieldProps>(({ loading, ...props }, ref) => <StyledTextField disabled={loading} {...props} ref={ref} suffix={loading ? <Spin data-testid={'textfield-spin'} indicator={<LoadingOutlined spin />} size='small' /> : props.suffix} />)

export default TextField
