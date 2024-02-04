import style from './ScanStatus.module.scss';
import ScanInfoCard from './ScanStatusInfo/StatusInfoCard';
import ScanStatusLoading from './ScanLoading/ScanStatusLoading';
import ScanStatusSuccess from './ScanStatusSuccess/ScanStatusSuccess';
import ScanStatusWarn from './ScanStatusWarn/ScanStatusWarn';

const returnStatus = (status: number, message: string) => {
	if (status == 1) {
		return <ScanInfoCard />;
	} else if (status == 2) {
		return <ScanStatusSuccess />;
	} else if (status == 3) {
		return <ScanStatusWarn errorMessage={message} />;
	}
	return <ScanStatusLoading />;
};

export default function ScanStatus({ statusCode, message }: { statusCode: number, message: string }) {
	return (
		<section className={style.status_container}>
			{returnStatus(statusCode, message)}
		</section>
	);
}
