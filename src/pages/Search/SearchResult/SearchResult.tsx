import { useSearchParams } from 'react-router-dom';
import '../Search.scss';
export default function SearchResult() {
	const [searchParams] = useSearchParams();
	const id = searchParams.get('id');

	return (
		<div className="main_wrapper">
			<h1>Results for: {id}</h1>
		</div>
	);
}
