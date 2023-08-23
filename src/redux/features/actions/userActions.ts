import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import { formatTimestamp } from "../../../util/dateFormatter";

export const getAdminUserData = async (institute: string, userId: string) => {
    try {
        const docRef = doc(db, `institutes/${institute}/admins`, userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return {
                name: docSnap.data()?.name,
                email: docSnap.data()?.email,
                institute: docSnap.data()?.institute,
                userId: docSnap.data()?.userId,
                createdAt: docSnap.data()?.createdAt ? formatTimestamp(docSnap.data()?.createdAt?.toDate()) : null,
                lastLoginAt: docSnap.data()?.lastLoginAt ? formatTimestamp(docSnap.data()?.lastLoginAt.toDate()) : null,
            };
        } else {
            console.log("No such document!");
            return null;
        }
    } catch (error: any) {
        console.log("Error getting document:", error);
        return null
    }
};