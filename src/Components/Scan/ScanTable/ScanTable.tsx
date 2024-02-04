import { User } from '../../../pages/Admin/Users/useUsers';
import style from './ScanTable.module.scss';



function tableRows(students: User[]) {
	const rows = [];
	for (let i = 0; i < students.length; i++) {
		rows.push(
			<tr key={i}>
				<td className={style.img}>
					<img src={students[i].image} alt="" />
				</td>
				<td>{students[i].name}</td>
				<td>{students[i].id}</td>
				<td>{students[i].role}</td>
			</tr>
		);
	}
	return rows;
}

export default function ScanTable({
	students,
}: {
	students: User[];
}) {
	return (
		<div className={style.table_wrapper}>
			<table cellSpacing={0} className={style.table_container}>
				<tbody>
					<tr>
						<th>Image</th>
						<th>Name</th>
						<th>Student #</th>
						<th>time-in</th>
					</tr>
					{tableRows(students)}
				</tbody>
			</table>
		</div>
	);
}
