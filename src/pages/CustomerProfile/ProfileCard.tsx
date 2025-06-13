import { useState } from "react";
import { LuPenSquare, LuPhone, LuUser } from "react-icons/lu";
import { useSelector } from 'react-redux';
import Box from "../../components/Box";
import FormIcon from "../../components/Form/FormIcon";
import { RootState } from '../../utils/redux/store';
import EditProfileModal from "./EditProfileModal";
import { EditProfileButton, ProfileAvatar, ProfileCardWrapper, ProfileName, ProfileNumber } from "./style";

const ProfileCard: React.FC = () => {
    const profileName = useSelector(({ auth }: RootState) => `${auth.user?.firstName} ${auth.user?.lastName}`)
    const phone = useSelector(({ auth }: RootState) => auth.user?.phone)
    const [showEditProfile, setShowEditProfile] = useState(false)
    return (
        <Box>
            <ProfileCardWrapper>
                <ProfileAvatar>
                    <FormIcon icon={<LuUser />} size={'large'} />
                </ProfileAvatar>
                <ProfileName>
                    {profileName}
                </ProfileName>
                <ProfileNumber>
                    <LuPhone /> {phone}
                </ProfileNumber>
                <EditProfileButton icon={<LuPenSquare />} onClick={() => setShowEditProfile(true)}> Edit Profile</EditProfileButton>
            </ProfileCardWrapper>
            <EditProfileModal open={showEditProfile} onClose={() => setShowEditProfile(false)} />
        </Box>
    )
}
export default ProfileCard
