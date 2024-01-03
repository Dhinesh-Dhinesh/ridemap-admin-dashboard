import { db, storage } from "../firebase";
import { ref, listAll, getDownloadURL, StorageReference, ListResult } from "firebase/storage";
import { collection, getDocs, orderBy, query } from "firebase/firestore";

import type { DownloadURLs, ReportedUser } from "../types";

/** 
 * Download the image URLs from storage and return a list of URLs by spliting the 
 * original and thumbnail URLs
 * 
 * @param { string } institute The institute name from redux store
 * @param { string } enrollmentNo EnrollmentNo number of student
 * 
 * @returns { DownloadURLs }
 */
export const getDownloadURLs = async (institute: string, enrollmentNo: string): Promise<DownloadURLs | null> => {

    if (enrollmentNo === '' || institute === null) return null;

    try {
        const thumbnailRef: StorageReference = ref(storage, `institutes/${institute}/unknown_users/${enrollmentNo}/thumb`);
        const originalImageRef: StorageReference = ref(storage, `institutes/${institute}/unknown_users/${enrollmentNo}`);

        const [thumbnailListResult, originalListResult]: [ListResult, ListResult] = await Promise.all([listAll(thumbnailRef), listAll(originalImageRef)]);

        const itemsList: StorageReference[] = [...thumbnailListResult.items, ...originalListResult.items];

        const urls = await Promise.all(
            itemsList.map(async (item) => {
                const downloadUrl = await getDownloadURL(item);
                return downloadUrl;
            })
        );

        return {
            thumbnails: urls.slice(0, thumbnailListResult.items.length),
            originals: urls.slice(thumbnailListResult.items.length)
        };
    } catch (error) {
        console.error('Error fetching download URLs:', error);
        return null;
    }
};

export const getReportedUsers = async (institute: string): Promise<ReportedUser[]> => {

    const collectionRef = collection(db, `institutes/${institute}/unknown_users`)

    const q = query(collectionRef, orderBy('date', 'desc'));

    const snapshot = await getDocs(q);

    const reportedUsers: ReportedUser[] = snapshot.docs.map(doc => {
        return {
            enrollNo: doc.data().enrollNo,
            date: doc.data().date,
            uploadedBy: doc.data().uploadedBy,
        }
    });

    return reportedUsers;
}