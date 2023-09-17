import { Box, LinearProgress } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { BaseButton } from '../../components/BaseButton'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { useAppSelector } from '../../redux/hooks'
import { db } from '../../firebase'
import { UserData } from '../../types'
import { useEffect, useState } from 'react'
import { extractYearAndMonth, formatTimestamp } from '../../util/dateFormatter'
import { DataGrid, GridColDef, GridToolbarColumnsButton, GridToolbarContainer, GridToolbarDensitySelector, GridToolbarExport, GridToolbarFilterButton, GridToolbarQuickFilter } from '@mui/x-data-grid'
import CustomNoRowsOverlay from '../../components/CustomNoOverlay'

const BusUsers = () => {

    const { busId } = useParams()
    const navigate = useNavigate()

    const institute = useAppSelector(state => state.auth.user?.institute)
    const [busUserData, setBusUserData] = useState<UserData[] | null>(null)
    const [loading, setLoading] = useState<boolean>(false)

    const columns: GridColDef[] = [
        { field: 'name', headerName: 'Name', minWidth: 150 },
        { field: 'fatherName', headerName: 'Father Name', minWidth: 150 },
        { field: 'enrollNo', headerName: 'Enroll No', minWidth: 120 },
        { field: 'department', headerName: 'Department', minWidth: 120 },
        { field: 'emailOrPhone', headerName: 'Email/Phone', minWidth: 250 },
        { field: 'phone', headerName: 'Phone', minWidth: 100 },
        { field: 'gender', headerName: 'Gender', minWidth: 80 },
        { field: 'city', headerName: 'City', minWidth: 100 },
        { field: 'busStop', headerName: 'Bus Stop', minWidth: 170 },
        { field: 'busNo', headerName: 'Bus No', minWidth: 120 },
        { field: 'address', headerName: 'Address', minWidth: 200 },
        { field: 'validUpto', headerName: 'Valid Up To', minWidth: 120 },
        { field: 'createdAt', headerName: 'Created At', minWidth: 180 },
        { field: 'lastLoginAt', headerName: 'Last Login At', minWidth: 120 }
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
                            sortModel: [{ field: 'createdAt', sort: 'desc' }]
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