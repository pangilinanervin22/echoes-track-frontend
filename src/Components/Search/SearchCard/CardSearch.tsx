import style from './CardSearch.module.scss';
import React from 'react';
interface User {
	fName: string;
	lName: string;
	room: string;
	url: string;
}

interface CardSearchProps {
	user: User;
}

export default function CardSearch({ user }: CardSearchProps) {
	return (
		<div className={style.SearchCard_wrapper}>
			<div className={style.img_wrapper}>
				<img className={style.card_img} src={user.url} alt="photo of" />
			</div>

			<div className={style.card_container}>
				<div className={style.super_wrapper}>
					<h2>
						{user.fName} <br /> {user.lName}
					</h2>
					<div className={style.info_wrapper}>
						<p>Current Room:</p>
						<h1>{user.room}</h1>
					</div>
				</div>
			</div>
		</div>
	);
}
