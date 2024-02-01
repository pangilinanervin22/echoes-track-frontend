import styles from './ScanInfo.module.scss';
import { Icon } from '@iconify/react/dist/iconify.js';
interface ScanInfoProps {
	roomInfo: {
		course: string;
		room: string;
		student: number;
	};
}

export default function ScanInfo({ roomInfo }: ScanInfoProps) {
	return (
		<section className={styles.info_container}>
			<h2>
				Room: <span>{roomInfo.room}</span>
			</h2>
			<div className={styles.student_container}>
				<h1>{roomInfo.student}</h1>
				<Icon icon="mdi:account" width={'5rem'} />
			</div>
			<div className={styles.course_wrapper}>
				<h3>{roomInfo.course}</h3>
			</div>
		</section>
	);
}
