import styled from "styled-components";

export const ExistingCustomerWrapper = styled.div`
    min-height: 514px;
    padding: 40px 10px;
    align-content: center;
`;

export const SearchByNameWrapper = styled.div`
    position: relative;

    & svg {
        position: absolute;
        z-index: 1;
        font-size: 20px;
        top: 12px;
        left: 12px;
        color: ${({ theme }) => theme.color500};
    }

    & .ant-select-selection-item,
    & .ant-select-selection-search-input {
        padding-left: 42px !important;
    }

    & .ant-select-clear {
        top: 6px;
        right: 28px;
    }
`;

export const NameSelectionOption = styled.div`
    color: ${({ theme }) => theme.color700};

    .name {
        font-size: 14px;
        font-weight: 500;
    }

    .email,
    .phone {
        font-size: 12px;
        color: ${({ theme }) => theme.color500};
    }
`;

export const LoadingDropDownRender = styled.div`
    text-align: center;
`;
