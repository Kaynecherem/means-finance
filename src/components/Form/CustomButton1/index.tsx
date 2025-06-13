import { ButtonProps } from 'antd';
import React from 'react';
import { StyledCustomButton1 } from './style';
const CustomButton1: React.FC<ButtonProps> = props => <StyledCustomButton1 type='default' iconPosition='end' {...props} />

export default CustomButton1
