import { Outlet } from 'react-router-dom';
import style from './Search.module.scss';

export default function Search() {
	return (
		<main className={style.main_wrapper}>
			<h1>Echoes Tracker</h1>
			<p>Search any nigga you want</p>
			<Outlet />
		</main>
	);
}
