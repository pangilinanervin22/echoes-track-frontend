import style from './StatusInfoCard.module.scss';

export default function ScanInfoCard() {
	return (
		<div className={style.status_container}>
			<img src="/card-hand.svg" width={70} height={70} alt="hand with card" />
			<p>Please Insert Your Card</p>
		</div>
	);
}
