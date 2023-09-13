import { Box } from "@mui/material"
import {
  Card,
  CardContent,
  Typography,
  Grid
} from '@mui/material';
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { collection, getCountFromServer, query, where } from "firebase/firestore";
import { db } from "../../firebase";
import { shallowEqual } from "react-redux";
import { useEffect } from "react";
import { getBusses, setBusUserCount } from "../../redux/features/instituteSlice";

const Dashboard = () => {

  const { busNo, institute, busUserCounts } = useAppSelector(state => {
    return {
      busNo: state.institute.busses,
      institute: state.auth.admin?.institute,
      busUserCounts: state.institute?.busUserCount
    }
  }, shallowEqual);

  const dispatch = useAppDispatch();

  useEffect(() => {

    async function fetchBusUserCounts() {

      if (busNo) {

        if (!!busUserCounts) return;

        const data = await Promise.all(busNo.map(async (code) => {
          const getBusNoCount = async (busNumber: string): Promise<number> => {
            try {
              const usersCollection = collection(db, `institutes/${institute}/users`);
              const q = query(usersCollection, where('busNo', '==', busNumber));

              const snapshot = await getCountFromServer(q);

              console.log(`User count for ${busNumber}:`, snapshot.data().count);

              return snapshot.data().count;
            } catch (err) {
              console.error(err);
              return 0; // Handle the error appropriately, e.g., return 0 for the count.
            }
          }

          return {
            busName: code,
            userCount: await getBusNoCount(code)
          };
        }));

        dispatch(setBusUserCount(data));
      }
    }

    if (institute) {
      if (!busNo) {
        dispatch(getBusses(institute));
      }

      fetchBusUserCounts();
    }


  }, [busNo, institute, dispatch]);


  return (
    <Box m="20px">
      <div className='mb-4'>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <h4 className="text-l font-semibold mt-3 ml-0.5">Welcome to your dashboard</h4>
      </div>

    <div>
      <h1 className="text-2xl font-bold mb-5">Bus User Count</h1>
    </div>

      <Grid container spacing={2}>
        {busUserCounts ? busUserCounts.map((busUserCount, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Typography variant="subtitle1" component="div">
                  Bus no: {busUserCount.busName}
                </Typography>
                <Typography variant="body2" color={busUserCount.userCount >= 48 ? "#ff0000" : "text.secondary"}>
                  User Count: {busUserCount.userCount}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )) : (
          [...Array(40)].map((_, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card>
                <CardContent>
                  <div className="animate-pulse"> {/* Add Tailwind CSS classes for the skeleton effect */}
                    <Typography variant="subtitle1" component="div">
                      <div className="bg-gray-200 h-5 w-[50%] mb-2"></div> {/* Customize the skeleton appearance */}
                    </Typography>
                    <Typography variant="body2">
                      <div className="bg-gray-200 h-5 w-[35%]"></div> {/* Customize the skeleton appearance */}
                    </Typography>
                  </div>
                </CardContent>
              </Card>
            </Grid>
          ))
        )
        }
      </Grid>
    </Box>
  )
}

export default Dashboard;