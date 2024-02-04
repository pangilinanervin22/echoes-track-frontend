import { useState, ChangeEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Icon } from '@iconify/react';

import 'firebase/database';

import SearchNotFound from '../../../Components/Search/SearchNotFound/SearchNotFound';
import CardSearch from '../../../Components/Search/SearchCard/CardSearch';
import SearchLoading from '../../../Components/Search/SearchLoading/SearchLoading';
import { Link } from 'react-router-dom';

import style from './SearchResult.module.scss';
import { useGetUsers } from '../../Admin/Users/useUsers';

export default function SearchResult() {
	const [searchParams] = useSearchParams();
	const id = searchParams.get('id');
	const { users, loading } = useGetUsers();
	const [ascending, setAscending] = useState(true);
	const [selectedOption, setSelectedOption] = useState('');

	// handle the changes of the filter
	const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
		setSelectedOption(event.target.value);
		if (event.target.value === 'ascending') {
			setAscending(true);

		} else if (event.target.value === 'descending') {
			setAscending(false);
		}
	};

	let filteredUsers = users;
	filteredUsers = users.sort((a, b) => {
		if (ascending) {
			return a.name.localeCompare(b.name);
		} else {
			return b.name.localeCompare(a.name);
		}
	}
	);
	if (id) {
		filteredUsers = users.filter((user) => {
			return user.name.toLowerCase().includes(id.toLowerCase());
		});
	}

	const renderList = filteredUsers.map((item) => {
		return <CardSearch user={item} />;
	});

	return (
		<section className={style['result-container']}>
			<h1>
				Results for: <span className={style.accent}>{id}</span>
			</h1>
			<div className={style.navigation_wrapper}>
				<Link className={style.back_wrapper} to="/search/home">
					<div>
						<Icon icon="lets-icons:back" color="#163aeb" width="2rem" />
						<p> Go Back</p>
					</div>

					<hr className={style.line} />
				</Link>

				<div className={style.selection_wrapper}>
					<div className={style.sort_wrapper}>
						<Icon icon="flowbite:sort-outline" color="#5b86eb" width="2rem" />
						<p>Sort By: </p>
					</div>

					<select
						className={style.selection}
						value={selectedOption}
						onChange={handleChange}
					>
						<option value="" selected>
							None
						</option>
						<option className={style.option} value="ascending">
							A-Z
						</option>
						<option value="descending">Z-A</option>
					</select>
				</div>
			</div>

			<div className={style.cards_container}>
				{loading ? (
					<SearchLoading></SearchLoading>
				) : renderList.length ? (
					renderList
				) : (
					<SearchNotFound />
				)}
			</div>
		</section>
	);
}
