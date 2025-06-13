import { FormItemProps } from 'antd';
import React, { ReactNode } from 'react';
import FormIcon from '../FormIcon';
import { FormIconContainer, StyledFormItem, StyledFromItemContainer } from './style';
const FormItem: React.FC<FormItemProps & {
    icon?: ReactNode
    hideLabel?: boolean
}> = ({ icon, ...props }) => {
    return <StyledFromItemContainer>
        {
            icon && <FormIconContainer>
                <FormIcon icon={icon} />
            </FormIconContainer>
        }
        <StyledFormItem layout="vertical" {...props} />
    </StyledFromItemContainer>
}

export default FormItem
