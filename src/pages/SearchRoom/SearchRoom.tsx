import style from './Room.module.scss';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SearchBarIcon() {
	return (
		<svg
			className={style.search_icon}
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 -960 960 960"
		>
			<path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
		</svg>
	);
}

export default function SearchRoom() {
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
		navigate(`/scan/${encodeURIComponent(search)}`);
	};

	return (
		<main className={style.main_wrapper}>
			<section>
				<h1>
					ECHOES: <span>Room</span>
				</h1>
				<p>Search the room you want to issue </p>
				<form className={style.form_wrapper} onSubmit={handleSubmit}>
					<input
						autoFocus
						type="text"
						placeholder="Enter your room number"
						value={search}
						onChange={handleChange}
					/>
					<button type="submit">
						<SearchBarIcon></SearchBarIcon>
					</button>
				</form>
				<img src="/classroom.svg" alt="classroom" />
			</section>
		</main>
	);
}
