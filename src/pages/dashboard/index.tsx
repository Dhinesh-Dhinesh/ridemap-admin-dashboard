import { Box, CardActionArea, Skeleton } from "@mui/material"
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
import { getBusses, setBusUserCount, setMaleGenderCount } from "../../redux/features/instituteSlice";
import { useNavigate } from "react-router-dom";
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import PersonIcon from '@mui/icons-material/Person';
import DirectionsBusRoundedIcon from '@mui/icons-material/DirectionsBusRounded';

const Dashboard = () => {

  const { busNo, institute, busUserCounts, maleGenderCount } = useAppSelector(state => {
    return {
      busNo: state.institute.busses,
      institute: state.auth.admin?.institute,
      busUserCounts: state.institute?.busUserCount,
      maleGenderCount: state.institute?.maleGenderCount
    }
  }, shallowEqual);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {

    async function fetchBusUserCounts() {

      if (busNo) {

        if (!!busUserCounts) return;

        const getCount = async (whereFieldPath: string, whereValue: string): Promise<number> => {
          try {
            const usersCollection = collection(db, `institutes/${institute}/users`);
            const q = query(usersCollection, where(whereFieldPath, '==', whereValue));

            const snapshot = await getCountFromServer(q);

            return snapshot.data().count;
          } catch (err) {
            console.error(err);
            return 0; // Handle the error appropriately, e.g., return 0 for the count.
          }
        }

        const data = await Promise.all(busNo.map(async (code) => {
          return {
            busName: code,
            userCount: await getCount('busNo', code)
          };
        }));

        const genderMaleCount = await getCount('gender', 'Male')

        dispatch(setMaleGenderCount(genderMaleCount));
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

  const totalStudents = busUserCounts ? busUserCounts.reduce((prev, curr) => prev + curr.userCount, 0) : 0;

  return (
    <Box m="20px">
      <div className='mb-4'>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <h4 className="text-l font-semibold mt-3 ml-0.5">Welcome to your dashboard</h4>
      </div>

      <Grid container spacing={2}>

        <Grid item xs={12} sm={6} md={3} display={"flex"}>
          <Card raised className="box-container grow">
            <Box m="0 30px" p="12px 0" display={"flex"} justifyContent={"space-between"} className="xl:h-32 md:h-36 sm:h-44">
              <Box display="flex" flexDirection="column">
                <Typography variant="h6" fontWeight="bold">
                  Total Students
                </Typography>
                {busUserCounts !== null ? (
                  <Typography variant="h4" fontWeight="bold" mt={2}>
                    {totalStudents}
                  </Typography>
                ) : (
                  <Skeleton width={100} height={30} />
                )}
              </Box>
              <Box display={"flex"} alignItems={"center"}>
                {busUserCounts !== null ? (
                  <PersonIcon sx={{ fontSize: 40 }} />
                ) : (
                  <Skeleton variant="circular" width={40} height={40} />
                )}
              </Box>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={6} display={"flex"}>
          <Card raised className="box-container grow">
            <Box
              m="0 30px"
              p="12px 0"
              display="flex"
              justifyContent="space-between"
              className="xl:h-32 md:h-36 sm:h-44"
            >
              <Box display="flex" flexDirection="column">
                <Typography variant="h6" fontWeight="bold">
                  Gender Ratio
                </Typography>
                {busUserCounts !== null ? (
                  <Box display="flex" alignItems="center" className="max-[445px]:flex-col">
                    <Box fontWeight="bold" p={1} mt={1}>
                      <p className="text-3xl max-[445px]:text-xl">M: {maleGenderCount}<span className="text-xs ml-2 text-blue-500">{((maleGenderCount / totalStudents) * 100).toFixed(2)}%</span></p>
                    </Box>
                    <Box fontWeight="bold" p={1} mt={1}>
                      <p className="text-3xl max-[445px]:text-xl">F: {totalStudents - maleGenderCount}<span className="text-xs ml-2 text-pink-500">{(((totalStudents - maleGenderCount) / totalStudents) * 100).toFixed(2)}%</span></p>
                    </Box>
                  </Box>
                ) : (
                  <Box display="flex" alignItems="center" className="max-[445px]:flex-col">
                    <Skeleton variant="text" width={200} height={32} />
                    <Skeleton variant="text" width={200} height={32} />
                  </Box>
                )}
              </Box>
              <Box display="flex" alignItems="center">
                {busUserCounts !== null ? (
                  <>
                    <MaleIcon sx={{ fontSize: 40 }} />
                    <FemaleIcon sx={{ fontSize: 40 }} />
                  </>
                ) : (
                  <Box display="flex" alignItems="center">
                    <Skeleton variant="circular" width={40} height={40} />
                    <Skeleton variant="circular" width={40} height={40} />
                  </Box>
                )}
              </Box>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3} display={"flex"}>
          <Card raised className="box-container grow">
            <Box m="0 30px" p="12px 0" display={"flex"} justifyContent={"space-between"} className="xl:h-32 md:h-36 sm:h-44">
              <Box display="flex" flexDirection="column">
                <Typography variant="h6" fontWeight="bold">
                  Buses
                </Typography>
                {busUserCounts !== null ? (
                  <Typography variant="h4" fontWeight="bold" mt={2}>
                    {busUserCounts.length}
                  </Typography>
                ) : (
                  <Skeleton variant="text" width={120} height={32} />
                )}
              </Box>
              <Box display={"flex"} alignItems={"center"}>
                {busUserCounts !== null ? (
                  <DirectionsBusRoundedIcon sx={{ fontSize: 40 }} />
                ) : (
                  <Skeleton variant="circular" width={40} height={40} />
                )}
              </Box>
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Bus User Count */}
      <div>
        <h1 className="text-2xl font-bold mb-5 mt-5">Bus User Count</h1>
      </div>

      <Grid container spacing={2}>
        {busUserCounts ? busUserCounts.map((busUserCount, index) => (
          <Grid item xs={12} sm={6} md={3} key={index} className="flex">
            <Card className="grow">
              <CardActionArea onClick={() => navigate(`/bus-users/${busUserCount.busName}`)}>
                <CardContent>
                  <Typography variant="subtitle1" component="div">
                    Bus no: {busUserCount.busName}
                  </Typography>
                  <Typography variant="body2" color={busUserCount.userCount >= 48 ? "#ff0000" : "text.secondary"}>
                    User Count: {busUserCount.userCount}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        )) : (
          [...Array(40)].map((_, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card>
                <CardContent>
                  <div className="animate-pulse">
                    <div className="bg-gray-200 h-5 w-[50%] mb-2"></div>
                    <div className="bg-gray-200 h-5 w-[35%]"></div>
                  </div>
                </CardContent>
              </Card>
            </Grid>
          ))
        )
        }
      </Grid>
    </Box >
  )
}

export default Dashboard;