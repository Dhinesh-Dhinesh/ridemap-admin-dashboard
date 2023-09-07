import { useEffect, useState } from "react";
import useApi from "../../util/api";

// Mui
import Box from "@mui/material/Box"
import { DataGrid, GridColDef, GridPagination, GridRowParams } from '@mui/x-data-grid';
import LinearProgress from '@mui/material/LinearProgress';
import LoadingButton from '@mui/lab/LoadingButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { Alert } from "@mui/material";
// custom mui
import CustomNoRowsOverlay from '../../components/CustomNoOverlay'
import SnackBar from '../../components/SnackBar';
import { BaseButton } from "../../components/BaseButton"

// Redux
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { shallowEqual } from "react-redux";
import { getAdmins } from "../../redux/features/instituteSlice";

//& Types
import type { Admins } from "../../types";

import { useNavigate } from "react-router-dom";

type snackBar = {
  open: boolean;
  message: string;
  severity: "success" | "error" | "info" | "warning" | undefined;
  isReload?: boolean;
}

const Admin = () => {

  const [selectedRows, setSelectedRows] = useState<Admins[]>([]);
  const [snackBar, setSnackBar] = useState<snackBar>({
    open: false,
    message: "",
    severity: undefined,
    isReload: false
  });

  const navigate = useNavigate()

  // Redux
  const dispatch = useAppDispatch();
  const { adminDatas, institute, userId, isAdminDataLoading } = useAppSelector((state) => {
    return {
      adminDatas: state?.institute?.admins?.data,
      institute: state?.auth?.admin?.institute,
      userId: state?.auth?.admin?.userId,
      isAdminDataLoading: state?.institute?.admins?.loading
    }
  },
    shallowEqual
  );

  /* 
    ** Get admin data from firestore if data is not in redux store and dispatch to redux store
    ** Note: The filter skips the document which has isHided field true
  */
  useEffect(() => {
    if (institute) {
      if (snackBar.isReload || !adminDatas) {
        dispatch(getAdmins(institute));
      }
    }
  }, [institute, dispatch, snackBar.isReload]);

  const rows = adminDatas || [];

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 50 },
    { field: 'name', headerName: 'Name', width: 180 },
    { field: 'email', headerName: 'Email', width: 260 },
    { field: 'userId', headerName: 'User Id', width: 300 },
    { field: 'phone', headerName: 'Phone', width: 150 },
    { field: 'createdAt', headerName: 'Created At', width: 180 },
    { field: 'lastLoginAt', headerName: 'Last Login At', width: 180 }
  ];

  return (
    <Box m="20px">
      {/* Headder */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <div className='mb-4'>
          <h1 className="text-3xl font-bold">Admin</h1>
          <h4 className="text-l font-semibold mt-3 ml-0.5">Users and Permissions</h4>
        </div>
        {/* <Button variant="contained"> */}
        <BaseButton onClick={() => navigate("/create-admin")}>Create Admin</BaseButton>
        {/* </Button> */}
      </Box>

      {/* admin accounts data grid*/}
      <Box m="8px 0 0 0" height="80vh">
        <DataGrid
          loading={isAdminDataLoading}
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 20 },
            },
          }}
          slots={{
            loadingOverlay: LinearProgress,
            noRowsOverlay: CustomNoRowsOverlay,
            footer: () => Footer(selectedRows.length, selectedRows, institute as string, setSnackBar)
          }}
          pageSizeOptions={[5, 10, 20]}
          checkboxSelection
          disableRowSelectionOnClick
          isRowSelectable={(params: GridRowParams) => params.row.userId !== userId}
          onRowSelectionModelChange={(ids) => {
            const selectedIDs = new Set(ids);
            const selectedRowData = rows.filter((row) =>
              selectedIDs.has(row.id)
            );
            setSelectedRows(selectedRowData);
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

export default Admin;

// Data Grid Footer
function Footer(selectedRowsLength: number, selectedRows: Admins[], institute: string, setSnackBar: React.Dispatch<React.SetStateAction<snackBar>>) {

  const api = useApi()
  const emails: string[] = selectedRows.map((row) => row.email.trim());
  const [loading, setLoading] = useState(false);

  const deleteAdmin = () => {

    setLoading(true)

    const data = {
      emails,
      institute
    }

    api.post("admin/delete", data).then(data => {
      console.log(data)
      setSnackBar({
        open: true,
        message: "Admin deleted successfully",
        severity: "success",
        isReload: true
      })
    }).catch(err => {
      console.log(err)
      setSnackBar({
        open: true,
        message: "Something went wrong",
        severity: "error"
      })
    }).finally(() => {
      setLoading(false)
      setTimeout(() => {
        setSnackBar((prev) => ({ ...prev, open: false, isReload: false }))
      }, 1000);
    })

  }


  return (
    <div className="flex justify-between items-center">
      {selectedRowsLength > 0 ? (
        <div className="flex items-center ml-3">
          <p className="text-sm mr-5 max-md:text-xs max-md:mr-1">Selected rows: {selectedRowsLength}</p>
          <LoadingButton
            color="error"
            onClick={deleteAdmin}
            loading={loading}
            loadingPosition="start"
            startIcon={<DeleteIcon />}
            variant="contained"
          >
            <span>Delete</span>
          </LoadingButton>
        </div>
      ) :
        <div className="flex items-center ml-3">
          <p className="text-sm">&nbsp;</p>
        </div>
      }
      <GridPagination />
    </div>
  )
}