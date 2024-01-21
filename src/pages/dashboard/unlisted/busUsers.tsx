import { Alert, Autocomplete, AutocompleteRenderInputParams, Box, LinearProgress, TextField } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { BaseButton } from '../../../components/BaseButton'
import { collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore'
import { useAppDispatch, useAppSelector } from '../../../redux/hooks'
import { db } from '../../../firebase'
import { UserData } from '../../../types'
import { useEffect, useState } from 'react'
import { extractYearAndMonth, formatTimestamp } from '../../../util/dateFormatter'
import { DataGrid, GridColDef, GridToolbarColumnsButton, GridToolbarContainer, GridToolbarDensitySelector, GridToolbarExport, GridToolbarFilterButton, GridToolbarQuickFilter } from '@mui/x-data-grid'
import CustomNoRowsOverlay from '../../../components/CustomNoOverlay'
import { shallowEqual } from 'react-redux'
import { getBusses, removeBusUserCount, removeUserRecords } from '../../../redux/features/instituteSlice'
import SnackBar from '../../../components/SnackBar'

import type { snackBar } from '../../../types'
import { customSortComparator } from '../../../util/customSortComparator'
import EditIcon from '@mui/icons-material/Edit';

const BusUsers = () => {

    const { busId } = useParams()
    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    const { institute, busses } = useAppSelector(state => {
        return {
            institute: state.auth.user?.institute,
            busses: state.institute?.busses
        }
    },
        shallowEqual
    )

    const [busUserData, setBusUserData] = useState<UserData[] | null>(null)
    const [loading, setLoading] = useState<boolean>(false)

    const [snackBar, setSnackBar] = useState<snackBar>({
        open: false,
        message: "",
        severity: undefined
    });

    const updateBusNo = async (institute: string, uid: string, busNo: string) => {

        // ignores if the changed bus no is same
        if (busId === busNo) return;

        // User document reference
        const userDocRef = doc(db, `institutes/${institute}/users`, uid);

        // Updating busNo field
        try {

            // ignore busNo if not in the busses array
            if (!busses?.includes(busNo)) {
                setSnackBar({
                    open: true,
                    message: "Please choose a correct bus number",
                    severity: "warning",
                })

                setTimeout(() => {
                    setSnackBar((prev) => ({ ...prev, open: false }));
                }, 1000);

                return
            };

            // update on ui
            await updateDoc(userDocRef, { busNo })

            // updating ui
            if (busUserData !== null) {
                // Use the filter method to create a new array without the object with the specified uid
                const updatedBusUserData = busUserData.filter((userData) => userData.id !== uid);

                // Set the updated array back to busUserData
                setBusUserData(updatedBusUserData);

                setSnackBar({
                    open: true,
                    message: "Bus number updated",
                    severity: "success",
                })

                setTimeout(() => {
                    setSnackBar((prev) => ({ ...prev, open: false }));
                }, 1000);

                // Clear user Records for get the updated datas
                dispatch(removeUserRecords())

                // clear busCount data from dashboard page for get the latest count
                dispatch(removeBusUserCount())
            }
        } catch (err) {
            console.log(err)

            setSnackBar({
                open: true,
                message: "Error occured while update",
                severity: "error",
            })

            setTimeout(() => {
                setSnackBar((prev) => ({ ...prev, open: false }));
            }, 1000);
        }
    }

    useEffect(() => {
        if (institute) {
            if (!busses) {
                dispatch(getBusses(institute));
            }
        }
    }, [busses])

    const columns: GridColDef[] = [
        { field: 'name', headerName: 'Name', minWidth: 150 },
        { field: 'fatherName', headerName: 'Father Name', minWidth: 150 },
        { field: 'enrollNo', headerName: 'Enroll No', minWidth: 120 },
        { field: 'department', headerName: 'Department', minWidth: 120 },
        { field: 'busStop', headerName: 'Bus Stop', minWidth: 170 },
        // Editable busNo filed from busses on specified institute in db
        {
            field: 'busNo', headerName: 'Bus No', width: 120, editable: true,
            renderHeader: (params) => (
                <div className="flex items-center">
                    <div>{params.colDef.headerName}</div>
                    <div className="ml-2">
                        <EditIcon style={{ fontSize: 16, color: "gray" }} />
                    </div>
                </div>
            ),
            renderEditCell: (params) => {

                let userId: string = params.row.id;
                let inputValue: string | null = null;

                const handleInputChange = (
                    _event: React.ChangeEvent<{}>,
                    newValue: string | null
                ) => {
                    if (newValue !== null) {
                        inputValue = newValue;
                    }
                };

                const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = async (event) => {
                    if (event.key === 'Enter') {
                        await updateBusNo(institute as string, userId, inputValue as string);
                    }
                };

                return (
                    <Autocomplete
                        fullWidth
                        disablePortal
                        id="combo-box-demo"
                        options={busses as string[] || []}
                        renderInput={(params: AutocompleteRenderInputParams) => <TextField {...params} />}
                        onInputChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        value={inputValue}
                    />
                )
            }
        },
        { field: 'emailOrPhone', headerName: 'Email/Phone', minWidth: 250 },
        { field: 'phone', headerName: 'Phone', minWidth: 100 },
        { field: 'gender', headerName: 'Gender', minWidth: 80 },
        { field: 'city', headerName: 'City', minWidth: 100 },
        { field: 'address', headerName: 'Address', minWidth: 200 },
        { field: 'validUpto', headerName: 'Valid Up To', minWidth: 120 },
        { field: 'createdAt', headerName: 'Created At', minWidth: 180, sortComparator: (v1, v2) => customSortComparator(v1, v2) },
        { field: 'lastLoginAt', headerName: 'Last Login At', minWidth: 120, sortComparator: (v1, v2) => customSortComparator(v1, v2) }
    ];

    const getBusUsersData = async () => {
        setLoading(true)

        const usersCollection = collection(db, `institutes/${institute as string}/users`);
        const q = query(usersCollection, where('busNo', '==', busId));

        try {
            const snapshot = await getDocs(q);

            const data: UserData[] = snapshot.docs.map((doc) => {
                return {
                    id: doc.id,
                    name: doc.data().name,
                    fatherName: doc.data().fatherName,
                    enrollNo: doc.data().enrollNo,
                    department: doc.data().department,
                    emailOrPhone: doc.data().emailOrPhone,
                    phone: doc.data().phone,
                    gender: doc.data().gender,
                    city: doc.data().city,
                    busStop: doc.data().busStop,
                    busNo: doc.data().busNo,
                    address: doc.data().address,
                    validUpto: doc.data()?.validUpto ? extractYearAndMonth(doc.data()?.validUpto) : '',
                    createdAt: doc.data()?.createdAt ? formatTimestamp(doc.data()?.createdAt.toDate()) : null,
                    lastLoginAt: doc.data()?.lastLoginAt ? formatTimestamp(doc.data()?.lastLoginAt.toDate()) : null,
                }
            });

            if (data.length > 0) {
                setBusUserData(data);
            } else {
                setBusUserData(null);
            }

            setLoading(false)
        } catch (error) {
            setLoading(false)
            console.error('Error fetching bus user data:', error);
        }
    }

    useEffect(() => {
        getBusUsersData()
    }, [])

    return (
        <Box m="20px">
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <div className='mb-4'>
                    <h1 className="text-3xl font-bold">Bus Users</h1>
                    <h4 className="text-l font-semibold mt-3 ml-0.5">{busId} has {busUserData ? busUserData.length : 0} users</h4>
                </div>
                <BaseButton onClick={() => navigate("/dashboard")}>
                    Back
                </BaseButton>
            </Box>
            <Box m="8px 0 0 0" height="80vh">
                <DataGrid
                    loading={loading}
                    rows={busUserData || []}
                    columns={columns}
                    pageSizeOptions={[5, 10, 20, 50, 100]}
                    disableRowSelectionOnClick
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 50 },
                        },
                        sorting: {
                            sortModel: [{ field: 'createdAt', sort: 'asc' }]
                        }
                    }}
                    slots={{
                        loadingOverlay: LinearProgress,
                        noRowsOverlay: CustomNoRowsOverlay,
                        toolbar: () => CustomToolbar(busId as string)
                    }}
                    slotProps={{
                        toolbar: {
                            showQuickFilter: true,
                            csvOptions: {
                                exportFileName: 'your_custom_file_name' // Specify your custom export file name here
                            }
                        }
                    }}
                    localeText={{
                        toolbarDensity: 'Size',
                        toolbarDensityLabel: 'Size',
                        toolbarDensityCompact: 'Small',
                        toolbarDensityStandard: 'Medium',
                        toolbarDensityComfortable: 'Large',
                    }}
                />
            </Box>
            <SnackBar isOpen={snackBar.open}>
                <div className="w-full">
                    <Alert severity={snackBar.severity} variant='filled'>{snackBar.message}</Alert>
                </div>
            </SnackBar>
        </Box>
    )
}

function CustomToolbar(busId: string) {
    return (
        <GridToolbarContainer sx={{ display: 'flex', justifyContent: "space-between" }}>
            <Box>
                <GridToolbarColumnsButton />
                <GridToolbarFilterButton />
                <GridToolbarDensitySelector />
                <GridToolbarExport csvOptions={{ fileName: `${busId} users_Ridemap` }} />
            </Box>
            <GridToolbarQuickFilter />
        </GridToolbarContainer>
    );
}

export default BusUsers