import { Suspense } from "react"
import { Outlet } from "react-router-dom"
import BoxContainer from "../../components/BoxContainer"
import { LoadingSpinner } from "../../components/LoadingSpinner"

const Collect = () => {
    return (
        <BoxContainer>
            <Suspense fallback={<LoadingSpinner fullScreen />}>
                <Outlet />
            </Suspense>
        </BoxContainer>
    )
}

export default Collect
