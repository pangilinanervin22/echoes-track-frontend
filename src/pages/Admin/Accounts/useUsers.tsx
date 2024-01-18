import { useState, useEffect } from 'react';
import { addDoc, collection, deleteDoc, doc, onSnapshot, updateDoc, DocumentReference } from 'firebase/firestore';
import { firebaseDB } from '../../../config/firebase';

export interface User {
    id?: string;
    name: string;
    rfid: number;
    role: string;
    room: string;
    section: string;
    room_ref?: DocumentReference;
}

export function useGetUsers() {
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(firebaseDB, "users"), (snapshot) => {
            const data = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            setUsers(data as User[]);
        });

        return unsubscribe;
    }, []);

    return users.sort((a, b) => a.name.localeCompare(b.name));
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
