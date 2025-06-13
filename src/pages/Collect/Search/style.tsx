import styled from "styled-components";

export const SearchPageWrapper = styled.div`
    min-height: 514px;
    align-content: center;
    padding: 40px 10px;
`
export const NameSelectionOption = styled.div`
    color: ${({ theme }) => theme.color700};
    & .name{
        font-size: 14px;
        font-weight: 500;
    }
    & .phone{
        font-size: 12px;
    }
`
export const LoadingDropDownRender = styled.div`
    text-align: center;
`
export const SearchByNameWrapper = styled.div`
position: relative;
    & svg{
        position: absolute;
        z-index: 1;
        font-size: 20px;
        top: 12px;
        left: 12px;
        color: ${({ theme }) => theme.color500};
    }
    & .ant-select-selection-item, & .ant-select-selection-search-input{
        padding-left: 42px !important ;
    }
    & .ant-select-clear{
        top: 6px;
        right: 28px;
    }
`
