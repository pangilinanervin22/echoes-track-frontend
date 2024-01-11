import style from './SearchHome.module.scss';
import SearchBar from '../../../Components/Search/SearchBar/SearchBar';

export default function SearchHome() {
	return (
		<div className="main_wrapper home">
			{/* heading  */}
			<div className="heading_wrapper">
				<h1>ECHOES: Search</h1>
				<p className={style.tagline}>
					Simplifying Attendance, One Scan at a Time
				</p>
			</div>

			<SearchBar />
		</div>
	);
}
