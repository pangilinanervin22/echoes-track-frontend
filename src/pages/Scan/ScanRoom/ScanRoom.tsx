import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './ScanRoom.module.scss';
import { useGetRoomByNameRealTime } from '../../Admin/Rooms/useRooms';

import SearchLoading from '../../../Components/Search/SearchLoading/SearchLoading';
import { Schedule } from '../../Admin/Schedules/useSchedules';
import { getDay, isWithinInterval, parse } from 'date-fns';
import ScanStatus from '../../../Components/Scan/ScanStatus/ScanStatus';
import ScanInfo from '../../../Components/Scan/ScanInfo/ScanInfo';
import ScanTable from '../../../Components/Scan/ScanTable/ScanTable';
import {
	useAddAttendance,
	useGetUsersWithinRoom,
} from '../../Admin/Attendance/useAttendance';
import ScanNoSched from '../../../Components/Scan/ScanNoSched/ScanNoSched';
import { Timestamp } from 'firebase/firestore';


export default function ScanRoom() {
	const params = useParams();
	const { getRoomByName, isLoading, schedules, room } =
		useGetRoomByNameRealTime();
	const [currentSchedule, setCurrentSchedule] = useState<
		Schedule | undefined
	>();
	const { addAttendance, loading, error } = useAddAttendance();
	const students = useGetUsersWithinRoom(params?.id || '');

	// Get room by name
	useEffect(() => {
		getRoomByName(params.id || '');

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [params.id]);

	// update current schedule
	useEffect(() => {
		// Function to update current schedule
		const updateCurrentSchedule = () => {
			const newCurrentSchedule = schedules.find(isCurrentDateInSchedule);
			setCurrentSchedule(newCurrentSchedule);
		};

		// Update current schedule immediately and at the start of every new hour
		updateCurrentSchedule();
		const intervalId = setInterval(updateCurrentSchedule, 1000 * 60 * 60);
		console.log('interval');

		// Clean up interval on component unmount
		return () => clearInterval(intervalId);
	}, [schedules]);

	// eslint-disable-next-line prefer-const
	let arrString: string[] = [];
	// RFID Scanner
	useEffect(() => {
		const handleKeyPress = (event: KeyboardEvent) => {
			// Check for RFID data in the keyboard input
			const scannedData: string = event.key;

			if (scannedData !== 'Enter') {
				arrString[arrString.length] = scannedData;

			}

			// Assuming the Enter key indicates the end of an RFID scan
			if (event.key === 'Enter' || !currentSchedule) {
				const rfid = arrString.join('');

				if (rfid === import.meta.env.VITE_RFID_ADMIN)
					return window.location.href = "/";

				addAttendance(
					{
						room: room?.name || '',
						studentId: arrString.join(''),
						date: Timestamp.now(),
						subject: currentSchedule?.subject || '',
					},
					rfid
				);

				// eslint-disable-next-line react-hooks/exhaustive-deps
			}
		};

		window.addEventListener('keypress', handleKeyPress);

		return () => {
			window.removeEventListener('keypress', handleKeyPress);
		};
	}, [arrString]);

	if (isLoading) {
		return <SearchLoading />;
	}

	if (!room) {
		return <ScanNoSched message={`Room ${params.id} does not exist`} />
	}
	else if (!currentSchedule) {
		return <ScanNoSched message={"There are no schedules for this room"} />
	}


	return (
		<main className={styles.wrapper_main}>
			{/* first column */}
			<div className={styles.col_wrapper}>
				<ScanInfo
					roomInfo={{
						name: room?.name || '',
						total_student: students?.length || 0,
						course: currentSchedule?.subject || 'N/A',
						section: currentSchedule?.section || 'N/A',
					}}
				/>
				<ScanStatus statusCode={loading} message={error} />
			</div>
			{/* second column */}
			<section className={styles.table_wrapper}>
				<ScanTable students={students}></ScanTable>
			</section>
		</main>
	);
}

// gets scehdule
function isCurrentDateInSchedule(schedule: Schedule): boolean {
	const days = [
		'Sunday',
		'Monday',
		'Tuesday',
		'Wednesday',
		'Thursday',
		'Friday',
		'Saturday',
	];
	const currentDate = new Date();

	const currentDay = days[getDay(currentDate)];
	console.log(currentDay);

	// Parse schedule start and end times to Date objects for comparison
	const start = parse(schedule.start, 'h:mm aa', new Date());
	const end = parse(schedule.end, 'h:mm aa', new Date());

	// Check if current day and time falls within the schedule
	const isWithinSchedule =
		currentDay === schedule.day &&
		isWithinInterval(currentDate, { start, end });

	// If the current hour exceeds the end time of the schedule, revalidate the schedule
	if (isWithinSchedule && currentDate > end) {
		return false;
	}

	return isWithinSchedule;
}
