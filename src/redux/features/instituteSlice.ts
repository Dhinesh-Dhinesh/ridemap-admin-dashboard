// Redux
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Actions
import { getInstituteAdmins, getInstituteDepartments, getInstituteBusses } from './actions/instituteActions';

// &Types
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Departments, Admins } from '../../types';

type initialStateType = {
    busses: string[] | null,
    departments: Departments,
    admins: {
        data: Admins[] | null,
        loading: boolean,
    }
}

//* initial state
const initialState: initialStateType = {
    busses: null,
    departments: null,
    admins: {
        data: null,
        loading: false,
    }
}

//* slice
export const instituteSlice = createSlice({
    name: 'institute',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // getAdmins
        builder.addCase(getAdmins.pending, (state) => {
            state.admins.loading = true;
        })
        builder.addCase(getAdmins.fulfilled, (state, action: PayloadAction<Admins[]>) => {
            state.admins.data = action.payload;
            state.admins.loading = false;
        })
        builder.addCase(getAdmins.rejected, (state) => {
            state.admins.loading = false;
        })
        // getDepartments
        builder.addCase(getDepartments.fulfilled, (state, action: PayloadAction<Departments>) => {
            state.departments = action.payload;
        })
        // getBusses
        builder.addCase(getBusses.fulfilled, (state, action: PayloadAction<string[] | null>) => {
            state.busses = action.payload;
        })
    }
});

//* actions
export const getAdmins = createAsyncThunk('institute/getAdmins', async (institute: string) => {
    try {
        const data = await getInstituteAdmins(institute);
        return data;
    } catch (error) {
        console.log(error);
        throw error;
    }
});

export const getDepartments = createAsyncThunk('institute/getDepartments', async (institute: string) => {
    try {
        const data = await getInstituteDepartments(institute);
        return data;
    } catch (error) {
        console.log(error);
        throw error;
    }
});

export const getBusses = createAsyncThunk('institute/getBusses', async (institute: string) => {
    try {
        const data = await getInstituteBusses(institute);
        return data;
    } catch (error) {
        console.log(error);
        throw error;
    }
});

//* reducer
export default instituteSlice.reducer;