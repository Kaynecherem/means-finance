import { InputProps } from 'antd';
import React from 'react';
import { LuEye, LuEyeOff } from 'react-icons/lu';
import { StyledPasswordField } from './style';
const PasswordField: React.FC<InputProps> = props => <StyledPasswordField {...props} iconRender={visible => visible ? <LuEye data-testid="icon-eye" /> : <LuEyeOff data-testid="icon-eye-off" />} />

export default PasswordField
