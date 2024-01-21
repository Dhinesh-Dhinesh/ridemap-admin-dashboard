import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { Alert, Box, Button, Paper, TextField } from "@mui/material"
import { ref, uploadBytesResumable } from 'firebase/storage';
import { db, storage } from '../../../firebase/index';
import ImageViewer from "react-simple-image-viewer";
import BackupIcon from '@mui/icons-material/Backup';
import SnackBar from "../../../components/SnackBar";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../redux/hooks";
import { shallowEqual } from "react-redux";
import { collection, addDoc, serverTimestamp, where, query, getDocs, setDoc } from "firebase/firestore";

type snackBar = {
    open: boolean;
    message: string;
    severity: "success" | "error" | "info" | "warning" | undefined;
}

const ReportUser: React.FC = () => {

    const location = useLocation();
    const navigate = useNavigate();

    const { institute, userId } = useAppSelector(state => {
        return { institute: state.auth.user?.institute, userId: state.auth.user?.uid }
    }, shallowEqual)

    const [enrollmentNo, setEnrollmentNo] = useState<string>('');
    const [selectedFiles, setSelectedFiles] = useState<File[] | null>(null);
    const [previewURLs, setPreviewURLs] = useState<string[]>([]);
    const [uploadProgress, setUploadProgress] = useState<number | null>(null);

    const [currentImage, setCurrentImage] = useState<number>(0);
    const [isViewerOpen, setIsViewerOpen] = useState<boolean>(false);

    const [snackBar, setSnackBar] = useState<snackBar>({
        open: false,
        message: "",
        severity: undefined
    });


    // gets the state from the state object passed from the previous page
    useEffect(() => {
        if (location.state) setEnrollmentNo(location.state.enrollmentNumber);
    }, [location]);

    const openImageViewer = useCallback((index: number) => {
        setCurrentImage(index);
        setIsViewerOpen(true);
    }, []);

    const closeImageViewer = () => {
        setCurrentImage(0);
        setIsViewerOpen(false);
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;

        if (files) {

            // only allow images otherwise return
            for (let i = 0; i < files.length; i++) {
                if (!files[i].type.startsWith('image/')) {
                    alert('Only image files are allowed');
                    return;
                }
            }

            // Check if there are already selected files
            if (selectedFiles) {
                // Combine the newly selected files with the existing ones
                const combinedFiles = Array.from(selectedFiles).concat(Array.from(files));
                setSelectedFiles(combinedFiles);
                console.log(combinedFiles);
            } else {
                setSelectedFiles(Array.from(files));
                console.log(Array.from(files));
            }

            // Create preview URLs for all selected images
            const previewURLArray: string[] = [];
            for (let i = 0; i < files.length; i++) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    previewURLArray.push(reader.result as string);
                    const combinedPreviewURLs = Array.from(previewURLs).concat(Array.from(previewURLArray));
                    setPreviewURLs(combinedPreviewURLs);
                };
                reader.readAsDataURL(files[i]);
            }
        } else {
            setSelectedFiles(null);
            setPreviewURLs([]);
            setUploadProgress(null);
        }
    };

    const handleUpload = async () => {
        if (selectedFiles) {
            try {


                if (!enrollmentNo) {
                    alert("Please enter enrollment number");
                    return;
                }

                /**
                * Creates a storage reference
                * 
                * path : `institutes/${institute}/unknown_users/${enrollmentNo}`
                * 
                * example path : `institutes/smvec/unknown_users/20TD0324`
                */
                const storageRef = ref(storage, `institutes/${institute}/unknown_users/${enrollmentNo}`);

                // Upload each file in the selectedFiles array
                const uploadTasks = selectedFiles.map((file) => {
                    // Generate a unique name for the file
                    const fileName = `${Date.now()}_${file.name}`;

                    // Upload the file to Firebase Storage with upload progress tracking
                    const uploadTask = uploadBytesResumable(ref(storageRef, fileName), file);

                    uploadTask.on('state_changed', (snapshot) => {

                        // Calculate the total file size in bytes
                        const fileSize = selectedFiles.reduce(
                            (acc, currentFile) =>
                                acc + currentFile.size,
                            0
                        )

                        console.log(fileSize, snapshot.bytesTransferred);

                        // Update the average progress
                        setUploadProgress((snapshot.bytesTransferred / fileSize) * 100);
                    }, null, () => console.log("complete"));

                    return uploadTask;
                });

                // Wait for all upload tasks to complete
                await Promise.all(uploadTasks);


                // after uploading files to Firebase Storage send the data to firestore
                const collectionRef = collection(db, `institutes/${institute}/unknown_users`);
                const timestamp = serverTimestamp();

                const data = {
                    enrollNo: enrollmentNo,
                    date: timestamp,
                    uploadedBy: userId
                }

                // Check if the document with the given enrollNo exists
                const q = query(collectionRef, where('enrollNo', '==', enrollmentNo));
                const querySnapshot = await getDocs(q);

                if (querySnapshot.size > 0) {
                    // Document exists, update the existing document
                    const enrollNoDocRef = querySnapshot.docs[0].ref;
                    await setDoc(enrollNoDocRef, data, { merge: true });
                } else {
                    // Document doesn't exist, create a new one
                    await addDoc(collectionRef, data)
                }

                // Reset the state after the document has been added
                setSelectedFiles(null);
                setPreviewURLs([]);
                setSnackBar({
                    open: true,
                    message: "Uploaded successfully",
                    severity: "success",
                })
                setTimeout(() => {
                    setUploadProgress(null)
                    setSnackBar((prev) => ({ ...prev, open: false }));
                    navigate(-1)
                }, 1000);

            } catch (error) {
                console.error('Error uploading files:', error);
            }
        }
    };


    return (
        <Box m="20px">
            <div className='mb-4'>
                <h1 className="text-3xl font-bold">Report User</h1>
                <h4 className="text-l font-semibold mt-3 ml-0.5">Report with enrollment number & image</h4>
            </div>
            <TextField
                label="Enrollment Number"
                variant="outlined"
                autoComplete="off"
                value={enrollmentNo}
                onChange={(e) => setEnrollmentNo(e.target.value.toUpperCase().trim())}
                sx={{ mb: "2rem" }}
            />
            <div>
                <input type="file" accept="image/*" capture multiple onChange={handleFileChange} id="fileInput" style={{
                    display: 'none',
                }} />
                <label htmlFor="fileInput" style={{ // style for the visible label
                    border: '2px solid #ccc',
                    borderRadius: '5px',
                    padding: '10px',
                    cursor: 'pointer',
                    backgroundColor: 'lightgray',
                    color: 'black',
                    fontSize: '16px',
                }}>
                    Choose File
                </label>
            </div>
            {selectedFiles && (
                <>
                    {/* <div > */}
                    <Paper elevation={3} className="mt-5 flex-1 p-3">
                        {previewURLs.map((src, index) => (
                            <img
                                src={src}
                                onClick={() => openImageViewer(index)}
                                width="400px"
                                key={index}
                                style={{ margin: "5px", display: "inline-block" }}
                                alt={`sample ${index}`}
                            />
                        ))}
                        {isViewerOpen && (
                            <ImageViewer
                                src={previewURLs}
                                currentIndex={currentImage}
                                onClose={closeImageViewer}
                                disableScroll={false}
                                backgroundStyle={{
                                    backgroundColor: "rgba(0,0,0,0.9)",
                                    zIndex: 1001,
                                }}
                                closeOnClickOutside={true}
                            />
                        )}
                    </Paper>
                    {/* </div> */}
                    <div>
                        {uploadProgress !== null && <div>Upload Progress: {uploadProgress.toFixed(2)}%</div>}
                        {uploadProgress === null &&
                            <Button variant="contained" startIcon={<BackupIcon />} onClick={handleUpload} sx={{ mt: "1rem" }}>
                                Upload
                            </Button>
                        }
                    </div>
                </>
            )}
            <SnackBar isOpen={snackBar.open}>
                <div className="w-full">
                    <Alert severity={snackBar.severity} variant='filled'>{snackBar.message}</Alert>
                </div>
            </SnackBar>
        </Box>
    )
}

export default ReportUser;