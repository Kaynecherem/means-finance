import { InputProps } from 'antd';
import { InputRef, SearchProps } from 'antd/es/input';
import React, { forwardRef } from 'react';
import { LuSearch } from 'react-icons/lu';
import { StyledSearchBox } from './style';
const SearchBox: React.FC<SearchProps> = forwardRef<InputRef, InputProps>((props, ref) => <StyledSearchBox enterButton={<LuSearch />}  {...props} ref={ref} />)

export default SearchBox
