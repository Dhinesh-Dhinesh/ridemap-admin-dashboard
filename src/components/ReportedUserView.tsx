import { Paper } from "@mui/material";
import { memo, useCallback, useEffect, useState } from "react";
import ImageViewer from "react-simple-image-viewer";
import { getDownloadURLs } from "../util/getDownloadURLs";
import { DownloadURLs } from "../types";

interface props {
    enrollNo: string;
    institute: string;
    date: string;
    reportedUser: string;
}

const ReportedUserView: React.FC<props> = memo(({ enrollNo, institute, date, reportedUser }: props) => {

    const [currentImage, setCurrentImage] = useState<number>(0);
    const [isViewerOpen, setIsViewerOpen] = useState<boolean>(false);

    const [urls, setUrls] = useState<DownloadURLs | null>(null);

    const openImageViewer = useCallback((index: number) => {
        setCurrentImage(index);
        setIsViewerOpen(true);
    }, []);

    const closeImageViewer = () => {
        setCurrentImage(0);
        setIsViewerOpen(false);
    };

    // Get thumb & original image urls by enroll number

    useEffect(() => {
        getDownloadURLs(institute, enrollNo).then((data) => {
            setUrls(data)
        }).catch((error) => {
            console.log(error);
        });
    }, [institute, enrollNo]);

    return (
        <Paper elevation={3} className="mt-5 flex-1 p-3 rounded-md shadow-md">
            <p className="text-gray-700 text-xl font-semibold mb-2">
                Enrollment No: <span className="text-[#1976d2]">{enrollNo}</span>
            </p>
            <div className="flex flex-wrap justify-center">
                {urls &&
                    urls.thumbnails.map((src, index) => (
                        <img
                            src={src}
                            onClick={() => openImageViewer(index)}
                            width="200px"
                            key={index}
                            className="m-2 cursor-pointer border border-gray-300 rounded-md hover:shadow-md"
                            alt={`Sample ${index}`}
                            loading="lazy"
                        />
                    ))}
            </div>
            {isViewerOpen && (
                <ImageViewer
                    src={urls ? urls.originals : []}
                    currentIndex={currentImage}
                    onClose={closeImageViewer}
                    disableScroll={false}
                    backgroundStyle={{
                        backgroundColor: "rgba(0, 0, 0, 0.9)",
                        zIndex: 1001,
                    }}
                    closeOnClickOutside={true}
                />
            )}
            <div className="flex-1 mt-4">
                <p className="text-gray-600 text-sm">{date}</p>
                <p className="text-gray-600 text-xs">Reported By: {reportedUser}</p>
            </div>
        </Paper>
    )
})

export default ReportedUserView;