import SearchBar from '../SearchBar/SearchBar';
import styles from './SeachNotFound.module.scss';
export default function SearchNotFound() {
	return (
		<div className={styles.found_wrapper}>
			<h1>No results found </h1>
			<p>Please try again</p>
			<SearchBar />
		</div>
	);
}
