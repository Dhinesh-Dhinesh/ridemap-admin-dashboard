import { Box, TextField, Typography } from "@mui/material"
import { useState } from "react";
import { UserData } from "../../types";
import { db } from "../../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import NoDataLogo from "./assets/nodata.svg"
import { LoadingButton } from "@mui/lab";
import { extractYearAndMonth, formatTimestamp } from "../../util/dateFormatter";

const SearchUser = () => {

    const [enrollmentNo, setEnrollmentNo] = useState<string>('');
    const [userData, setUserData] = useState<UserData | null | "NODATA">(null);
    const [isSearchLoading, setIsSearchLoading] = useState<boolean>(false);

    const handleSearch = async () => {
        try {
            setIsSearchLoading(true);

            if (enrollmentNo === "") {
                setIsSearchLoading(false);
                return;
            }

            // Reference to the Firestore collection
            const usersCollectionRef = collection(db, 'institutes/smvec/users');

            // Query for documents where 'enrollNo' matches the input value
            const q = query(usersCollectionRef, where('enrollNo', '==', enrollmentNo));

            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                // User data found
                const userData = querySnapshot.docs[0].data() as UserData;
                setUserData(userData);
            } else {
                // User not found
                setUserData("NODATA");
            }
            setIsSearchLoading(false);
        } catch (error) {
            setIsSearchLoading(false);
            console.error('Error searching for user:', error);
        }
    };

    return (
        <Box m="20px">
            <div className='mb-4'>
                <h1 className="text-3xl font-bold">Search User</h1>
                <h4 className="text-l font-semibold mt-3 ml-0.5">Check Enrollment Status</h4>
            </div>
            <div>
                <TextField
                    label="Enrollment Number"
                    variant="outlined"
                    autoComplete="off"
                    value={enrollmentNo}
                    onChange={(e) => setEnrollmentNo(e.target.value.toUpperCase().trim())}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleSearch();
                        }
                    }}
                />
                <LoadingButton
                    sx={{ p: "1rem", ml: "1rem" }}
                    color="primary"
                    onClick={handleSearch}
                    variant="contained"
                    loading={isSearchLoading}
                >
                    Search
                </LoadingButton>
                {(userData && userData !== "NODATA") && (
                    <div className="p-3 bg-white rounded-lg shadow-lg mt-5">    
                        <h2 className="text-2xl font-semibold mb-4">User Data</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-gray-100 p-4">
                                <p className="font-semibold">Name:</p>
                                <p>{userData.name}</p>
                            </div>
                            <div className="bg-gray-100 p-4">
                                <p className="font-semibold">Father's Name:</p>
                                <p>{userData.fatherName}</p>
                            </div>
                            <div className="bg-gray-100 p-4">
                                <p className="font-semibold">Enrollment Number:</p>
                                <p>{userData.enrollNo}</p>
                            </div>
                            <div className="bg-gray-100 p-4">
                                <p className="font-semibold">Department:</p>
                                <p>{userData.department}</p>
                            </div>
                            <div className="bg-gray-100 p-4">
                                <p className="font-semibold">Email or Phone:</p>
                                <p>{userData.emailOrPhone}</p>
                            </div>
                            <div className="bg-gray-100 p-4">
                                <p className="font-semibold">Phone:</p>
                                <p>{userData.phone}</p>
                            </div>
                            <div className="bg-gray-100 p-4">
                                <p className="font-semibold">Gender:</p>
                                <p>{userData.gender}</p>
                            </div>
                            <div className="bg-gray-100 p-4">
                                <p className="font-semibold">City:</p>
                                <p>{userData.city}</p>
                            </div>
                            <div className="bg-gray-100 p-4">
                                <p className="font-semibold">Bus Stop:</p>
                                <p>{userData.busStop}</p>
                            </div>
                            <div className="bg-gray-100 p-4">
                                <p className="font-semibold">Bus No:</p>
                                <p>{userData.busNo}</p>
                            </div>
                            <div className="bg-gray-100 p-4">
                                <p className="font-semibold">Address:</p>
                                <p>{userData.address}</p>
                            </div>
                            <div className="bg-gray-100 p-4">
                                <p className="font-semibold">Valid Upto:</p>
                                <p>{extractYearAndMonth(userData.validUpto)}</p>
                            </div>
                            <div className="bg-gray-100 p-4">
                                <p className="font-semibold">Created At:</p>
                                <p>
                                    {userData.createdAt && typeof userData.createdAt === 'object'
                                        ? formatTimestamp(userData.createdAt.toDate())
                                        : null}
                                </p>
                            </div>
                            <div className="bg-gray-100 p-4">
                                <p className="font-semibold">Last Login At:</p>
                                <p>
                                    {userData.lastLoginAt && typeof userData.lastLoginAt === 'object'
                                        ? formatTimestamp(userData.lastLoginAt.toDate())
                                        : "Never"}
                                </p>
                            </div>
                        </div>

                    </div>
                )}
                {userData === "NODATA" && (
                    <div className="flex flex-col items-center justify-center mt-10 w-full h-[50vh]">
                        <img src={NoDataLogo} alt="user not found" className="w-24 h-24" />
                        <Typography variant="h6" component="div" className="text-xl mt-10 text-center text-gray-700">
                            User not found
                        </Typography>
                    </div>
                )}
            </div>
        </Box>
    )
}

export default SearchUser;