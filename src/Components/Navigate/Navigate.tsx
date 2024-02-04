import { Link, useNavigate } from 'react-router-dom';
import style from './Navigate.module.scss';
import { Icon } from '@iconify/react/dist/iconify.js';
export default function Navigate() {
	const navigate = useNavigate();

	const handleClick = (destination: string) => {
		navigate(`/${destination}`);
	}

	return (
		<div className={style.wrap}>
			<main className={style.main}>
				<div className={style.title_wrapper}>
					<h1>ECHOES TRACKER:</h1>
					<h3>Navigation</h3>
				</div>
				<p>select your destination</p>
				<nav>
					<ul>
						<li onClick={() => handleClick("admin")}>
							<Icon icon="ri:admin-line" />
							<Link to="/admin">Admin</Link>
						</li>
						<li onClick={() => handleClick("room")}>
							<Icon icon="ri:rfid-fill" />
							<Link to="/room">Scan</Link>
						</li>
						<li onClick={() => handleClick("search")}>
							<Icon icon="cil:search" />
							<Link to="/search/home">Search</Link>
						</li>
					</ul>
				</nav>
			</main>
		</div>
	);
}
