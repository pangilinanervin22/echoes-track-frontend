import { useState, useEffect } from 'react';
import { addDoc, collection, deleteDoc, doc, onSnapshot, updateDoc, DocumentReference } from 'firebase/firestore';
import { firebaseDB } from '../../../config/firebase';

export interface User {
    id?: string;
    name: string;
    rfid: string;
    role: string;
    room: string;
    section: string;
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
    const [status, setStatus] = useState('idle');

    const updateUser = async (updatedUser: User) => {
        if (!updatedUser || !updatedUser.id) {
            console.error('User or user ID is undefined');
            return;
        }

        setStatus('loading');

        try {
            const userRef = doc(firebaseDB, 'users', updatedUser.id);
            await updateDoc(userRef, { name: updatedUser.name });
            console.log('User updated', userRef.id, userRef, updatedUser);
            setStatus('success');
        } catch (e) {
            console.log(e);
            setStatus('error');
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
    const [status, setStatus] = useState("idle");

    const deleteUser = async (id: string) => {
        setStatus("loading");

        try {
            const userRef = doc(firebaseDB, "users", id);
            await deleteDoc(userRef);

            setStatus("success");
        } catch (e) {
            console.log(e);
            setStatus("error");
        }
    };

    return { status, deleteUser };
}
