import { Box, Skeleton, TextField } from "@mui/material"
import { styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import { useEffect, useLayoutEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { shallowEqual } from "react-redux";
import { addBusses, addDepartment, deleteBusNo, deleteDepartment, getBusses, getDepartments } from "../../redux/features/instituteSlice";
import { LoadingButton } from "@mui/lab";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

interface ChipData {
    key: number;
    label: string;
}

const ListItem = styled('li')(({ theme }) => ({
    margin: theme.spacing(0.5),
}));

const Settings = () => {

    const [bussesChipData, setBussesChipData] = useState<readonly ChipData[]>();
    const [depChipData, setDepChipData] = useState<readonly ChipData[]>();

    const [bussesInput, setBussesInput] = useState<string>('');
    const [depInput, setDepInput] = useState<string>('');

    const {
        institute, departments, busses,
        addBusLoading, addDepartmentLoading
    } = useAppSelector((state) => {
        return {
            departments: state?.institute?.departments,
            busses: state.institute?.busses,
            institute: state?.auth?.admin?.institute,
            addBusLoading: state.institute?.loadingStates?.busses,
            addDepartmentLoading: state.institute?.loadingStates?.departments,
        }
    },
        shallowEqual
    );

    const dispatch = useAppDispatch();

    const handleDelete = (chipToDelete: ChipData, type: "busses" | "departments") => () => {

        if (type === 'busses') {
            dispatch(deleteBusNo([institute as string, chipToDelete.label]))
        } else if (type === 'departments') {
            dispatch(deleteDepartment([institute as string, chipToDelete.label]))
        }

    };

    // For setting value of departments and busses in chip data
    useLayoutEffect(() => {
        setBussesChipData(busses?.map((bus, index) => {
            return { key: index, label: bus }
        }).sort((a, b) => a.label.localeCompare(b.label)));

        setDepChipData(departments?.map((dep, index) => {
            return { key: index, label: dep }
        }).sort((a, b) => a.label.localeCompare(b.label)));
        setBussesInput('');
        setDepInput('');
    }, [busses, departments])

    // For setting value of departments and busses in redux store from db
    useEffect(() => {
        if (institute) {
            if (!departments) {
                dispatch(getDepartments(institute))
            }
            if (!busses) {
                dispatch(getBusses(institute))
            }
        }
    }, [institute, dispatch]);

    return (
        <Box m="20px">
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <div className='mb-4'>
                    <h1 className="text-3xl font-bold">Settings</h1>
                    <h4 className="text-l font-semibold mt-3 ">Data Administration Center</h4>
                </div>
            </Box>
            <Box>

                {/* Busses */}

                <div className="text-md font-semibold mb-2">Busses : {bussesChipData?.length ? bussesChipData?.length : 0}</div>
                <Paper
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        flexWrap: 'wrap',
                        listStyle: 'none',
                        p: 0.5,
                        m: 0,
                        mb: 2,
                    }}
                    component="ul"
                >
                    {bussesChipData ? bussesChipData.map((data) => {
                        return (
                            <ListItem key={data.key}>
                                <Chip
                                    label={data.label}
                                    onDelete={handleDelete(data, "busses")}
                                />
                            </ListItem>
                        );
                    }) :
                        [...Array(40)].map((key) => (
                            <ListItem key={key}>
                                <Skeleton variant="rounded" width={100} height={32} sx={{
                                    borderRadius: "1rem",
                                }} />
                            </ListItem>
                        ))

                    }
                </Paper>
                <TextField
                    id="outlined-basic"
                    autoComplete="off"
                    label="Add Busses"
                    variant="outlined"
                    onChange={(e) => { setBussesInput(e.target.value.toUpperCase()) }}
                    value={bussesInput}
                />
                <LoadingButton
                    sx={{ p: "1rem", ml: "1rem" }}
                    color="primary"
                    onClick={() => dispatch(addBusses([institute as string, bussesInput]))}
                    loading={addBusLoading}
                    loadingPosition="start"
                    startIcon={<AddCircleOutlineIcon />}
                    variant="contained"
                >
                    <span>Add</span>
                </LoadingButton>

                {/* Departments */}

                <div className="text-md font-semibold mb-2 mt-8">Departments</div>
                <Paper
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        flexWrap: 'wrap',
                        listStyle: 'none',
                        p: 0.5,
                        m: 0,
                        mb: 2,
                    }}
                    component="ul"
                >
                    {depChipData ? depChipData.map((data) => {
                        return (
                            <ListItem key={data.key}>
                                <Chip
                                    label={data.label}
                                    onDelete={handleDelete(data, "departments")}
                                />
                            </ListItem>
                        );
                    }) :
                        [...Array(40)].map((key) => (
                            <ListItem key={key}>
                                <Skeleton variant="rounded" width={100} height={32} sx={{
                                    borderRadius: "1rem",
                                }} />
                            </ListItem>
                        ))
                    }
                </Paper>
                <TextField
                    id="outlined-basic"
                    label="Add Departments"
                    autoComplete="off"
                    variant="outlined"
                    onChange={(e) => { setDepInput(e.target.value.toUpperCase()); }}
                    value={depInput}
                />
                <LoadingButton
                    sx={{ p: "1rem", ml: "1rem" }}
                    color="primary"
                    onClick={() => dispatch(addDepartment([institute as string, depInput]))}
                    loading={addDepartmentLoading}
                    loadingPosition="start"
                    startIcon={<AddCircleOutlineIcon />}
                    variant="contained"
                >
                    <span>Add</span>
                </LoadingButton>
            </Box>
        </Box>
    )
}

export default Settings;