import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import {
	createBrowserRouter,
	RouterProvider,
	Navigate,
} from 'react-router-dom';
// import './global.scss';

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
import FirebaseSample from './Components/FirebaseSample/FirebaseSample';
import Schedule from './pages/Admin/Schedules/Schedules';
import AddSchedule from './pages/Admin/Schedules/AddSchedule';
import EditSchedule from './pages/Admin/Schedules/EditSchedule';

const router = createBrowserRouter([
	{
		path: '/',
		caseSensitive: false,
		element: <RootLayout />,
		children: [
			{
				path: '/scan',
				element: <Scan />,
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
					{ path: '', element: <Navigate to="dashboard" replace /> },
					{ path: 'room', element: <Room />, },
					{
						path: 'schedule', element: <Schedule />,
						children: [
							{ path: 'add', element: <AddSchedule /> },
							{ path: ':id', element: <EditSchedule />, },
						]
					},
					{ path: 'dashboard', element: <Dashboard /> },
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
	</React.StrictMode>
);
