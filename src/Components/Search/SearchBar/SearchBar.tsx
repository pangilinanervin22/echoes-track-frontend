import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import style from './SearchBar.module.scss';

interface SearchBarProps {
	isStudent: boolean;
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
		<form className={style.form_wrapper} onSubmit={handleSubmit}>
			<input
				autoFocus
				type="text"
				placeholder="Insert ID/Name of The Student"
				value={search}
				onChange={handleChange}
			/>
			<input type="submit" value="Search" />
		</form>
	);
}
