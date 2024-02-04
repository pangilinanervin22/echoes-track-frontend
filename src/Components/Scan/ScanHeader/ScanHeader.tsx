import { useEffect, useState } from 'react';
import { format, getDay, isWithinInterval, parse } from 'date-fns';
import styles from './ScanHeader.module.scss';
import { Icon } from '@iconify/react/dist/iconify.js';

export function CurrentTime() {
	const [currentDateTime, setCurrentDateTime] = useState(new Date());

	useEffect(() => {
		// Update date and time every second
		const intervalId = setInterval(() => {
			setCurrentDateTime(new Date());
			// console.log(currentDateTime.getSeconds());
		}, 1000);

		// Clean up interval on component unmount
		return () => clearInterval(intervalId);
	}, [currentDateTime]);

	return (
		<div className={styles.time_wrapper}>
			<span className={styles.combo_wrapper}>
				<Icon width="2rem" color=" #f6bf35" icon="mdi:calendar-today" />
				<p> {format(currentDateTime, 'MM/dd/yyyy')}</p>
			</span>
			<span className={styles.combo_wrapper}>
				<Icon
					width="2rem"
					color=" #f6bf35"
					icon="mdi:clock-time-four-outline"
				/>
				<p>{format(currentDateTime, 'h:mm aa')}</p>
			</span>
		</div>
	);
}

export default function ScanHeader() {
	return (
		<header className={styles.header_wrapper}>
			<p>
				Echoes: <span>Scan</span>
			</p>
			<CurrentTime></CurrentTime>
		</header>
	);
}
