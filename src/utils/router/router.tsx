import { lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import AuthenticationWrapper from "../../components/AuhenticationWrapper";
import BoxContainer from "../../components/BoxContainer";
import LayoutProvider from "../../components/LayoutProvider";
import { Roles } from "../enums/common";

const Login = lazy(() => import('../../pages/Login'))
const ForgotPassword = lazy(() => import('../../pages/Login/ForgotPassword'))
const ForgotPasswordSuccess = lazy(() => import('../../pages/Login/ForgotPasswordSuccess'))
const ResetPassword = lazy(() => import('../../pages/Login/ResetPassword'))
const ResetPasswordError = lazy(() => import('../../pages/Login/ResetPasswordError'))
const MyBills = lazy(() => import('../../pages/MyBills'))
const NonLoginPaymentFetch = lazy(() => import('../../pages/CustomerPayment/NonLoginPaymentFetch'))
const CustomerPayment = lazy(() => import('../../pages/CustomerPayment'))
const CustomerProfile = lazy(() => import('../../pages/CustomerProfile'))
const AgencyProfile = lazy(() => import('../../pages/AgencyProfile'))
const BillType = lazy(() => import('../../pages/Quote/BillType'))
const BillDetails = lazy(() => import('../../pages/Quote/BillDetails'))
const CustomerPay = lazy(() => import('../../pages/Quote/CustomerPay'))
const CustomerInfo = lazy(() => import('../../pages/Quote/CustomerInfo'))
const Summary = lazy(() => import('../../pages/Quote/Summary'))
const BillSummary = lazy(() => import('../../pages/Quote/BillSummary'))
const Quote = lazy(() => import('../../pages/Quote'))
const Collect = lazy(() => import('../../pages/Collect'))
const CollectSearch = lazy(() => import('../../pages/Collect/Search'))
const CustomerBills = lazy(() => import('../../pages/Collect/CustomerBills'))
const CustomerSummary = lazy(() => import('../../pages/Collect/CustomerSummary'))
const CollectPayment = lazy(() => import('../../pages/Collect/Payment'))
const ChangesDue = lazy(() => import('../../pages/Collect/ChangesDue'))
const CollectSuccess = lazy(() => import('../../pages/Collect/Success'))
const CollectError = lazy(() => import('../../pages/Collect/Error'))
const Manage = lazy(() => import('../../pages/Manage'))

const router = createBrowserRouter([
    {
        path: "/",
        element: <LayoutProvider />,
        children: [
            {
                path: "/",
                element: <Navigate to={'/login'} replace />,
            },
            {
                path: "login",
                element: <Login />,
            },
            {
                path: "forgot-password",
                element: <ForgotPassword />,
            },
            {
                path: "forgot-password-success",
                element: <ForgotPasswordSuccess />,
            },
            {
                path: "reset-password",
                element: <ResetPassword />,
            },
            {
                path: "reset-password/error",
                element: <ResetPasswordError />,
            },
            {
                path: "my-bills",
                element: <AuthenticationWrapper>
                    <MyBills />
                </AuthenticationWrapper>,
            },
            {
                path: "profile",
                element: <AuthenticationWrapper>
                    <CustomerProfile />
                </AuthenticationWrapper>,
            },
            {
                path: "payments/:token",
                element: <NonLoginPaymentFetch />

            },
            {
                path: "payment",
                element: <CustomerPayment />

            },
            {
                path: 'payment/success',
                element: (
                    <BoxContainer>
                        <CollectSuccess />
                    </BoxContainer>
                )
            },
            {
                path: 'payment/error',
                element: (
                    <BoxContainer>
                        <CollectError />
                    </BoxContainer>
                )

            },
            {
                path: 'agency',
                children: [
                    {
                        path: "profile",
                        element: <AuthenticationWrapper role={Roles.AGENCY}><AgencyProfile /></AuthenticationWrapper>,
                    },
                    {
                        path: "quote",
                        element: <AuthenticationWrapper role={Roles.AGENCY}><Quote /></AuthenticationWrapper>,
                        children: [
                            {
                                path: 'bill-type',
                                element: <BillType />,
                            },
                            {
                                path: 'bill-details',
                                element: <BillDetails />
                            },
                            {
                                path: 'customer-pay',
                                element: <CustomerPay />
                            },
                            {
                                path: 'bill-summary',
                                element: <BillSummary />
                            },
                            {
                                path: 'customer-info',
                                element: <CustomerInfo />
                            },
                            {
                                path: 'summary',
                                element: <Summary />
                            },
                        ]
                    },
                    {
                        path: "collect",
                        element: <AuthenticationWrapper role={Roles.AGENCY}><Collect /></AuthenticationWrapper>,
                        children: [
                            {
                                path: 'search',
                                element: <CollectSearch />
                            },
                            {
                                path: 'customer-bills',
                                element: <CustomerBills />
                            },
                            {
                                path: 'customer-summary',
                                element: <CustomerSummary />
                            },
                            {
                                path: 'payment',
                                element: <CollectPayment />
                            },
                            {
                                path: 'changes-due',
                                element: <ChangesDue />
                            },
                            {
                                path: 'success',
                                element: <CollectSuccess />
                            },
                            {
                                path: 'error',
                                element: <CollectError />
                            },

                        ]
                    },
                    {
                        path: "manage/:filter?",
                        element: <AuthenticationWrapper role={Roles.AGENCY}><Manage /></AuthenticationWrapper>,
                    }
                ]
            }
        ]
    },


]);


export default router
