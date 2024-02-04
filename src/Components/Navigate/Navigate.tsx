import { Link } from 'react-router-dom';
import style from './Navigate.module.scss';
export default function Navigate() {
	return (
		<main className={style.main}>
			<h2>Echoes Tracker Navigation</h2>
			<nav>
				<ul>
					<li>
						<Link to="/admin">Admin</Link>
					</li>
					<li>
						<Link to="/room">Scan</Link>
					</li>
					<li>
						<Link to="/search/home">Search</Link>
					</li>
				</ul>
			</nav>
		</main>
	);
}
