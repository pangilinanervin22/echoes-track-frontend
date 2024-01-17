import { useState, useEffect } from 'react';
import { addDoc, collection, deleteDoc, doc, onSnapshot, updateDoc, DocumentReference } from 'firebase/firestore';
import { firebaseDB } from '../../../config/firebase';

export interface Bat {
    id?: string;
    name: string;
    rfid: number;
    role: string;
    room: string;
    section: string;
    room_ref?: DocumentReference;
}

export function useGetBats() {
    const [bats, setBats] = useState<Bat[]>([]);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(firebaseDB, "bats"), (snapshot) => {
            const data = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            setBats(data as Bat[]);
        });

        return unsubscribe;
    }, []);

    return bats.sort((a, b) => a.name.localeCompare(b.name));
}

export function useAddBat() {
    const [status, setStatus] = useState("idle");

    const addBat = async (bat: Bat) => {
        setStatus("loading");

        try {
            await addDoc(collection(firebaseDB, "bats"), bat);
            setStatus("success");
        } catch (e) {
            console.log(e);
            setStatus("error");
        }
    };

    return { status, addBat };
}

export function useUpdateBat() {
    const [status, setStatus] = useState('idle');

    const updateBat = async (updatedBat: Bat) => {
        if (!updatedBat || !updatedBat.id) {
            console.error('Bat or bat ID is undefined');
            return;
        }

        setStatus('loading');

        try {
            const batRef = doc(firebaseDB, 'bats', updatedBat.id);
            await updateDoc(batRef, { name: updatedBat.name });
            console.log('Bat updated', batRef.id, batRef, updatedBat);
            setStatus('success');
        } catch (e) {
            console.log(e);
            setStatus('error');
        }
    };

    return { status, updateBat };
}

export function useDeleteBat() {
    const [status, setStatus] = useState("idle");

    const deleteBat = async (id: string) => {
        setStatus("loading");

        try {
            const batRef = doc(firebaseDB, "bats", id);
            await deleteDoc(batRef);

            setStatus("success");
        } catch (e) {
            console.log(e);
            setStatus("error");
        }
    };

    return { status, deleteBat };
}
