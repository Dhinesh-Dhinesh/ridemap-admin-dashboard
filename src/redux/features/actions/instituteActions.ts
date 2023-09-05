// Firebase
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../../../firebase";
import { formatTimestamp } from "../../../util/dateFormatter";

//& Types
import { Admins } from "../../../types";

export const getInstituteAdmins = async (institute: string) => {
    try {
        const collectionRef = collection(db, `institutes/${institute}/admins`);
        const snapshot = await getDocs(collectionRef);

        // Filters out the hidden admins
        const data: Admins[] = snapshot.docs
            .filter(doc => !doc.data()?.isHided)
            .map((doc, index) => {
                return {
                    id: String(index + 1),
                    name: doc.data().name,
                    email: doc.data().email,
                    institute: doc.data().institute,
                    phone: doc.data()?.phone,
                    userId: doc.data().userId,
                    createdAt: doc.data()?.createdAt ? formatTimestamp(doc.data()?.createdAt.toDate()) : null,
                    lastLoginAt: doc.data()?.lastLoginAt ? formatTimestamp(doc.data()?.lastLoginAt.toDate()) : null,
                };
            });

        return data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const getInstituteDepartments = async (institute: string) => {
    try {
        const docRef = doc(db, `institutes/${institute}`,)
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const departments: string[] | null = docSnap.data()?.departments;
            return departments;
        } else return null;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const getInstituteBusses = async (institute: string) => {
    try {
        const docRef = doc(db, `institutes/${institute}`,)
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const busses: string[] | null = docSnap.data()?.busses;
            return busses;
        } else return null;
    } catch (error) {
        console.log(error);
        throw error;
    }
}