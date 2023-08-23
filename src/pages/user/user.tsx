import { Box } from "@mui/material"
import { BaseButton } from "../../components/BaseButton";
import { useNavigate } from "react-router-dom";

const User = () => {

  const navigate = useNavigate()

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
    </Box>
  )
}

export default User;