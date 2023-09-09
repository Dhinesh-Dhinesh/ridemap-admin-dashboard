// Firebase
import { arrayRemove, arrayUnion, collection, doc, getDoc, getDocs, orderBy, query, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import { extractYearAndMonth, formatTimestamp } from "../../../util/dateFormatter";

//& Types
import { Admins, UserData } from "../../../types";

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

export const addInstituteBusNo = async (institute: string, busNo: string): Promise<string | null> => {
    try {
        const docRef = doc(db, 'institutes', institute);

        if (!busNo) return null;

        await updateDoc(docRef, {
            busses: arrayUnion(busNo)
        })

        return busNo;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const deleteInstituteBusNo = async (institute: string, busNo: string): Promise<string | null> => {
    try {
        const docRef = doc(db, 'institutes', institute);

        if (!busNo) return null;

        await updateDoc(docRef, {
            busses: arrayRemove(busNo)
        })

        return busNo;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const addInstituteDepartment = async (institute: string, departments: string): Promise<string | null> => {
    try {
        const docRef = doc(db, 'institutes', institute);

        if (!departments) return null;

        await updateDoc(docRef, {
            departments: arrayUnion(departments)
        })

        return departments;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const deleteInstituteDepartment = async (institute: string, departments: string): Promise<string | null> => {
    try {
        const docRef = doc(db, 'institutes', institute);

        if (!departments) return null;

        await updateDoc(docRef, {
            departments: arrayRemove(departments)
        })

        return departments;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const getUsersFromInstitute = async (institute: string): Promise<UserData[] | null> => {
    try {
        const collectionRef = collection(db, 'institutes', institute, 'users');
        const q = query(collectionRef, orderBy("createdAt", "desc"));

        const snapshot = await getDocs(q);

        const data: UserData[] | null = snapshot.docs.map((doc, index) => {
            return {
                id: index + 1,
                name: doc.data().name,
                fatherName: doc.data().fatherName,
                enrollNo: doc.data().enrollNo,
                department: doc.data().department,
                emailOrPhone: doc.data().emailOrPhone,
                phone: doc.data().phone,
                gender: doc.data().gender,
                city: doc.data().city,
                busStop: doc.data().busStop,
                busNo: doc.data().busNo,
                address: doc.data().address,
                validUpto: doc.data()?.validUpto ? extractYearAndMonth(doc.data()?.validUpto) : '',
                createdAt: doc.data()?.createdAt ? formatTimestamp(doc.data()?.createdAt.toDate()) : null,
                lastLoginAt: doc.data()?.lastLoginAt ? formatTimestamp(doc.data()?.lastLoginAt.toDate()) : null,
            }
        })

        return data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}