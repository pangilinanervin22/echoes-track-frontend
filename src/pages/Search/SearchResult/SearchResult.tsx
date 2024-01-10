import { useSearchParams } from 'react-router-dom';
import '../Search.scss';
import style from './SearchResult.module.scss';
export default function SearchResult() {
	const [searchParams] = useSearchParams();
	const id = searchParams.get('id');

	return (
		<div className="main_wrapper">
			<h2 className={style.tag}>Results for: "{id}"</h2>
			<div className={style.card_wrapper}></div>
		</div>
	);
}
