import React, { PropsWithChildren, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { Roles } from "../../utils/enums/common";
import { RootState } from "../../utils/redux/store";
import { agencyLoginAction, customerLoginAction } from "../../utils/redux/slices/authSlice";
import { useDirectUs } from "../DirectUs/DirectusContext";
import { getLoggedInUser } from "../../utils/apis/directus/index";

const AuthenticationWrapper: React.FC<PropsWithChildren<{
    role?: Roles
}>> = ({ children, role = Roles.CLIENT }) => {
    const dispatch = useDispatch()
    const { directusClient } = useDirectUs();
    const isLoggedIn = useSelector(({ auth }: RootState) => auth.isLoggedIn)
    const loggedInRole = useSelector(({ auth }: RootState) => auth.role)

    useEffect(() => {
        const autoLogin = async () => {
            const authData = localStorage.getItem('authenticationData')
            if (!authData) {
                return
            }
            try {
                const { agency, user, role: userRole } = await getLoggedInUser(directusClient)
                if (userRole.name === Roles.AGENCY && agency) {
                    dispatch(agencyLoginAction({ user, agency }))
                } else if (userRole.name === Roles.CLIENT) {
                    dispatch(customerLoginAction({ user }))
                }
            } catch {
                // ignore failed auto login
            }
        }
        if (!isLoggedIn) {
            autoLogin()
        }
    }, [isLoggedIn, dispatch, directusClient])

    if (isLoggedIn) {
        if (loggedInRole === role) {
            return <>{children}</>
        }
        return <Navigate replace to='/404' />
    }
    return <Navigate to="/login" replace />
}

export default AuthenticationWrapper
