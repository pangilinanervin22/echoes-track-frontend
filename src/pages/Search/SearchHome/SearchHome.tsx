import style from './SearchHome.module.scss';
import { useState } from 'react';
import SearchBar from '../../../Components/Search/SearchBar/SearchBar';

export default function SearchHome() {
	const [isActive, setIsActive] = useState(true);

	return (
		<div className="main_wrapper">
			<h1>ECHOES: Search</h1>
			<p className={style.tagline}>
				Simplifying Attendance, One Scan at a Time
			</p>
			<p className={style.search}>Search by:</p>
			<div className={style.button_wrapper}>
				<button
					className={isActive ? style.student_active : ''}
					onClick={() => setIsActive(true)}
				>
					<div>
						<p>Student</p>
					</div>
				</button>
				<button
					className={!isActive ? style.teacher_active : ''}
					onClick={() => setIsActive(false)}
				>
					<div>
						<p>Teacher</p>
					</div>
				</button>
			</div>

			<SearchBar isStudent={isActive} />
		</div>
	);
}
