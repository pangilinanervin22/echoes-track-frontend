import style from './ScanStatus.module.scss';
import ScanInfoCard from './ScanStatusInfo/StatusInfoCard';
import ScanStatusLoading from './ScanLoading/ScanStatusLoading';
import ScanStatusSuccess from './ScanStatusSuccess/ScanStatusSuccess';
import ScanStatusWarn from './ScanStatusWarn/ScanStatusWarn';

const returnStatus = (status: number) => {
	if (status == 1) {
		return <ScanInfoCard />;
	} else if (status == 2) {
		return <ScanStatusSuccess />;
	} else if (status == 3) {
		return <ScanStatusWarn />;
	}
	return <ScanStatusLoading />;
};

export default function ScanStatus({ statusCode }: { statusCode: number }) {
	return (
		<section className={style.status_container}>
			{returnStatus(statusCode)}
		</section>
	);
}
