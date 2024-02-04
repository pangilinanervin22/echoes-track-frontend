import style from './Entrance.module.scss';
import { Icon } from '@iconify/react/dist/iconify.js';
export default function Entrance() {
	return (
		<main className={style.main}>
			<section className={style.students_wrapper}>
				<h1>Entrance</h1>
				<div className={style.noOfStudents}>
					<p className={style.no}>21</p>
					<Icon icon="mdi:account" />
				</div>
			</section>

			<section className={style.students_wrapper}>
				About lagay ng magic text
			</section>
		</main>
	);
}
