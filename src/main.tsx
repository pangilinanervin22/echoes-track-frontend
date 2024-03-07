import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import {
	createBrowserRouter,
	RouterProvider,
	Navigate,
} from 'react-router-dom';

import RootLayout from './pages';
import Scan from './pages/Scan/Scan';
import Search from './pages/Search/Search';
import SearchResult from './pages/Search/SearchResult/SearchResult';
import SearchHome from './pages/Search/SearchHome/SearchHome';
import Dashboard from './pages/Admin/Dashboard/Dashboard';
import Admin from './pages/Admin/Admin';
import './assets/scss/reset.scss';
import './assets/scss/font.scss';
import './assets/scss/global.scss';
import Room from './pages/Admin/Rooms/Rooms';
import SearchRoom from './pages/SearchRoom/SearchRoom';
import FirebaseSample from './Components/FirebaseSample/FirebaseSample';
import Schedule from './pages/Admin/Schedules/Schedules';
import AddSchedule from './pages/Admin/Schedules/AddSchedule/AddSchedule';
import EditSchedule from './pages/Admin/Schedules/EditSchedule/EditSchedule';
import Users from './pages/Admin/Users/Users';
import EditUser from './pages/Admin/Users/EditUser/EditUser';
import AddUser from './pages/Admin/Users/AddUser/AddUser';
import ScanRoom from './pages/Scan/ScanRoom/ScanRoom';
import Attendance from './pages/Admin/Attendance/Attendance';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import Entrance from './pages/Scan/Entrance/Entrance';
import Exit from './pages/Scan/Entrance/Exit';
import Account from './pages/Admin/Account/Account';
import AddAccount from './pages/Admin/Account/AddAccount/AddAccount';
import EditAccount from './pages/Admin/Account/EditAccount/EditAccount';

const router = createBrowserRouter([
	{
		path: '/',
		caseSensitive: false,
		element: <RootLayout />,
		children: [
			{
				path: '/scan',
				element: <Scan />,
				children: [
					{ path: '', element: <Navigate to="/room" replace /> },
					{ path: ':id', element: <ScanRoom /> },
					{ path: 'entrance', element: <Entrance /> },
					{ path: 'exit', element: <Exit /> },
				],
			},
			{
				path: '/room',
				element: <SearchRoom />,
			},
			{
				path: '/search',
				element: <Search />,
				children: [
					{ path: '', element: <Navigate to="home" replace /> },
					{ path: 'home', element: <SearchHome /> },
					{ path: 'result', element: <SearchResult /> },
				],
			},
			{
				path: '/admin',
				element: <Admin />,
				children: [
					{ path: '', element: <Navigate to="room" replace /> },
					{ path: 'dashboard', element: <Dashboard /> },
					{ path: 'room', element: <Room /> },
					{
						path: 'schedule',
						element: <Schedule />,
						children: [
							{ path: 'add', element: <AddSchedule /> },
							{ path: ':id', element: <EditSchedule /> },
						],
					},
					{
						path: 'user',
						element: <Users />,
						children: [
							{ path: 'add', element: <AddUser /> },
							{ path: ':id', element: <EditUser /> },
						],
					},
					{
						path: 'attendance',
						element: <Attendance />,
						children: [
							{ path: 'add', element: <AddUser /> },
							{ path: ':id', element: <EditUser /> },
						],
					},
					{
						path: 'account',
						element: <Account />,
						children: [
							{ path: 'add', element: <AddAccount /> },
							{ path: ':id', element: <EditAccount /> },
						],
					},
				],
			},
			{
				path: '/sample',
				element: <FirebaseSample />,
			},
		],
	},
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<RouterProvider router={router} />
		<ToastContainer position="bottom-center" autoClose={2000} limit={3} />
	</React.StrictMode>
);
