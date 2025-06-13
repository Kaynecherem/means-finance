import { Progress } from 'antd';
import React, { Suspense, useMemo } from 'react';
import { LuArrowLeft } from 'react-icons/lu';
import { Outlet, useMatches, useNavigate } from 'react-router-dom';
import { useTheme } from 'styled-components';
import Box from '../../components/Box';
import BoxContainer from '../../components/BoxContainer';
import BoxWrapper from '../../components/BoxWrapper';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { PageBackButton } from '../style';
import { QuotePageWrapper } from './style';
const steps = [
    {
        route: '/bill-type',
    },
    {
        route: '/bill-details',
    },
    {
        route: '/customer-pay',
    },
    {
        route: '/bill-summary'
    },
    {
        route: '/deluxe-payment'
    },
    {
        route: '/customer-info'
    },
    {
        route: '/summary'
    }
]
const Quote: React.FC = () => {
    const theme = useTheme()
    const matches = useMatches()
    const navigate = useNavigate()
    const currentStep = useMemo(() => {
        const matchingRoute = matches[matches.length - 1]
        if (matchingRoute) {
            for (let index = 0; index < steps.length; index++) {
                if (matchingRoute.pathname.includes(steps[index].route)) {
                    return index;
                }
            }
        }
        return 0;
    }, [matches])
    return (
        <BoxContainer>
            <BoxWrapper type='large'>
                <Box>
                    <QuotePageWrapper>
                        <Progress percent={(100 * (currentStep + 1)) / steps.length} showInfo={false} strokeColor={theme.systemDefaults.colorPrimary} />
                        <PageBackButton
                            onClick={() => navigate(`/agency/quote${steps[currentStep - 1].route}`)}
                            disabled={!currentStep}
                        >
                            <LuArrowLeft />
                        </PageBackButton>
                        <Suspense fallback={<LoadingSpinner />}>
                            <Outlet />
                        </Suspense>
                    </QuotePageWrapper>
                </Box>
            </BoxWrapper>
        </BoxContainer>
    )
}

export default Quote
