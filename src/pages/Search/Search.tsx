import { Outlet } from 'react-router-dom';
// import style from './Search.module.scss';

export default function Search() {
	return (
		<main>
			<h1>Search</h1>
			<Outlet />
		</main>
	);
}
