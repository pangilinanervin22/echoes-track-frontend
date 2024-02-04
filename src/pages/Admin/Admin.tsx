import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { firebaseAuth, firebaseDB } from "../../config/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import Login from "./Login";
import style from './Admin.module.scss';
import cvsulogo from '../../assets/images/cvsuLOGO.png'
import { Icon } from "@iconify/react/dist/iconify.js";

export default function Admin() {
    const location = useLocation();
    console.log(location.pathname, location);

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
                    <div className={style.titleContainer}>
                        <img src={cvsulogo} alt="" />
                        <h1>Echoes Tracker</h1>
                    </div>
                    <div className={style.second}>
                        <div>

                        <Link to="/admin/dashboard" className={`${style.iconCont} ${location.pathname.startsWith("/admin/dashboard") ? style.active : ''}`}>
                            <Icon icon="material-symbols:dashboard" color="white" width="25px" margin-top="70px" display="flex" align-items="center" justify-content="center" />
                            <button>Dashboard</button>
                        </Link>
                        <Link to="/admin/room" className={`${style.iconCont} ${location.pathname.startsWith("/admin/room") ? style.active : ''}`}>
                            <Icon icon="cbi:roomsother" color="white" width="25px" margin-top="70px" display="flex" align-items="center" justify-content="center" />
                            <button>Rooms</button>
                        </Link>
                        <Link to="/admin/schedule" className={`${style.iconCont} ${location.pathname.startsWith("/admin/schedule") ? style.active : ''}`}>
                            <Icon icon="ant-design:schedule-filled" color="white" width="25px" margin-top="70px" display="flex" align-items="center" justify-content="center" />
                            <button>Schedules</button>
                        </Link>
                        <Link to="/admin/user" className={`${style.iconCont} ${location.pathname.startsWith("/admin/user") ? style.active : ''}`}>
                            <Icon icon="mdi:user" color="white" width="25px" margin-top="70px" display="flex" align-items="center" justify-content="center" />
                            <button>Users</button>
                        </Link>
                        <Link to="/admin/attendance" className={`${style.iconCont} ${location.pathname.startsWith("/admin/attendance") ? style.active : ''}`}>
                            <Icon icon="icon-park-solid:notes" color="white" width="25px" margin-top="70px" display="flex" align-items="center" justify-content="center" />
                            <button>Attendance</button>
                        </Link>
                        </div>
                        <div className="bttm">
                        <div className={style.iconContt}>
                            <Icon icon="material-symbols:logout" color="white" width="25px" margin-top="70px" display="flex" align-items="center" justify-content="center" />
                            <button onClick={() => firebaseAuth.signOut()}>Logout</button>
                        </div>
                        </div>
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