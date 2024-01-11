import { useSearchParams } from 'react-router-dom';
export default function SearchResult() {
	const [searchParams] = useSearchParams();
	const id = searchParams.get('id');

	return (
		<div>
			<h1>SearchResult: {id}</h1>
		</div>
	);
}
