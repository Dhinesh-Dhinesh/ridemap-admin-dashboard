import CircularProgress from '@mui/material/CircularProgress';

//~ React router dom
import { NavLink, Outlet } from 'react-router-dom'

//~ Redux
import { useAppSelector } from '../redux/hooks';

const ProtectedRoute = () => {
    const { user, loading } = useAppSelector((state) => state.auth);

    if (loading) return <div className='flex justify-center items-center h-screen'><CircularProgress /></div>

    // show unauthorized screen if no user is found in redux store
    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-green-600 to-blue-600 w-full">
                <div className="unauthorized bg-white rounded-lg p-8 shadow-lg text-center">
                    <h1 className="text-5xl font-extrabold text-red-600 mb-4">Unauthorized :(</h1>
                    <p className="text-lg text-gray-800 mb-6">
                        Please log in to gain access.
                    </p>
                    <NavLink to="/" className="text-white bg-blue-600 hover:bg-blue-700 rounded-lg px-8 py-3 text-lg font-semibold">
                        Log In
                    </NavLink>
                </div>
            </div>
        )
    }

    // returns child route elements
    return <Outlet />
}
export default ProtectedRoute;