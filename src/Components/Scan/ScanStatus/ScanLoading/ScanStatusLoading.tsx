import style from './ScanStatusLoading.module.scss';

export default function ScanStatusLoading() {
	return (
		<div className={style.pulse_wrapper}>
			<div className={style.pulse}></div>
			<div className={style.pulse}></div>
			<div className={style.pulse}></div>
			<div className={style.pulse}></div>
			<div className={style.pulse}></div>
			<div className={style.pulse}></div>
		</div>
	);
}
