import SearchBarNotFound from '../SearchBar/SearchBarNotFound';
import styles from './SeachNotFound.module.scss';
export default function SearchNotFound() {
	return (
		<div className={styles.found_wrapper}>
			<h1>No results found </h1>
			<p>Please try again</p>
			<SearchBarNotFound />
		</div>
	);
}
