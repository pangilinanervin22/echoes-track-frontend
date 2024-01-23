import { useState, useEffect } from 'react';
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
		{ fName: 'test', lName: 'guadalupe', room: 'test' },
		{ fName: 'test2', lName: 'ignacio', room: 'test2' },
	]);
	const [loading, setLoading] = useState(true);

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

	const renderList = data.map((item, index) => {
		return <CardSearch user={item} />;
	});

	return (
		<section className={style['result-container']}>
			<h1>
				Results for: <span className={style.accent}>{id}</span>
			</h1>
			<Link to="/search/home">Go back </Link>
			{/* contain za card */}

			<select></select>
			<div className={style.cards_container}>
				{loading ? 'Loading...' : renderList.length ? renderList : 'Not Found'}
			</div>
		</section>
	);
}
