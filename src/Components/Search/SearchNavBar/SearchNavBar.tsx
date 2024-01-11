import style from './SearchNavBar.module.scss';
export default function SearchNavBar() {
	return (
		<nav className={style.nav_wrapper}>
			<ul>
				<li>logo</li>
				<li className={style.time_wrapper}>
					<div>Date </div>
					<div>Time</div>
				</li>
			</ul>
		</nav>
	);
}
