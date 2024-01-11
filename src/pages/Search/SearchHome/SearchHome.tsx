import style from './SearchHome.module.scss';
import SearchBar from '../../../Components/Search/SearchBar/SearchBar';

export default function SearchHome() {
	return (
		<section className={style.home_container}>
			{/* heading  */}
			<div className={style.title_wrapper}>
				<h1>
					ECHOES: <span className={style.accent}> Search</span>
				</h1>
				<p className={style.tagline}>
					Simplifying Attendance, One Scan at a Time
				</p>
			</div>
			{/* search bar */}
			<div className={style.searchbar_wrapper}>
				<SearchBar />
			</div>
		</section>
	);
}
