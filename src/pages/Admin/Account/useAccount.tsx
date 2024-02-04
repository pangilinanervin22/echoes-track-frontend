import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { firebaseAuth, firebaseDB } from "../../../config/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

interface Account {
    name: string;
    auth_id: string;
    role: string;
    email: string;
}

export function useGetAccount() {
    const [account, setAccount] = useState<Account[]>([]);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(firebaseDB, "accounts"), async (snapshot) => {
            const data = await Promise.all(snapshot.docs.map(async (doc) => {
                const accountData = doc.data();

                return {
                    id: doc.id,
                    ...accountData,
                };
            }));

            setAccount(data as any[]);
        });

        // Cleanup function
        return () => unsubscribe();
    }, []);

    return account;
}

export function useAddAccount() {

    const addUser = async (data: Account, password: string) => {

        try {
            console.log("add account");
            const res = await createUserWithEmailAndPassword(firebaseAuth, data.email, password);
            console.log(res);


        } catch (e) {
            console.log(e);
            return { error: true, message: "Error adding account" };
        }
    };

    return { addUser };
}
