import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { UserData } from "../../types";
import { useLocation } from "react-router-dom";

export default function editUser() {

    const [userData, setUserDta] = useState<UserData>({} as UserData);

    const location = useLocation();

    // gets the state from the state object passed from the previous page
    useEffect(() => {
        if (location.state) setUserDta(location.state.userData);
    }, [location]);


    return (
        <Box m="20px">
            <div className='mb-4'>
                <h1 className="text-3xl font-bold">Edit User</h1>
                <h4 className="text-l font-semibold mt-3 ml-0.5">Edit user data</h4>
            </div>
            {
                JSON.stringify(userData)
            }
        </Box>
    )
}
