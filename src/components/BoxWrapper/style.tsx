import styled from "styled-components";
import { BoxWrapperType } from ".";
const getWidth = (type?: BoxWrapperType) => {
        switch (type) {
                case 'xl':
                        return '1264px'
                case 'large':
                        return '1168px'
                default:
                        return '946px'
        }
}
export const StyledBoxWrapper = styled.div<{
        type?: BoxWrapperType
}>`
        max-width: ${(({ type }) => getWidth(type))};
        width: 100%;
`
