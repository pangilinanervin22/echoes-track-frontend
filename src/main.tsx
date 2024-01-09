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
import Admin from './pages/Admin/Admin';

import './assets/reset.scss';
import './assets/font.scss';
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
			},
		],
	},
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>
);
