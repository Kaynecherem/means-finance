import { RadioGroupProps } from 'antd';
import React from 'react';
import { ButtonSelectionRadioGroup } from './style';
const ButtonRadioSelection: React.FC<RadioGroupProps> = props => <ButtonSelectionRadioGroup data-testid="button-radio-selection" {...props} optionType='button' buttonStyle='solid' />


export default ButtonRadioSelection
