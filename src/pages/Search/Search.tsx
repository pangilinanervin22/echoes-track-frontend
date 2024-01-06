import { Outlet } from 'react-router-dom';
import style from './Search.module.scss';

export default function Search() {
	return (
		<main className={style.main_wrapper}>
			<h1>ECHOES: Search</h1>
			<p className={style.tagline}>
				Simplifying Attendance, One Scan at a Time
			</p>

			<Outlet />
		</main>
	);
}
