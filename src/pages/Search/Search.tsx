import { Outlet } from 'react-router-dom';
import './Search.scss';

export default function Search() {
	return (
		<main className="main_wrapper">
			<Outlet />
		</main>
	);
}
