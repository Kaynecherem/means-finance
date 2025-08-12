import lazyWithRetry from "../lazyWithRetry";
import { createBrowserRouter, Navigate } from "react-router-dom";
import AuthenticationWrapper from "../../components/AuhenticationWrapper";
import BoxContainer from "../../components/BoxContainer";
import LayoutProvider from "../../components/LayoutProvider";
import RouteError from "../../components/RouteError";
import { Roles } from "../enums/common";

const Login = lazyWithRetry(() => import('../../pages/Login'))
const ForgotPassword = lazyWithRetry(() => import('../../pages/Login/ForgotPassword'))
const ForgotPasswordSuccess = lazyWithRetry(() => import('../../pages/Login/ForgotPasswordSuccess'))
const ResetPassword = lazyWithRetry(() => import('../../pages/Login/ResetPassword'))
const ResetPasswordError = lazyWithRetry(() => import('../../pages/Login/ResetPasswordError'))
const MyBills = lazyWithRetry(() => import('../../pages/MyBills'))
const NonLoginPaymentFetch = lazyWithRetry(() => import('../../pages/CustomerPayment/NonLoginPaymentFetch'))
const CustomerPayment = lazyWithRetry(() => import('../../pages/CustomerPayment'))
const CustomerProfile = lazyWithRetry(() => import('../../pages/CustomerProfile'))
const AgencyProfile = lazyWithRetry(() => import('../../pages/AgencyProfile'))
const BillType = lazyWithRetry(() => import('../../pages/Quote/BillType'))
const BillDetails = lazyWithRetry(() => import('../../pages/Quote/BillDetails'))
const CustomerPay = lazyWithRetry(() => import('../../pages/Quote/CustomerPay'))
const CustomerInfo = lazyWithRetry(() => import('../../pages/Quote/CustomerInfo'))
const Summary = lazyWithRetry(() => import('../../pages/Quote/Summary'))
const BillSummary = lazyWithRetry(() => import('../../pages/Quote/BillSummary'))
const DeluxePayment = lazyWithRetry(() => import('../../pages/Quote/DeluxePayment'))
const Quote = lazyWithRetry(() => import('../../pages/Quote'))
const Collect = lazyWithRetry(() => import('../../pages/Collect'))
const CollectSearch = lazyWithRetry(() => import('../../pages/Collect/Search'))
const CustomerBills = lazyWithRetry(() => import('../../pages/Collect/CustomerBills'))
const CustomerSummary = lazyWithRetry(() => import('../../pages/Collect/CustomerSummary'))
const CollectPayment = lazyWithRetry(() => import('../../pages/Collect/Payment'))
const ChangesDue = lazyWithRetry(() => import('../../pages/Collect/ChangesDue'))
const CollectSuccess = lazyWithRetry(() => import('../../pages/Collect/Success'))
const CollectError = lazyWithRetry(() => import('../../pages/Collect/Error'))
const Manage = lazyWithRetry(() => import('../../pages/Manage'))
const FlowTest = lazyWithRetry(() => import('../../pages/FlowTest'))
const NotFound = lazyWithRetry(() => import('../../pages/NotFound'))

const router = createBrowserRouter([
    {
        path: "/",
        element: <LayoutProvider />,
        errorElement: <RouteError />,
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
                path: "flow-test",
                element: <AuthenticationWrapper>
                    <FlowTest />
                </AuthenticationWrapper>,
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
                                path: 'deluxe-payment',
                                element: <DeluxePayment />
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
            },
            {
                path: "404",
                element: <NotFound />,
            },
            {
                path: "*",
                element: <Navigate to='/404' replace />,
            }
        ]
    },


]);


export default router
