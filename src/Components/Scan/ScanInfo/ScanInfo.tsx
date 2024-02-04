import styles from './ScanInfo.module.scss';
import { Icon } from '@iconify/react/dist/iconify.js';
interface ScanInfoProps {
	roomInfo: {
		course: string;
		name: string;
		total_student: number;
		section: string;
	};
}

export default function ScanInfo({ roomInfo }: ScanInfoProps) {
	return (
		<section className={styles.info_container}>
			<h2>
				Room: <span>{roomInfo.name}</span>
			</h2>
			<div className={styles.student_container}>
				<h1>{roomInfo.total_student}</h1>
				<Icon icon="mdi:account" width={'5rem'} />
			</div>
			<div className={styles.course_wrapper}>
				<h3>{roomInfo.course}</h3>
				<h3>{roomInfo.section}</h3>
			</div>
		</section>
	);
}
