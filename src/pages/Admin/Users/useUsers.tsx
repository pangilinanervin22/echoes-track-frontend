import { useState, useEffect } from 'react';
import { addDoc, collection, deleteDoc, doc, onSnapshot, updateDoc, DocumentReference } from 'firebase/firestore';
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
    const [status, setStatus] = useState("idle");

    const addUser = async (user: User) => {
        setStatus("loading");

        try {
            await addDoc(collection(firebaseDB, "users"), user);
            setStatus("success");
        } catch (e) {
            console.log(e);
            setStatus("error");
        }
    };

    return { status, addUser };
}

export function useUpdateUser() {

    const updateUser = async (updatedUser: User) => {
        console.log(updatedUser, "edt");

        if (!updatedUser || !updatedUser.id) {
            console.error('User or user ID is undefined');
            return;
        }

        try {
            const userRef = doc(firebaseDB, 'users', updatedUser.id);
            await updateDoc(userRef, { ...updatedUser });
            return { ok: true, message: "User updated successfully" };
        } catch (e) {
            console.log(e);
            return { error: true, message: "Error updating user" };
        }
    };

    return { status, updateUser };
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
            return { ok: true, message: "User deleted successfully" };
        } catch (e) {
            console.log(e);
            return { error: true, message: "Error deleting user" };
        }
    };

    return { deleteUser };
}
