import style from './ScanTable.module.scss';

interface ScanTableProps {
	imgUrl: string;
	name: string;
	studentNo: number;
	timeIn: string;
}

function tableRows(students: ScanTableProps[]) {
	const rows = [];
	for (let i = 0; i < students.length; i++) {
		rows.push(
			<tr key={i}>
				<td className={style.img}>
					<img src={students[i].imgUrl} alt="" />
				</td>
				<td>{students[i].name}</td>
				<td>{students[i].studentNo}</td>
				<td>{students[i].timeIn}</td>
			</tr>
		);
	}
	return rows;
}

export default function ScanTable({
	students,
}: {
	students: ScanTableProps[];
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
