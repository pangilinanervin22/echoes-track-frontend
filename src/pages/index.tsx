import { Outlet, useLocation } from 'react-router-dom';
import Navigate from '../Components/Navigate/Navigate';
export default function RootLayout() {
	const location = useLocation();

	// how to do i get the url
	// const { url } = useRouteMatch();

	return <>{location.pathname === '/' ? <Navigate></Navigate> : <Outlet />}</>;
}
