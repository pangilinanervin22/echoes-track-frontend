import { useState, useEffect } from 'react';
import { addDoc, collection, deleteDoc, doc, onSnapshot, updateDoc, DocumentReference, where, getDocs, query, writeBatch } from 'firebase/firestore';
import { firebaseDB } from '../../../config/firebase';
import { deleteObject, getStorage, ref } from 'firebase/storage';

export interface User {
    id?: string;
    name: string;
    rfid: string;
    role: string;
    section: string;
    room?: string;
    image?: string;
    room_ref?: DocumentReference;
}

export function useGetUsers() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true); // Add loading state

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(firebaseDB, "users"), (snapshot) => {
            const data = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            setUsers(data as User[]);
            setLoading(false); // Update loading state
        });

        return unsubscribe;
    }, []);

    return { users: users.sort((a, b) => a.name.localeCompare(b.name)), loading }; // Return loading state
}

export function useAddUser() {
    const addUser = async (user: User) => {

        // validate rfid if already exists
        const check = await rfidAlreadyExist(user.rfid);
        if (check) return { error: true, message: "RFID already exists" };

        try {
            await addDoc(collection(firebaseDB, "users"), user);
            return { ok: true, message: user.name + " added succesfully" };
        } catch (e) {
            return { error: true, message: "Error adding user" };
        }
    };

    return { addUser };
}

export function useUpdateUser() {
    const updateUser = async (data: User, rfid: string) => {

        if (!data || !data.id) {
            console.error('User or user ID is undefined');
            return { error: true, message: "User or user ID is undefined" };
        }

        const check = await rfidAlreadyExist(data.rfid);
        if (check && rfid !== data.rfid)
            return { error: true, message: "RFID already exists" };

        try {
            const userRef = doc(firebaseDB, 'users', data.id);
            await updateDoc(userRef, { ...data });

            return { ok: true, message: "User updated successfully" };
        } catch (e) {
            console.log(e);
            return { error: true, message: "Error updating user" };
        }
    };

    return { updateUser };
}

export function useGetUser(id: string) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true); // Add loading state
    const [error, setError] = useState<string | null>(null); // Add error state

    useEffect(() => {
        const unsubscribe = onSnapshot(doc(firebaseDB, "users", id), (doc) => {
            if (doc.exists()) {
                setUser(doc.data() as User);
                setError(null); // Clear error state
            } else {
                setUser(null);
                setError("User not found"); // Set error state
            }
            setLoading(false); // Update loading state
        }, (error) => {
            console.log(error);
            setError("Error fetching user"); // Set error state
            setLoading(false); // Update loading state
        });

        return unsubscribe;
    }, [id]);

    return { user, loading, error }; // Return user, loading, and error state
}

export function useDeleteUser() {
    const deleteUser = async (id: string, imageUrl: string) => {

        try {
            const userRef = doc(firebaseDB, "users", id);
            await deleteDoc(userRef);
            const storage = getStorage();
            if (imageUrl !== import.meta.env.VITE_PROFILE_IMAGE) {
                const deleteImageRef = ref(storage, imageUrl);
                // Check if the file exists
                await deleteObject(deleteImageRef);
            }

            const attendanceRef = collection(firebaseDB, 'attendances');
            const attendancesSnapShot = await getDocs(query(attendanceRef, where('student_ref', '==', userRef)));

            const batch = writeBatch(firebaseDB);
            attendancesSnapShot.docs.forEach((cur) => {
                const scheduleRef = doc(firebaseDB, 'attendances', cur.id);
                batch.delete(scheduleRef);
            });

            await batch.commit();

            return { ok: true, message: "User deleted successfully" };
        } catch (e) {
            console.log(e);
            return { error: true, message: "Error deleting user" };
        }
    };

    return { deleteUser };
}


// non hooks function

export async function rfidAlreadyExist(rfid: string) {
    //Validate user rfid if already exists
    const querySnapshot = await getDocs(query(collection(firebaseDB, "users"), where("rfid", "==", rfid)));
    if (!querySnapshot.empty)
        return true;

    return false;
}

