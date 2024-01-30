import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { firebaseAuth, firebaseDB } from "../../config/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import Login from "./Login";
import style from './Admin.module.scss';

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
        <main className={style.admin_container}>
            {isAuthorized &&
                <nav className={style.admin_nav}>
                    <Link to="/dashboard"><button>Dashboard</button></Link>
                    <Link to="/rooms"><button>Rooms</button></Link>
                    <Link to="/schedules"><button>Schedules</button></Link>
                    <Link to="/users"><button>Users</button></Link>
                    <div>
                        <button onClick={() => firebaseAuth.signOut()}>Logout</button>
                    </div>
                </nav>
            }
            <article className={style.admin_content}>
                {isAuthorized ? <Outlet /> : <Login />}
            </article>
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