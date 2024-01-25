import { useState, useEffect, ChangeEvent } from 'react';
import { Icon } from '@iconify/react';
import firebase from 'firebase/app';
import 'firebase/database';
import CardSearch from '../../../Components/Search/SearchCard/CardSearch';
import { useSearchParams } from 'react-router-dom';
import style from './SearchResult.module.scss';
import { Link } from 'react-router-dom';

export default function SearchResult() {
	const [searchParams] = useSearchParams();
	const id = searchParams.get('id');

	// here is where you put your firebase magic
	useEffect(() => {
		// const db = firebase.database();
		// db.ref(`your-data-path/${id}`)
		// 	.once('value')
		// 	.then(snapshot => {
		// 		const data = snapshot.val();
		// 		setData(data);
		// 		setLoading(false);
		// 	})
		// 	.catch(error => {
		// 		console.error('There was an error!', error);
		// 		setLoading(false);
		// 	});
	}, [id]);

	// dummy data
	const [data, setData] = useState([
		{ fName: 'D', lName: 'guadalupe', room: 'test' },
		{ fName: 'A', lName: 'ignacio', room: 'test2' },
		{ fName: 'C', lName: 'ignacio', room: 'test2' },
	]);
	const [loading, setLoading] = useState(false);

	const [selectedOption, setSelectedOption] = useState('');

	// handle the changes of the filter
	const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
		setSelectedOption(event.target.value);
		if (event.target.value === 'ascending') {
			setData(data.sort((a, b) => a.fName.localeCompare(b.fName)));
		} else if (event.target.value === 'descending') {
			setData(data.sort((a, b) => b.fName.localeCompare(a.fName)));
		}
	};

	const renderList = data.map((item, index) => {
		return <CardSearch user={item} />;
	});

	return (
		<section className={style['result-container']}>
			<h1>
				Results for: <span className={style.accent}>{id}</span>
			</h1>

			<div className={style.navigation_wrapper}>
				<Link className={style.back_wrapper} to="/search/home">
					<Icon
						icon="lets-icons:back"
						color="#163aeb"
						width="1.5rem"
						height="1.5rem"
					/>{' '}
					<p> Go Back</p>
				</Link>
				<div className={style.selection_wrapper}>
					<p>Sort By: </p>
					<select
						className={style.selection}
						value={selectedOption}
						onChange={handleChange}
					>
						<option value="" selected>
							None
						</option>
						<option className={style.option} value="ascending">
							A-Z
						</option>
						<option value="descending">Z-A</option>
					</select>
				</div>
			</div>

			<div className={style.cards_container}>
				{loading ? (
					<div>hello</div>
				) : renderList.length ? (
					renderList
				) : (
					'Not Found'
				)}
			</div>
		</section>
	);
}
