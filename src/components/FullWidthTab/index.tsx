import { RadioGroupProps } from 'antd';
import React from 'react';
import { StyledFullWidthTab } from './style';
const FullWidthTab: React.FC<RadioGroupProps> = props => <StyledFullWidthTab {...props} optionType='button' />

export default FullWidthTab
