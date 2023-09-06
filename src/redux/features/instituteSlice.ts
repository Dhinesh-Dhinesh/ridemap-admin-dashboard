// Redux
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Actions
import { getInstituteAdmins, getInstituteDepartments, getInstituteBusses, addInstituteBusNo, addInstituteDepartment, deleteInstituteBusNo, deleteInstituteDepartment } from './actions/instituteActions';

// &Types
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Departments, Admins } from '../../types';

type initialStateType = {
    busses: string[] | null,
    loadingStates: {
        busses: boolean,
        departments: boolean
    }
    departments: Departments,
    admins: {
        data: Admins[] | null,
        loading: boolean,
    }
}

//* initial state
const initialState: initialStateType = {
    busses: null,
    loadingStates: {
        busses: false,
        departments: false
    },
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
        // add BusNO
        builder.addCase(addBusses.pending, (state) => {
            state.loadingStates.busses = true;
        })
        builder.addCase(addBusses.fulfilled, (state, action: PayloadAction<string | null>) => {
            if (action.payload !== null && state.busses !== null) {
                if (!state.busses.includes(action.payload)) {
                    state.busses = [...state.busses, action.payload];
                }
            } else if (action.payload !== null && state.busses === null) {
                state.busses = [action.payload];
            }
            state.loadingStates.busses = false;
        })
        builder.addCase(addBusses.rejected, (state) => {
            state.loadingStates.busses = false;
        })
        // delete busNo
        builder.addCase(deleteBusNo.fulfilled, (state, action: PayloadAction<string | null>) => {
            if (action.payload !== null && state.busses !== null) {
                state.busses = state.busses.filter(busNo => busNo !== action.payload);
            }
        })
        // add Department
        builder.addCase(addDepartment.pending, (state) => {
            state.loadingStates.departments = true;
        })
        builder.addCase(addDepartment.fulfilled, (state, action: PayloadAction<string | null>) => {
            if (action.payload !== null && state.departments !== null) {
                if (!state.departments.includes(action.payload)) {
                    state.departments = [...state.departments, action.payload];
                }
            } else if (action.payload !== null && state.departments === null) {
                state.departments = [action.payload];
            }
            state.loadingStates.departments = false;
        })
        builder.addCase(addDepartment.rejected, (state) => {
            state.loadingStates.departments = false;
        })
        // delete Department
        builder.addCase(deleteDepartment.fulfilled, (state, action: PayloadAction<string | null>) => {
            if (action.payload !== null && state.departments !== null) {
                state.departments = state.departments.filter(department => department !== action.payload);
            }
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

export const addBusses = createAsyncThunk('institute/addBusses', async ([institute, busses]: [institute: string, busses: string]) => {
    try {
        const data = await addInstituteBusNo(institute, busses);
        return data;
    } catch (error) {
        console.log(error);
        throw error;
    }
});

export const deleteBusNo = createAsyncThunk('institute/deleteBusses', async ([institute, busses]: [institute: string, busses: string]) => {
    try {
        const data = await deleteInstituteBusNo(institute, busses);
        return data;
    } catch (error) {
        console.log(error);
        throw error;
    }
});

export const addDepartment = createAsyncThunk('institute/addDepartment', async ([institute, department]: [institute: string, department: string]) => {
    try {
        const data = await addInstituteDepartment(institute, department);
        return data;
    } catch (error) {
        console.log(error);
        throw error;
    }
});

export const deleteDepartment = createAsyncThunk('institute/deleteDepartment', async ([institute, department]: [institute: string, department: string]) => {
    try {
        const data = await deleteInstituteDepartment(institute, department);
        return data;
    } catch (error) {
        console.log(error);
        throw error;
    }
});

//* reducer
export default instituteSlice.reducer;