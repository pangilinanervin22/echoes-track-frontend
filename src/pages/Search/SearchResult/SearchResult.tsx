import { useSearchParams, Link } from 'react-router-dom';
import style from './SearchResult.module.scss';

export default function SearchResult() {
	const [searchParams] = useSearchParams();
	const id = searchParams.get('id');

	return (
		<section className="result-container">
			<h1>
				Results for: <span className={style.accent}>{id}</span>
			</h1>

			{/* contain za card */}
			<div className={style.card_wrapper}>test</div>

			<Link to="/search/home">Go back </Link>
		</section>
	);
}
