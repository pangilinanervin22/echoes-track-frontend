import { useSearchParams, Link } from 'react-router-dom';
import style from './SearchResult.module.scss';
import CardSearch from '../../../Components/Search/SearchCard/CardSearch';
export default function SearchResult() {
	const [searchParams] = useSearchParams();
	const id = searchParams.get('id');

	return (
		<section className={style['result-container']}>
			<h1>
				Results for: <span className={style.accent}>{id}</span>
			</h1>
			<Link to="/search/home">Go back </Link>
			{/* contain za card */}
			<div className={style.cards_container}>
				<CardSearch></CardSearch>
				<CardSearch></CardSearch>
			</div>
		</section>
	);
}
