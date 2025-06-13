import { message } from 'antd';
import { MenuItemType } from 'antd/es/menu/interface';
import { useCallback, useMemo, useState } from "react";
import { LuDollarSign, LuList, LuLogOut, LuMenu, LuTag, LuUser } from 'react-icons/lu';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useMatches, useNavigate } from 'react-router-dom';
import Logo from "../../assets/images/Logo.png";
import { logout } from '../../utils/apis/directus';
import { Roles } from '../../utils/enums/common';
import { logoutAction } from '../../utils/redux/slices/authSlice';
import { resetCollect } from '../../utils/redux/slices/collectSlice';
import { resetQuote } from '../../utils/redux/slices/quoteSlice';
import { RootState } from '../../utils/redux/store';
import { InternalErrors } from '../../utils/types/errors';
import { useDirectUs } from '../DirectUs/DirectusContext';
import FormIcon from "../Form/FormIcon";
import { AppLogo, AuthButton, LeftNavigation, MainMenu, MenuButton, ProfileButton, StyledHeader } from './style';
const Header: React.FC = () => {
    const { directusClient } = useDirectUs();
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const routeMatches = useMatches()
    const isLoggedIn = useSelector(({ auth }: RootState) => auth.isLoggedIn)
    const profileName = useSelector(({ auth }: RootState) => auth.role === Roles.AGENCY ? auth.agency?.agencyName : `${auth.user?.firstName} ${auth.user?.lastName}`)
    const role = useSelector(({ auth }: RootState) => auth.role)
    const [logoutInProgress, setLogoutInProgress] = useState(false)
    const handleLogout = useCallback(async () => {
        try {
            setLogoutInProgress(true)
            await logout(directusClient)
            dispatch(resetQuote())
            dispatch(resetCollect())
            dispatch(logoutAction())
            navigate('/login')
        } catch (error) {
            message.error((error as InternalErrors).message)
        } finally {
            setLogoutInProgress(false)
        }
    }, [directusClient, dispatch, navigate])

    const selectedMenuItem = useMemo(() => {
        switch (routeMatches[1]?.pathname) {
            case "/agency/quote":
                return 'quote';
            case "/agency/collect":
                return 'collect';
            case "/agency/manage":
                return 'manage';
            case "/my-bills":
                return 'my-bills';
            default:
                return '';
        }
    }, [routeMatches])

    const loggedInAgencyMenuItem: MenuItemType[] = useMemo(() => [
        {
            key: 'quote',
            label: <Link to={'/agency/quote/bill-type'}>Quote</Link>,
            icon: <LuTag />,
        },
        {
            key: 'collect',
            label: <Link to={'/agency/collect/search'}>Collect</Link>,
            icon: <LuDollarSign />,
        },
        {
            key: 'manage',
            label: <Link to={'/agency/manage'}>Manage</Link>,
            icon: <LuList />,
        }

    ], [])

    const loggedInCustomerMenuItem: MenuItemType[] = useMemo(() => [
        {
            key: 'my-bills',
            label: <Link to={'/my-bills'}>My bills</Link>,
            icon: <LuDollarSign />,
        },
    ], [])

    const loggedInMenuItem = useMemo(
        () => role === Roles.AGENCY ?
            loggedInAgencyMenuItem :
            loggedInCustomerMenuItem,
        [loggedInAgencyMenuItem, loggedInCustomerMenuItem, role]
    )


    const loggedInMobileMenuItem: MenuItemType[] = useMemo(() => [
        {
            key: 'profile',
            label: <Link to={role === Roles.AGENCY ? '/agency/profile' : '/profile'}>{profileName}</Link>,
            icon: <LuUser />
        },
        {
            key: 'logout',
            label: `Logout`,
            icon: <LuLogOut />,
            onClick: handleLogout
        }
    ], [handleLogout, profileName, role])

    return (
        <StyledHeader>
            <AppLogo src={Logo} alt='logo' />
            {isLoggedIn &&
                <>
                    <MainMenu
                        mode="horizontal"
                        items={loggedInMenuItem}
                        selectable={false}
                        activeKey={selectedMenuItem}
                    />
                    <LeftNavigation>
                        <ProfileButton type='link' to={role === Roles.AGENCY ? '/agency/profile' : '/profile'}>
                            <FormIcon icon={<LuUser />} /> {profileName}
                        </ProfileButton>
                        <AuthButton type='link' onClick={handleLogout} icon={<LuLogOut />} iconPosition='end' loading={logoutInProgress}>
                            Logout
                        </AuthButton>
                        <MenuButton placement='bottomRight' trigger={['click']} menu={{ items: [...loggedInMenuItem, ...loggedInMobileMenuItem], activeKey: 'quote' }}>
                            <LuMenu />
                        </MenuButton>
                    </LeftNavigation>
                </>
            }
            {
                !isLoggedIn &&
                <LeftNavigation>
                    <AuthButton type='link' onClick={() => navigate('/login')}>
                        Login
                    </AuthButton>
                </LeftNavigation>
            }
        </StyledHeader>
    );
}

export default Header;
