import style from './SearchLoading.module.scss';
export default function SearchLoading() {
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
