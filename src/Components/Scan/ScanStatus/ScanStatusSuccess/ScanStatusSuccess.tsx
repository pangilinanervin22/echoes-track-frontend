import style from './ScanStatusSuccess.module.scss';
import { Icon } from '@iconify/react/dist/iconify.js';
export default function ScanStatusSuccess() {
	return (
		<div className={style.success_wrapper}>
			<Icon icon="material-symbols:check-circle-outline" width={'3rem'} />
			<p>Success</p>
		</div>
	);
}
