import { useState, useEffect } from 'react';
import style from './SearchNavBar.module.scss';
import DateIcon from './DateIcon';
import TimeIcon from './TimeIcon';

export default function SearchNavBar() {
	const [time, setTime] = useState(new Date());

	useEffect(() => {
		const timer = setInterval(() => {
			setTime(new Date());
		}, 60000); // Update time every minute

		// Cleanup function to clear the interval when the component unmounts
		return () => clearInterval(timer);
	}, []);

	const formatDate = (date: Date) => {
		const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
		const month =
			date.getMonth() + 1 < 10
				? `0${date.getMonth() + 1}`
				: date.getMonth() + 1;
		const year = date.getFullYear();

		return `${month}/${day}/${year}`;
	};

	return (
		<nav className={style.nav_wrapper}>
			<ul>
				<li></li>
				<li className={style.time_wrapper}>
					<div>
						<DateIcon /> {formatDate(time)}
					</div>
					<div>
						<TimeIcon />{' '}
						{time.toLocaleTimeString([], {
							hour: '2-digit',
							minute: '2-digit',
							hour12: false,
						})}
					</div>
				</li>
			</ul>
		</nav>
	);
}
