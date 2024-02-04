import style from './ScanStatusWarn.module.scss';
import { Icon } from '@iconify/react/dist/iconify.js';
export default function ScanStatusWarn({ errorMessage }: { errorMessage: string }) {
	return (
		<div className={style.warn_wrapper}>
			<Icon icon="mi:circle-warning" width={'3rem'} /> <p>{errorMessage || "An Error has occured"}</p>
		</div>
	);
}
