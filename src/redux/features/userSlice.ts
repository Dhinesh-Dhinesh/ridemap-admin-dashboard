import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getAdminUserData } from './actions/userActions';

// &Types
import type { PayloadAction } from '@reduxjs/toolkit';
import type { User, AdminData } from '../../types';

type initialStateType = {
    loading: boolean,
    user: User | null,
    admin: AdminData | null,
    isCreateUserLoading: boolean,
}

//* initial state
const initialState: initialStateType = {
    loading: true,
    user: null,
    admin: null,
    isCreateUserLoading: false,
}

//* slice
export const userSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUserData: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
            state.loading = false;
        },
        removeUserData: (state) => {
            state.user = null;
            state.loading = false;
        },
        setAdminData: (state, action: PayloadAction<AdminData>) => {
            state.admin = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getAdminData.fulfilled, (state, action: PayloadAction<AdminData | null>) => {
            state.admin = action.payload;
        });
    }
});

//* actions
export const getAdminData = createAsyncThunk('auth/getAdminData', async ([institute, userId]: [string, string]) => {
    try {
        const data = await getAdminUserData(institute, userId);
        return data;
    } catch (error) {
        console.log(error);
        throw error;
    }
});

//* async actions

export const { setUserData, removeUserData, setAdminData } = userSlice.actions;

//* reducer
export default userSlice.reducer;