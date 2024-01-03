import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { getReportedUsers } from "../../util/getDownloadURLs";
import { useAppSelector } from "../../redux/hooks";
import { ReportedUser } from "../../types";
import { formatTimestamp } from "../../util/dateFormatter";
import ReportedUserView from "../../components/ReportedUserView";

export default function viewUserReports() {
    const [reports, setReports] = useState<ReportedUser[]>([]);

    const institute = useAppSelector((state) => state.auth.admin?.institute)

    useEffect(() => {
        if (institute) {
            getReportedUsers(institute).then((data) => {
                setReports(data);
            }).catch(err => {
                console.error(err);
            })
        }
    }, [institute]);

    return (
        <Box m="20px">
            <div className='mb-4'>
                <h1 className="text-3xl font-bold">Reported Users</h1>
                <h4 className="text-l font-semibold mt-3 ml-0.5">Manage Reported Users</h4>
            </div>

            {/* Display the reports */}
            {reports && reports.map((data, index) => {
                return <ReportedUserView
                    enrollNo={data.enrollNo}
                    institute={institute as string}
                    key={data.enrollNo + index}
                    date={formatTimestamp(data.date.toDate())}
                    reportedUser={data.uploadedBy}
                />
            })}
        </Box >
    )
}