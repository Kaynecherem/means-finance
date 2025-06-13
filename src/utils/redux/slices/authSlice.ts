import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { cloneDeep } from "lodash";
import { Roles } from "../../enums/common";
import { Agency, User } from "../../types/common";

type AuthReducer = {
    isLoggedIn: boolean,
    user?: User
    agency?: Agency | null
    role?: Roles
}
const authReducerInitialState: AuthReducer = {
    isLoggedIn: false
}
export const authSlice = createSlice({
    name: 'auth',
    initialState: cloneDeep(authReducerInitialState),
    reducers: {
        agencyLoginAction(state, action: PayloadAction<{
            user: User, agency: Agency
        }>) {
            return {
                ...state,
                isLoggedIn: true,
                user: action.payload.user,
                agency: action.payload.agency,
                role: Roles.AGENCY
            }
        },
        customerLoginAction(state, action: PayloadAction<{
            user: User
        }>) {
            return {
                ...state,
                isLoggedIn: true,
                user: action.payload.user,
                agency: null,
                role: Roles.CLIENT
            }
        },
        updateUser(state, action: PayloadAction<User>) {
            return {
                ...state,
                user: {
                    ...state.user,
                    ...action.payload
                }
            }
        },
        logoutAction() {
            return cloneDeep(authReducerInitialState)
        },
    },
});

export const { agencyLoginAction, customerLoginAction, updateUser, logoutAction } = authSlice.actions;
export default authSlice.reducer;
