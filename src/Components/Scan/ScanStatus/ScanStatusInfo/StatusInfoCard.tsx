import style from './StatusInfoCard.module.scss';

export default function ScanInfoCard() {
	return (
		<div className={style.status_container}>
			<img src="/card-hand.svg" width={80} height={80} alt="hand with card" />
			<p>Please Insert Your Card</p>
		</div>
	);
}
