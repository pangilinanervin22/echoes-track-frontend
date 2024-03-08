import { DocumentData, DocumentReference, DocumentSnapshot, addDoc, collection, deleteDoc, doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { firebaseAuth, firebaseDB } from "../../../config/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { User, rfidAlreadyExist, useDeleteUser } from "../Users/useUsers";
export interface Account {
    id?: string;
    auth_id?: string;
    name: string;
    role: string;
    email: string;
    image?: string;
    user_ref?: DocumentReference;
}

export function useGetAccounts() {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(firebaseDB, "accounts"), (snapshot) => {
            const unsubscribes = snapshot.docs.map((accountDoc) => {
                const accountData = accountDoc.data() as Account;

                // Listen for changes to user data
                if (accountData.user_ref) {
                    return onSnapshot(accountData.user_ref, (userDoc: DocumentSnapshot<DocumentData>) => {
                        if (userDoc.exists()) {
                            const userData = userDoc.data() as User;

                            setAccounts((prevAccounts) => {
                                const newAccount = {
                                    ...accountData,
                                    ...userData,
                                    id: accountDoc.id,
                                    email: accountData.email,
                                    name: userData.name,
                                    role: userData.role,
                                    image: userData.image ? userData.image : import.meta.env.VITE_PROFILE_IMAGE,
                                };

                                // Find the index of the account to be updated
                                const index = prevAccounts.findIndex((account) => account.id === newAccount.id);

                                // If the account is found, update it in the array
                                if (index !== -1) {
                                    const updatedAccounts = [...prevAccounts];
                                    updatedAccounts[index] = newAccount;
                                    return updatedAccounts;
                                }

                                // If the account is not found, add it to the array
                                return [...prevAccounts, newAccount];
                            });
                        }
                    });
                }

                return () => { };
            });

            setLoading(false);

            // Cleanup function
            return () => {
                // Unsubscribe from all user data listeners
                unsubscribes.forEach(unsubscribe => unsubscribe());
            };
        });

        // Unsubscribe from accounts listener
        return () => unsubscribe();
    }, []);

    return { accounts, loading };
}

export function useAddAccount() {
    const addAccount = async (data: User, email: string, password: string) => {

        try {
            const check = await rfidAlreadyExist(data.rfid);
            if (check) return { error: true, message: "RFID already exists" };

            const authCreate = await createUserWithEmailAndPassword(firebaseAuth, email, password);
            const userCreate = await addDoc(collection(firebaseDB, "users"), data);
            await addDoc(collection(firebaseDB, "accounts"), {
                auth_id: authCreate.user.uid,
                user_ref: userCreate,
                email: email,
            });

            return { ok: true, message: data.name + " added successfully" };
        } catch (e) {
            console.log(e);
            return { error: true, message: "Error adding account" };
        }
    };

    return { addAccount };
}

export function useUpdateAccount() {
    const updateAccount = async (data: User) => {

        if (!data || !data.id) {
            return { error: true, message: "User or user ID is undefined" };
        }

        try {
            const accountRef = doc(firebaseDB, 'accounts', data.id);
            await updateDoc(accountRef, {
                name: data.name,
                role: data.role,
                rfid: data.rfid,
                image: data.image ? data.image : import.meta.env.VITE_PROFILE_IMAGE,
            });

            //find user accountRef  by  and update
            const resAccount = (await getDoc(accountRef)).data() as Account;
            const userRef = resAccount.user_ref!;
            await updateDoc(userRef, {
                name: data.name,
                role: data.role,
                rfid: data.rfid,
                image: data.image ? data.image : import.meta.env.VITE_PROFILE_IMAGE,
            });


            return { ok: true, message: data.name + " updated successfully" };
        } catch (e) {
            console.log(e);
            return { error: true, message: "Error updating user" };
        }
    };

    return { updateUser: updateAccount };
}

export function useDeleteAccount() {
    const { deleteUser } = useDeleteUser();
    const deleteAccount = async (id: string) => {
        try {

            const resAccount = await getDoc(doc(firebaseDB, "accounts", id));
            const dataAccount: Account = resAccount.data() as Account;
            if (dataAccount === undefined) return { error: true, message: "Account not found" };

            const resUser = await getDoc(dataAccount.user_ref!);
            const dataUser: User = resUser.data() as User;
            if (dataUser === undefined) return { error: true, message: "User not found" };

            await deleteUser(dataUser.id!);
            await deleteDoc(doc(firebaseDB, "accounts", id));

            return { ok: true, message: "User deleted successfully" };
        } catch (e) {
            return { error: true, message: "Error deleting user" };
        }
    };

    return { deleteAccount };
}

export function useGetAccount(id: string) {
    const [account, setAccount] = useState<any | null>(null);
    const [loading, setLoading] = useState(true); // Add loading state
    const [error, setError] = useState<string | null>(null); // Add error state

    useEffect(() => {
        const unsubscribeAccount = onSnapshot(doc(firebaseDB, "accounts", id), (doc) => {
            if (doc.exists()) {
                const accountData = doc.data() as Account;
                const unsubscribeUser = onSnapshot(accountData.user_ref!, (userSnapshot) => {
                    if (userSnapshot.exists()) {
                        const userData = userSnapshot.data() as User;
                        setAccount({ ...userData, email: accountData.email, id: userData.id });
                        setError(null);
                    } else {
                        setAccount(null);
                        setError("User not found");
                    }
                    setLoading(false);
                }, (error) => {
                    console.log(error);
                    setError("Error fetching user");
                    setLoading(false);
                });

                // Remember to unsubscribe when the component is unmounted
                return () => {
                    unsubscribeUser();
                };
            } else {
                setAccount(null);
                setError("User not found");
                setLoading(false);
            }
        }, (error) => {
            console.log(error);
            setError("Error fetching account");
            setLoading(false);
        });

        return unsubscribeAccount;
    }, [id]);

    return { account, loading, error }; // Return user, loading, and error state
}