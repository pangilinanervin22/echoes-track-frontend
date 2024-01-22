import { useSearchParams } from 'react-router-dom';
import style from './SearchResult.module.scss';
export default function SearchResult() {
	const [searchParams] = useSearchParams();
	const id = searchParams.get('id');

	return (
		<div className="main_wrapper">
			<h1>Search results: {id}</h1>
			<div className={style.card_wrapper}>test</div>
		</div>
	);
}
