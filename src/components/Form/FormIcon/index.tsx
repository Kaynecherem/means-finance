import React, { ReactNode } from 'react';
import { FormIconWrapper } from './style';
export type FormIconSize = 'large' | 'small'
export type FormIconColor = 'primary' | 'success' | 'danger'
export type FormIconProps = {
    icon: ReactNode
    size?: FormIconSize
    color?: FormIconColor
}
const FormIcon: React.FC<FormIconProps> = props => <FormIconWrapper {...props}>{props.icon}</FormIconWrapper>

export default FormIcon
