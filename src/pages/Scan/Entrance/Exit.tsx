import { toast } from 'react-toastify';
import { useGetAllUsersWithRoom, useUpdateUserRoomByRFID } from '../../Admin/Attendance/useAttendance';
import style from './Entrance.module.scss';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useEffect } from 'react';


export default function Exit() {
	const { users } = useGetAllUsersWithRoom();
	const { updateUserRoom, } = useUpdateUserRoomByRFID();

	let arrString: string[] = [];
	// RFID Scanner
	useEffect(() => {
		const handleKeyPress = async (event: KeyboardEvent) => {
			// Check for RFID data in the keyboard input
			const scannedData: string = event.key;

			if (scannedData !== 'Enter') {
				arrString.push(scannedData);
			}

			// Assuming the Enter key indicates the end of an RFID scan
			if (event.key === 'Enter') {
				const rfid = arrString.join('');

				if (rfid === import.meta.env.VITE_RFID_ADMIN)
					return window.location.href = "/";

				const loading = toast.loading('Reading rfid...');
				const res = await updateUserRoom(rfid, "exit")
				toast.update(loading, {
					render: res.message,
					type: res.ok ? "success" : "error",
					autoClose: 2000,
					isLoading: false
				});
				// eslint-disable-next-line react-hooks/exhaustive-deps
				arrString = [];
			}
		};

		window.addEventListener('keypress', handleKeyPress);

		return () => {
			window.removeEventListener('keypress', handleKeyPress);
		};
	}, [arrString]);



	return (
		<main className={style.main}>
			<section className={style.students_wrapper}>
				<h1>Exit</h1>
				<div className={style.noOfStudents}>
					<p className={style.no}>{users.length}</p>
					<Icon icon="mdi:account" />
				</div>
				<p>Please insert your RFID Card</p>
			</section>
		</main>
	);
}
