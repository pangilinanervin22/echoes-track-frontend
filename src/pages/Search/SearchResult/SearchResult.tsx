import { useState, useEffect, ChangeEvent } from 'react';
import firebase from 'firebase/app';
import 'firebase/database';
import CardSearch from '../../../Components/Search/SearchCard/CardSearch';
import { useSearchParams } from 'react-router-dom';
import style from './SearchResult.module.scss';
import { Link } from 'react-router-dom';

export default function SearchResult() {
	const [searchParams] = useSearchParams();
	const id = searchParams.get('id');

	// dummy data
	const [data, setData] = useState([
		{ fName: 'A', lName: 'guadalupe', room: 'test' },
		{ fName: 'B', lName: 'ignacio', room: 'test2' },
		{ fName: 'C', lName: 'ignacio', room: 'test2' },
	]);
	const [loading, setLoading] = useState(false);

	const [selectedOption, setSelectedOption] = useState('');

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
				<Link to="/search/home">Go back </Link>
				<div className={style.selection_wrapper}>
					<p>Filter By: </p>
					<select value={selectedOption} onChange={handleChange} id="cars">
						<option value="" selected>
							None
						</option>
						<option value="ascending">A-Z</option>
						<option value="descending">Z-A</option>
					</select>
				</div>
			</div>

			<div className={style.cards_container}>
				{loading ? 'Loading...' : renderList.length ? renderList : 'Not Found'}
			</div>
		</section>
	);
}
