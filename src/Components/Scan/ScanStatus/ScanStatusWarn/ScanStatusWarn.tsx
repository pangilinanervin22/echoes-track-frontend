import style from './ScanStatusWarn.module.scss';
import { Icon } from '@iconify/react/dist/iconify.js';
export default function ScanStatusWarn() {
	return (
		<div className={style.warn_wrapper}>
			<Icon icon="mi:circle-warning" width={'2rem'} /> <p>Please Scan Again</p>
		</div>
	);
}
