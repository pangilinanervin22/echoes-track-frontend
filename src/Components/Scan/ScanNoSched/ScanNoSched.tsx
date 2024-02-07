import { useNavigate } from 'react-router-dom';
import style from './ScanNoSched.module.scss';

export default function ScanNoSched({ message }: { message: string }) {
	const navigation = useNavigate();
	return (
		<main className={style.container}>
			<h2 >{message}</h2>
			<button
				className={style.button}
				onClick={() => navigation("/scan")}>
				back to scan</button>
		</main>
	);
}
