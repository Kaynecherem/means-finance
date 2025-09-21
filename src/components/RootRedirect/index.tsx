import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import getDefaultRoute from "../../utils/helpers/getDefaultRoute";
import { RootState } from "../../utils/redux/store";

const RootRedirect = () => {
    const isLoggedIn = useSelector(({ auth }: RootState) => auth.isLoggedIn)
    const role = useSelector(({ auth }: RootState) => auth.role)

    const target = isLoggedIn ? getDefaultRoute(role) : '/login'

    return <Navigate to={target} replace />
}

export default RootRedirect
