import { Box } from "@mui/material"
import { BaseButton } from "../../components/BaseButton";
import { useNavigate } from "react-router-dom";


// MUI
import { DataGrid, GridActionsCellItem, GridColDef, GridToolbar } from '@mui/x-data-grid';
import LinearProgress from '@mui/material/LinearProgress';
import EditIcon from '@mui/icons-material/Edit';

// custom mui
import CustomNoRowsOverlay from "../../components/CustomNoOverlay";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { shallowEqual } from "react-redux";
import { useEffect } from "react";
import { getUsers } from "../../redux/features/instituteSlice";
import { UserData } from "../../types";

// util
import { customSortComparator } from "../../util/customSortComparator";

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

  const handleEditClick = (data: UserData) => {
    console.log(data);
    navigate("/edit-user", {
      state: {
        userData: data
      }
    })
  }

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
    { field: 'createdAt', headerName: 'Created At', minWidth: 180, sortComparator: (v1, v2) => customSortComparator(v1, v2) },
    { field: 'lastLoginAt', headerName: 'Last Login At', minWidth: 120, sortComparator: (v1, v2) => customSortComparator(v1, v2) },
    {
      field: 'edit', headerName: "Edit", minWidth: 80, type: 'actions',
      getActions: ({ row }) => {
        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={(_e) => handleEditClick(row)}
            color="inherit"
          />
        ]
      }
    }
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
            toolbar: GridToolbar
          }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
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

export default User;