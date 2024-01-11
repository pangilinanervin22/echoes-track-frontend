import style from './SearchHome.module.scss';
import SearchBar from '../../../Components/Search/SearchBar/SearchBar';

export default function SearchHome() {
	return (
		<div className="main_wrapper">
			{/* heading  */}
			<div className="heading_wrapper">
				<h1>ECHOES: Search</h1>
				<p className={style.tagline}>
					Simplifying Attendance, One Scan at a Time
				</p>
			</div>

			{/* button switch */}
			<div className={style.switch_wrapper}>
				<p>Search by:</p>

				{/* search bar */}
				<SearchBar />
			</div>
		</div>
	);
}
