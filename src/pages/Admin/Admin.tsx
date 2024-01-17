import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { firebaseAuth, firebaseDB } from "../../config/firebase";
import Login from "./Login";
import { collection, getDocs, query, where } from "firebase/firestore";
import adminStyle from './LoginStyle.module.scss'

export default function Admin() {
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
            setIsAuthorized(!!user);

            if (user) {
                const userData = await getUser(user.uid);
                console.log(userData);
            }
        });

        // Cleanup function
        return () => unsubscribe();
    }, [isAuthorized]);

    return (
        <main className={adminStyle.mainContainer}>
            <nav>
                {isAuthorized && <button onClick={() => firebaseAuth.signOut()}>Logout</button>}
            </nav>
            {isAuthorized ? <Outlet /> : <Login />}
        </main>
    )
}


async function getUser(uid: string) {
    try {
        const usersRef = collection(firebaseDB, 'accounts');
        const q = query(usersRef, where("auth_id", "==", uid));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            // User document data
            const userData = querySnapshot.docs[0].data();
            return userData;
        } else {
            console.log("No such user!");
        }
    } catch (e) {
        console.error("Error getting document:", e);
    }
}