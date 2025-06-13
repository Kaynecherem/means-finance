import { ButtonProps } from 'antd';
import React from 'react';
import { StyledSubmitButton } from './style';
const SubmitButton: React.FC<ButtonProps> = props => <StyledSubmitButton type='primary' iconPosition='end' {...props} />

export default SubmitButton
