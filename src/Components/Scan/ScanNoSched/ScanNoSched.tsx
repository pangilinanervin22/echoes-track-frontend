import { useEffect } from 'react';
import style from './ScanNoSched.module.scss';

export default function ScanNoSched({ message }: { message: string }) {
	return (
		<main className={style.container}>
			<h2>{message}</h2>
		</main>
	);
}
