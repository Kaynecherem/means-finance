import React, { PropsWithChildren } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { Roles } from "../../utils/enums/common";
import { RootState } from "../../utils/redux/store";

const AuthenticationWrapper: React.FC<PropsWithChildren<{
    role?: Roles
}>> = ({ children, role = Roles.CLIENT }) => {
    const isLoggedIn = useSelector(({ auth }: RootState) => auth.isLoggedIn)
    const loggedInRole = useSelector(({ auth }: RootState) => auth.role)

    if (isLoggedIn) {
        if (loggedInRole === role) {
            return <>{children}</>
        }
        return <Navigate replace to='/404' />
    }
    return <Navigate to="/login" replace />
}

export default AuthenticationWrapper
