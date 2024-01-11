import { useSearchParams } from 'react-router-dom';
export default function SearchResult() {
	const [searchParams] = useSearchParams();
	const id = searchParams.get('id');

	return (
		<div className="main_wrapper">
			<h2 className={style.tag}>Results for: "{id}"</h2>
			<div className={style.card_wrapper}>test</div>
		<div>
			<h1>SearchResult: {id}</h1>

		</div>
	);
}
