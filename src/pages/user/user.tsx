import { Box } from "@mui/material"
import { BaseButton } from "../../components/BaseButton";
import { useNavigate } from "react-router-dom";


// MUI
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import LinearProgress from '@mui/material/LinearProgress';

// custom mui
import CustomNoRowsOverlay from "../../components/CustomNoOverlay";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { shallowEqual } from "react-redux";
import { useEffect } from "react";
import { getUsers } from "../../redux/features/instituteSlice";
import { UserData } from "../../types";

const User = () => {

  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  // redux
  const { userDataGridLoading, usersData, institute } = useAppSelector((state) => {
    return {
      userDataGridLoading: state?.institute?.users?.loading,
      usersData: state?.institute?.users?.data,
      institute: state?.auth?.admin?.institute,
    }
  },
    shallowEqual
  )

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

  useEffect(() => {
    if (institute) {
      if (!usersData) {
        dispatch(getUsers(institute));
      }
    }
  }, [institute, dispatch]);

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <div className='mb-4'>
          <h1 className="text-3xl font-bold">Users</h1>
          <h4 className="text-l font-semibold mt-3 ml-0.5">User profiles</h4>
        </div>
        <BaseButton onClick={() => navigate("/create-user")}>
          Create user
        </BaseButton>
      </Box>

      {/* user profile data grid*/}
      <Box m="8px 0 0 0" height="80vh">
        <DataGrid
          loading={userDataGridLoading}
          rows={usersData as UserData[] || []}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 20 },
            },
            sorting: {
              sortModel: [{ field: 'createdAt', sort: 'desc' }]
            }
          }}

          slots={{
            loadingOverlay: LinearProgress,
            noRowsOverlay: CustomNoRowsOverlay,
          }}
          pageSizeOptions={[5, 10, 20, 50, 100]}
          disableRowSelectionOnClick
          disableColumnSelector
        />
      </Box>
    </Box>
  )
}

export default User;