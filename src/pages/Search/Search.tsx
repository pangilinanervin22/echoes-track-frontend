import { Outlet } from 'react-router-dom';

import './Search.scss';
import SearchNavBar from '../../Components/Search/SearchNavBar/SearchNavBar';

export default function Search() {
	return (
		<main className="main_wrapper">
			<SearchNavBar />
			<Outlet />
		</main>
	);
}
