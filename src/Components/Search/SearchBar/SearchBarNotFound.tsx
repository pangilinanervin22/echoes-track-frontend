import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import style from './SearchBar.module.scss';
import SearchBarIcon from './SearchBarIcon';

interface SearchBarProps {
	isStudent?: boolean;
}

export default function SearchBar({ isStudent }: SearchBarProps) {
	const [search, setSearch] = useState('');
	const navigate = useNavigate();

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearch(event.target.value);
	};

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		if (search === '') return;
		// Handle the search logic here
		console.log(search);
		// Redirect to /search/result with search as a query parameter
		navigate(`/search/result?id=${encodeURIComponent(search)}`);
		console.log(isStudent);
	};

	return (
		<form className={style.form_wrapper_nf} onSubmit={handleSubmit}>
			<input
				autoFocus
				type="text"
				placeholder="Type the proctor's name here"
				value={search}
				onChange={handleChange}
			/>
			<button type="submit">
				<SearchBarIcon></SearchBarIcon>
			</button>
		</form>
	);
}
