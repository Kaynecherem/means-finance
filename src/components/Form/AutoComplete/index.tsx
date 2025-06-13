import { AutoCompleteProps } from 'antd';
import React from 'react';
import { StyledAutoComplete } from './style';
const AutoComplete: React.FC<AutoCompleteProps> = props => <StyledAutoComplete data-testid="auto-complete" {...props} />

export default AutoComplete
