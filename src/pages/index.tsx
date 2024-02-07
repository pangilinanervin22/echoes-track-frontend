import { Outlet, useLocation } from 'react-router-dom';
import Navigate from '../Components/Navigate/Navigate';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { firebaseAuth, firebaseDB } from '../config/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import Login from './Admin/Login';
export default function RootLayout() {
	const location = useLocation();

	// how to do i get the url
	// const { url } = useRouteMatch();

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

	return <>
		{!isAuthorized ?
			<Login /> :
			<>
				{location.pathname === '/' ? <Navigate /> : <Outlet />}
			</>
		}
	</>;
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